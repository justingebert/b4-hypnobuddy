import React from "react";
import { useNavigate } from "react-router-dom";

const LoginButton = ({ }): any => {
    const navigate = useNavigate();

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

    const handleClick = (): void => {
        // Navigate to /login on button click
        navigate("/login");
    };

    return (
        <button
            style={{
                backgroundColor: '#3e368d',
                borderColor: '#3e368d',
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
