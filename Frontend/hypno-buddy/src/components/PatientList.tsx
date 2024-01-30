import React, { useState } from 'react';
import styles from '../styles/TherapistCard.module.scss';
import {ListGroup } from 'react-bootstrap';
import {useAuth} from "../contexts/AuthContext.tsx";
//import {User} from "../types/User.ts";


function PatientList() {
    const [searchQuery, setSearchQuery] = useState('');
    const {patients, selectedPatient, selectPatient} = useAuth();


    const filteredPatients = patients.filter((patient) =>
        patient.name.first.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.name.last.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return(
        <>
            <div className={"listContainer w-25"} style={{boxShadow: '0 10px 15px rgba(62, 54, 141, 0.5)', backgroundColor: 'rgba(237, 237, 237, 0.5)',}}>
                <div className={"listTitle"}><h2 style={{color:'#3e368d'}}>Patient:Innen</h2></div>
                <div className={"patientSearchInput"}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Patient:Innen suchen..."
                        className={styles.searchInput}
                    />
                </div>
                <div className={"patientList"}>
                    <ListGroup className={`${styles.patientList} ${styles.scrollable}`}>
                        {filteredPatients.map((patient, index) => (
                            <ListGroup.Item key={patient._id}>
                                {patient._id === selectedPatient?._id ? (
                                    <button className={`btn ${styles['custom-border-color']} w-100`} onClick={() => selectPatient(patient)}>
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
export default PatientList;