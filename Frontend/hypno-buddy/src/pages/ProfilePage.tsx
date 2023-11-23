import React, {useContext, useEffect, useState} from 'react';
import {FlashContext} from "../contexts/FlashContext.tsx";
import {useNavigate} from "react-router-dom";

function ProfilePage() {
    const [data, setData] = useState(null);
    const [code, setCode] = useState('');
    const [linkCode, setLinkCode] = useState('')
    const [patients, setPatients] = useState([{}])

    const { flash } = useContext(FlashContext);
    const navigate = useNavigate();


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

    const getPatients = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/profile/patients', {
                method: 'GET',
                credentials: 'include',
            });

            const responseData = await response.json();

            if (response.ok) {
                console.log(responseData.patients);
                setPatients(responseData.patients);
            } else {
                flash(responseData.message);
            }
        } catch (error) {
            console.error('Error getting patients:', error);
        }
    }

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
            {data.user.role === 'therapist' && (
                <>
                <p><strong>Code to give to patients:</strong> {data.user.patientLinkingCode}</p>
                <button onClick={getPatients}>See linked Patients</button>
                </>
            )}
            {/* List of linked patients */}
            {data.user.role === 'therapist' && (
                <>
                    <h2>Linked Patients</h2>
                    {patients.length > 0 ? (
                        <ul>
                            {patients.map((patient) => (
                                <li key={patient._id}>
                                    {/*patient.name.first} {patient.name.last*/}1
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No patients linked yet.</p>
                    )}
                </>
            )}
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
            {data.user.role === 'patient' && (

                <form onSubmit={handleLinkSubmit}>
                    <input
                        type="text"
                        value={linkCode}
                        onChange={(e) => setLinkCode(e.target.value)}
                        placeholder="Enter link to therapist code"
                    />
                    <button type="submit">Link to Therapist</button>
                </form>
            )}

        </div>
    );
}

export default ProfilePage;
