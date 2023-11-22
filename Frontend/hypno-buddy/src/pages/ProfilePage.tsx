import React, {useContext, useEffect, useState} from 'react';
import {FlashContext} from "../contexts/FlashContext.tsx";

function ProfilePage() {
    const [data, setData] = useState(null);
    const [code, setCode] = useState('');
    const [linkCode, setLinkCode] = useState('')

    const { flash } = useContext(FlashContext);


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


    const handleVerifySubmit = async (event) => {
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
                flash(responseData.message);
            } else {
                flash(responseData.message);
            }
        } catch (error) {
            console.error('Error sending verification code:', error);
        }
    };

    const handleLinkSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/user/link', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ patientCode: linkCode }),
            });

            const responseData = await response.json();

            if (response.ok) {
                flash(responseData.message);
            } else {
                flash(responseData.message);
            }
        } catch (error) {
            console.error('Error sending link to therapist code:', error);
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
            {/* Verification Form */}
            <form onSubmit={handleVerifySubmit}>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter verification code"
                />
                <button type="submit">Verify</button>
            </form>
            {/* Link to Therapist Form */}
            <form onSubmit={handleLinkSubmit}>
                <input
                    type="text"
                    value={linkCode}
                    onChange={(e) => setLinkCode(e.target.value)}
                    placeholder="Enter link to therapist code"
                />
                <button type="submit">Link to Therapist</button>
            </form>
        </div>
    );
}

export default ProfilePage;
