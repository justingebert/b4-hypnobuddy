import React, { useEffect, useState } from 'react';

function ProfilePage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/profile/data',{
            method: 'GET',
            credentials: 'include',
        })
            .then(response => response.json())
            .then(data => setData(data));
    }, []);

    if (!data) {
        return <div>Profile Loading...</div>;
    }

    return (
        <div className="">
            <h1>your profile</h1>
        </div>
    );
}

export default ProfilePage;
