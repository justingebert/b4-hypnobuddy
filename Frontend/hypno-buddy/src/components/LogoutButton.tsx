import React from "react";

const LogoutButton = ({ onLogout }): any => {
    const handleClick = async() => {
        await onLogout();
    };
    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.borderColor = '#56c8c9';
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.borderColor = '#4F45DA';
    };

    return (
        <button onClick={handleClick}
                style={{
                    backgroundColor: '#4F45DA',
                    borderColor: '#56c8c9',
                }}
                onMouseOver={handleMouseOver}
                onMouseOut={handleMouseOut}
        >Logout</button>
    );
};

export default LogoutButton;
