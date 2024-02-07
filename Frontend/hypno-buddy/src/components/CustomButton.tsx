import React from "react";
import { useNavigate } from "react-router-dom";

interface ButtonProps {
    buttonText: string;
    backgroundColor: string;
    hoverColor: string;
    borderColor: string;
    borderHoverColor: string;
    handleClick: () => void;
}

const CustomButton: React.FC<ButtonProps> = ({
                                                 buttonText,
                                                 backgroundColor,
                                                 hoverColor,
                                                 handleClick,
                                                 borderColor,
                                                 borderHoverColor,

                                             }: ButtonProps) => {
    const navigate = useNavigate();

    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.backgroundColor = hoverColor;
        target.style.borderColor = borderHoverColor;};

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.backgroundColor = backgroundColor;
        target.style.borderColor = borderColor;
    };

    return (
        <button
            style={{
                backgroundColor: backgroundColor,
                borderColor: backgroundColor,
                margin: '15px',
                minWidth:'80px',
                fontSize: '18px'
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
            onClick={() => {
                handleClick();
              //  navigate("/login");
            }}
        >
            {buttonText}
        </button>
    );
};

export default CustomButton;
