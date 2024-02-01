import React from "react";
import styles from "../styles/Navbar.module.scss";
const LogoutButton = ({ onLogout }): any => {
    const handleClick = async() => {
        await onLogout();
    };
    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.borderColor = '#ff6641';
        target.style.backgroundColor = '#ff6641';
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.borderColor = '#3e368d';
        target.style.backgroundColor = '#3e368d';
    };

    return (
        <button onClick={handleClick}
                style={{
                    backgroundColor: '#3e368d',
                    borderColor: '#3e368d',
                }}
                className={styles.buttonLogin}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
        >Logout</button>
    );
};

export default LogoutButton;
