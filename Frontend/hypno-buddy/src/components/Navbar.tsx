import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Logo from '../assets/hb.svg';
import styles from '../styles/Navbar.module.css';
import { useAuth } from "../contexts/AuthContext.tsx";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NavbarPage = () => {
    const { isAuthenticated, user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const handleLogoutClick = async () => {
        await handleLogout();
        navigate("/");
        // You may also add a redirect here if needed
    };
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary navbar-nav1" sticky="top" bg="dark" data-bs-theme="dark" >
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <img src={Logo} alt="logo" className={styles.logo} />
                    <h3>Hypno Buddy</h3>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#features">Platzhalter</Nav.Link>
                        <Nav.Link href="/profile">Profil</Nav.Link>
                        <Nav.Link href="/" className="nav-link active" aria-current="page">
                            Home
                        </Nav.Link>
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
                    </Nav>
                    <Nav>
                        <Navbar.Text>
                            Signed in as: <a href="/login">XXX</a>
                        </Navbar.Text>
                        <Nav.Link href="#deets">
                            {isAuthenticated && user ? (
                                <>
                                    <Link to="/dosanddonts" className={styles.navLink}>Dos&Donts</Link>
                                    <Link to="/roadmap" className={styles.navLink}>Roadmap</Link>
                                    <Link to="/profile" className={styles.navLink}>
                                        <div className={styles.userEmail}>{user.name.first + " " + user.name.last}</div>
                                    </Link>
                                    <LogoutButton onLogout={handleLogoutClick} className={styles.logoutButton} />
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className={styles.navLink}>Login</Link>
                                </>
                            )}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};
export default NavbarPage;