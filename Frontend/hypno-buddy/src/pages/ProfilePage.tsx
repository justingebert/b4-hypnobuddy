import { useContext, useEffect, useState } from 'react';
import { FlashContext } from "../contexts/FlashContext.tsx";
import { useNavigate } from "react-router-dom";
import '../styles/Profil.css';
import SubmitButton from "../components/SubmitButton.tsx";
import { Form, FormControl, Button, Row, Col } from 'react-bootstrap';

function ProfilePage() {
    const [data, setData] = useState(null);
    const [code, setCode] = useState('');
    const [linkCode, setLinkCode] = useState('')
    const [patients, setPatients] = useState([])

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
        getPatients()
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
        console.log('linking')
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
            <div className="background">
                <div className="containerProfil">
                    <div className="textContentProfil">
                        <h1 className="headerProfil">Mein Profil</h1>
                        <div className="m-4">
                            <strong className="textProfil" >Name:</strong> {data.user.name.first} {data.user.name.last}
                            <br />
                            <strong className="textProfil">Email:</strong> {data.user.email}
                            <br />
                        </div>
                        <div className="divForm  m-4">
                            <strong className="textProfil">Rolle</strong> {data.user.role}
                            <br />
                            {data.user.role === 'therapist' && (
                                <>
                                    <p><strong className="textProfil">Code zur Weitergabe an Patienten:</strong> {data.user.patientLinkingCode}</p>

                                    <Button onClick={getPatients} className="p-1 m-2">Siehe verlinkte Patienten</Button>
                                </>
                            )}
                            <br />
                            {/* List of linked patients */}
                            {data.user.role === 'therapist' && (
                                <>
                                    <h2 className="textProfil">Verlinkte Patienten</h2>
                                    {patients && patients.length > 0 ? (
                                        <ul>
                                            {patients.map((patient) => (
                                                <li key={patient._id}>
                                                    {patient.name.first} {patient.name.last}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Es sind noch keine Patienten verlinkt.</p>
                                    )}
                                </>
                            )}
                            {/* Verification Form */}
                            <Form onSubmit={handleVerifySubmit}>
                                <Row className=" d-flex align-items-center submitLayout">
                                    <Col>
                                        <FormControl
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            placeholder="Verifizierungscode eingeben"
                                            id="Verifizierungscode"
                                            className="form"
                                        />
                                    </Col>
                                    <Col>
                                        <SubmitButton></SubmitButton>
                                    </Col>
                                </Row>
                            </Form>
                            {/* Link to Therapist Form */}
                            {data.user.role === 'patient' && (
                                <Form onSubmit={handleLinkSubmit}>
                                    <Row className="d-flex align-items-center submitLayout">
                                        <Col>
                                            <FormControl
                                                type="text"
                                                value={linkCode}
                                                onChange={(e) => setLinkCode(e.target.value)}
                                                placeholder="Link zum Therapeuten-Code eingeben"
                                                className="form"
                                            />
                                        </Col>
                                        <Col>
                                            <SubmitButton></SubmitButton>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </div>
                    </div>
                    <div className="">
                        {/* platzhalter für message */}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default ProfilePage;
