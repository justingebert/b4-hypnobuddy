import React from "react";
import { useNavigate } from "react-router-dom";

const LoginButton = ({ }): any => {
    const navigate = useNavigate();

    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.borderColor = '#56c8c9';
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.borderColor = '#4F45DA';
    };

    const handleClick = (): void => {
        // Navigate to /login on button click
        navigate("/login");
    };

    return (
        <button
            style={{
                backgroundColor: '#4F45DA',
                borderColor: '#56c8c9',
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={handleClick}
        >
            Login
        </button>
    );
};

export default LoginButton;
