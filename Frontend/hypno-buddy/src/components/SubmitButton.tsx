import { BsArrowRightCircle } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import React, { ReactElement } from "react";

const SubmitButton = (): ReactElement => {
    const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.borderColor = '#56c8c9';
    };

    const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>): void => {
        const target = e.target as HTMLButtonElement;
        target.style.borderColor = '#4F45DA';
    };

    return (
        <Button
            type="submit"
            className="m-1"
            style={{
                color: 'yourDesiredColor',
                backgroundColor: '56c8c9',
                borderColor: '56c8c9',
                transition: 'background-color 0.3s',  // Add a smooth transition effect
            }}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <BsArrowRightCircle />
        </Button>
    );
};

export default SubmitButton;
