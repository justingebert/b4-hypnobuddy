import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Logo from '../assets/hb.svg';
import styles from '../styles/Navbar.module.css';

const Navbar = ({ isLoggedIn, handleLogout }:any) => {
    return (

        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div className="container-fluid">
                <Link to="/" className={styles.logoLink}>
                    <img src={Logo} alt="logo" className={styles.logo} />
                    <h1 className={styles.title}>Hypno Buddy</h1>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNavDropdown"
                    aria-controls="navbarNavDropdown"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/" className="nav-link active" aria-current="page">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/features" className="nav-link">
                                Features
                            </Link>
                        </li>

                        <li className="nav-item dropdown">
                            {isLoggedIn.isAuthenticated && isLoggedIn.user ? (
                                <>
                                    <LogoutButton onLogout={handleLogout} className={styles.logoutButton} />
                                    <div className={styles.userEmail}>
                                        {isLoggedIn.user.name.first} {isLoggedIn.user.name.last}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className={styles.navLink}>
                                        Login
                                    </Link>
                                    <Link to="/register" className={styles.navLink}>
                                        Register
                                    </Link>
                                </>
                            )}

                            {/* Dropdown-Elemente */}
                            <ul className="dropdown-menu">
                                <li>
                                    <Link to="/action" className="dropdown-item">
                                        Action
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/another-action" className="dropdown-item">
                                        Another Action
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/something-else" className="dropdown-item">
                                        Something Else Here
                                    </Link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
