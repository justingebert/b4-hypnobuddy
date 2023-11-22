import React, { useEffect, useState } from 'react';

function ProfilePage() {
    const [data, setData] = useState(null);
    const [code, setCode] = useState('');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3000/user/profile/data', {
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


    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        try {
            const response = await fetch('http://localhost:3000/user/verify', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code: code }),
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log('Verification successful:', responseData);
                // Handle successful verification
            } else {
                console.error('Verification failed:', responseData);
                // Handle failed verification
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    if (!data) {
        return <div>Profile Loading...</div>;
    }

    return (
        <div className="profile-page">
            <h1>Your Profile</h1>
            <strong>Name:</strong> {data.user.name.first} {data.user.name.last}
            <br />
            <strong>Email:</strong> {data.user.email}
            <br />
            <strong>Role</strong> {data.user.role}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
}

export default ProfilePage;
