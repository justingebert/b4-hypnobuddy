import React, { useEffect, useState } from 'react';

function ProfilePage() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/profile/data', {
                    method: 'GET',
                    credentials: 'include',
                });

                const responseData = await response.json();
                setData(responseData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
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
