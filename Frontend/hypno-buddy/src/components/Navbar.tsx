import {Link, useNavigate} from 'react-router-dom';
import LogoutButton from './LogoutButton';
import Logo from '../assets/hb.svg';
import styles from '../styles/Navbar.module.css';
import {useAuth} from "../contexts/AuthContext.tsx";

const Navbar = () => {
    const { isAuthenticated, user, handleLogout } = useAuth();
    const navigate = useNavigate();
    const handleLogoutClick = async () => {
        await handleLogout();
        navigate("/");
        // You may also add a redirect here if needed
    };

    return (
        <nav className={styles.navbar}>
            <Link to="/" className={styles.logoLink}>
                <img src={Logo} alt="logo" className={styles.logo} />
                <h1 className={styles.title}>Hypno Buddy</h1>
            </Link>

            <div className={styles.navItems}>
                {isAuthenticated && user ? (
                 //TODO i think is is not a good approach to let 2 fetches go before rendering
                    <>
                        <LogoutButton onLogout={handleLogoutClick} className={styles.logoutButton} />
                        <div className={styles.userEmail}>{user.name.first + " " + user.name.last}</div>
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
