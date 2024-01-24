import React, { useState, useEffect } from 'react';
import styles from '../styles/TherapistCard.module.css';
import {ListGroup } from 'react-bootstrap';
import {useAuth} from "../contexts/AuthContext.tsx";
import {User} from "../types/User.ts";


function TherapistCard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState<Array<User>>([]);
    const [addedPatients, setAddedPatients] = useState<Array<string>>([]);
    const {selectedPatient, selectPatient} = useAuth();

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await fetch('http://localhost:3000/user/profile/patients', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const responseData = await response.json();
                setPatients(responseData.patients);
                selectPatient(responseData.patients[0]);
            } else {
                console.error('Failed to get patients:', response.statusText);
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
                            <ListGroup.Item key={patient._id}>
                                {patient._id === selectedPatient?._id ? (
                                    <button className={"btn btn-outline-primary w-100"} onClick={() => selectPatient(patient)}>
                                        {patient.name.first} {patient.name.last}
                                    </button>
                                ) : (
                                    <button className={"btn btn-light w-100"} onClick={() => selectPatient(patient)}>
                                        {patient.name.first} {patient.name.last}
                                    </button>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </div>
        </>
    );
}
export default TherapistCard;