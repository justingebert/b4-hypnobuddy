import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton.tsx';
import Logo from '../assets/hb.svg';
import styles from '../styles/Navbar.module.css';
import { useAuth } from '../contexts/AuthContext.tsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavbarComponent = () => {
    const { isAuthenticated, user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const handleLogoutClick = async () => {
        await handleLogout();
        navigate('/');
    };

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;

            setVisible(
                (prevScrollPos > currentScrollPos &&
                    prevScrollPos - currentScrollPos > 70) ||
                currentScrollPos < 10
            );

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos, visible]);

    return (
        <Navbar
            collapseOnSelect
            expand="lg"
            className={`navbar-nav1 fixed-top ${visible ? 'visible' : 'hidden'}`}
            bg="dark"
            data-bs-theme="dark"
        >
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src={Logo} alt="logo" className={styles.logo} />
                    <h3 className="ms-2">Hypno Buddy</h3>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/" className="nav-link active" aria-current="page">
                            Home
                        </Nav.Link>
                        {isAuthenticated && user ? (
                        <NavDropdown title="Feature" id="collapsible-nav-dropdown">
                            <NavDropdown.Item href="/dosanddonts" className={styles.navLink}>
                                Dos&Donts
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/roadmap" className={styles.navLink}>
                                Roadmap
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                        ) : null}
                    </Nav>
                    <Nav>
                        <Nav.Link href="#deets" className="d-flex">
                            {isAuthenticated && user ? (
                                <>
                                    <Nav.Link href="/profile" className={styles.navLink}>
                                        <div className={styles.userEmail}>
                                            <Navbar.Text>
                                                Eingeloggt:
                                            </Navbar.Text>
                                            {" " + user.name.first + " " + user.name.last}
                                        </div>
                                    </Nav.Link>
                                    <LogoutButton onLogout={handleLogoutClick}/>
                                </>
                            ) : (
                                <>
                                    <LoginButton/>
                                </>
                            )}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default NavbarComponent;