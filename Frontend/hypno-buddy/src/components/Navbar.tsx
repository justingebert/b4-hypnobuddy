import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import LoginButton from './LoginButton.tsx';
import Logo from '../assets/hb.svg';
import styles from '../styles/Navbar.module.scss';
import { useAuth } from '../contexts/AuthContext.tsx';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const NavbarComponent = () => {
    const { isAuthenticated, user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const handleLogoutClick = async () => {
        await handleLogout();
        navigate("/");
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
                            <p className={styles.navHover}> Home </p>
                        </Nav.Link>
                        {isAuthenticated && user ? (
                            <Nav>
                                {user.role === 'therapist' ? (
                                    <Nav.Link href="/dosanddonts/t" className="nav-link active" aria-current="page">
                                        <p className={styles.navHover}> Dos & Don'ts</p>
                                    </Nav.Link>
                                ) : (
                                    <Nav.Link href="/dosanddonts/p" className={`nav-link active ${styles.navHover}`} aria-current="page">
                                        <p className={styles.navHover}>Dos & Don'ts</p>
                                    </Nav.Link>
                                )}
                                <Nav.Link href="/roadmap" className="nav-link active" aria-current="page">
                                    <p className={styles.navHover}> Roadmap </p>
                                </Nav.Link>
                                {user.role === 'patient' ? (
                                    <Nav.Link href="/reflexion-add" className="nav-link active" aria-current="page">
                                        <p className={styles.navHover}>  Reflexion </p>
                                    </Nav.Link>
                                ) : null}
                            </Nav>

                        ) : null}
                    </Nav>
                    <Nav>
                        <Nav.Link href="#deets" className="d-flex">
                            {isAuthenticated && user ? (
                                <>
                                    <Nav.Link href="/profile" className={styles.navLink}>
                                        <div className={styles.userEmail}>
                                            <Navbar.Text>
                                                <p>Eingeloggt:</p>
                                            </Navbar.Text>
                                            <b>{" " + user.name.first + " " + user.name.last}</b>
                                        </div>
                                    </Nav.Link>
                                    <LogoutButton onLogout={handleLogoutClick} />
                                </>
                            ) : (
                                <>
                                    <LoginButton />
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