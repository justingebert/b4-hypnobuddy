import React from 'react';

const LogoutButton = ({ onLogout }) => {
    return (
        <button onClick={onLogout}>Logout</button>
    );
};

export default LogoutButton;
