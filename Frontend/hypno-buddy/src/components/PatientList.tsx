import React, { useState, useEffect } from 'react';
import styles from '../styles/TherapistCard.module.css';
import {ListGroup } from 'react-bootstrap';


function TherapistCard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState<Array<{ _id: string; name: { first: string } }>>([]);
    const [addedPatients, setAddedPatients] = useState<Array<string>>([]);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
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
                console.log(responseData.message);
            }
        } catch (error) {
            console.error('Error getting patients:', error);
        }
    };

    const filteredPatients = patients.filter((patient) =>
        !addedPatients.includes(patient._id) &&
        patient.name.first.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(
        <>
            <div className={"listContainer w-25"}>
                <div className={"listTitle"}><h2>Patienten</h2></div>
                <div className={"patientSearchInput"}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="PatientInnen suchen..."
                        className={styles.searchInput}
                    />
                </div>
                <div className={"patientList"}>
                    <ListGroup className={`${styles.patientList} ${styles.scrollable}`}>
                        {filteredPatients.map((patient, index) => (
                            <ListGroup.Item key={index}>
                                <button className={"btn btn-light w-100"}>{patient.name.first} {patient.name.last}</button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>
        </>
    );
}
export default TherapistCard;