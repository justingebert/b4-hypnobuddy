import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Logo from '../assets/hb.svg';
import styles from '../styles/Navbar.module.css';

const Navbar = ({ isLoggedIn, handleLogout }: any) => {
    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logoLink}>
                <img src={Logo} alt="logo" className={styles.logo} />
                <h1 className={styles.title}>Hypno Buddy</h1>
            </Link>

            <div className={styles.navItems}>
                {isLoggedIn.isAuthenticated && isLoggedIn.user ? ( //TODO i think is is not a good approach to let 2 fetches go before rendering
                    <>
                        <Link to="/dosanddonts" className={styles.navLink}>Dos&Donts</Link>
                        <Link to="/roadmap" className={styles.navLink}>Roadmap</Link>
                        <Link to="/profile" className={styles.navLink}>
                            <div className={styles.userEmail}>{isLoggedIn.user.name.first + " " + isLoggedIn.user.name.last}</div>
                        </Link>
                        <LogoutButton onLogout={handleLogout} className={styles.logoutButton} />
                    </>
                ) : (
                    <>
                        <Link to="/login" className={styles.navLink}>Login</Link>
                        <Link to="/register" className={styles.navLink}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
