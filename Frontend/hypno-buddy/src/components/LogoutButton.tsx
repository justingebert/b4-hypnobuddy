
const LogoutButton = ({ onLogout }): any => {
    const handleClick = async() => {
        await onLogout();
    };

    return (
        <button onClick={handleClick}>Logout</button>
    );
};

export default LogoutButton;
