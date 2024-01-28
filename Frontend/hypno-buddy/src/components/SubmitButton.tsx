import { BsArrowRightCircle } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import { ReactElement, useState } from "react";

const SubmitButton = (): ReactElement => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseOver = () => {
        setIsHovered(true);
    };

    const handleMouseOut = () => {
        setIsHovered(false);
    };

    const buttonStyle = {
        backgroundColor: isHovered ? '#ff6641' : '#3e368d',
        borderColor: isHovered ? '#ff6641' : '#3e368d',
    };

    const iconStyle = {
        color: isHovered ? '#ffffff' : '#ffffff',
    };

    return (
        <Button
            type="submit"
            className="m-1"
            style={buttonStyle}
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
        >
            <BsArrowRightCircle style={iconStyle} />
        </Button>
    );
};

export default SubmitButton;
