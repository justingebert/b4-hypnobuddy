import React, { useState, useEffect } from 'react';
import styles from '../styles/TherapistCard.module.scss';
import { Offcanvas, Button, ListGroup } from 'react-bootstrap';
import {url} from "../contexts/AuthContext.tsx";

interface TherapistCardProps {
  initialTitle?: string;
  leftTextField: string;
  rightTextField: string;
  isEditMode: boolean;
  isLeftField: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onTitleChange: (newTitle: string) => void;
  onTextAreaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClose: () => void;
}

function TherapistCard({
  initialTitle = "Titel hinzufügen.",
  leftTextField,
  rightTextField,
  isEditMode,
  isLeftField,
  onEditToggle,
  onSave,
  onTitleChange,
  onTextAreaChange,
  onClose,
}: TherapistCardProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<Array<{ _id: string; name: { first: string } }>>([]);
  const [newPatient, setNewPatient] = useState('');
  const [searchQueryLinked, setSearchQueryLinked] = useState('');
  const [PatientsLinked, setPatientsLinked] = useState([]);
  const [loadingLinked, setLoadingLinked] = useState(false);
  const [addedPatients, setAddedPatients] = useState<Array<string>>([]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(url + '/user/profile/patients', {
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
  const fetchPatientsLinked = async () => {
    const fullUrl = window.location.href;
    const lastSlashIndex = fullUrl.lastIndexOf('/');
    const fearId = fullUrl.substring(lastSlashIndex + 1);

    try {
      setLoadingLinked(true);

      const response = await fetch(url + '/user/getAllPatientsLinked', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fearId: fearId,
        }),
      });

      const data = await response.json();
      setPatientsLinked(data);
    } catch (error) {
      console.error('Error fetching linked patients:', error);
    } finally {
      setLoadingLinked(false);
    }
  };

  useEffect(() => {
    fetchPatientsLinked();
  }, []);

  const handleSearchChangeLinked = (e) => {
    setSearchQueryLinked(e.target.value);
  };

  const stopPropagationLinked = (e) => {
    e.stopPropagation();
  };

  const filteredPatientsLinked = PatientsLinked.filter(
    (patientLinked) =>
      typeof patientLinked.name.first === 'string' &&
      patientLinked.name.first.toLowerCase().includes(searchQueryLinked.toLowerCase())
  );

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  const filteredPatients = patients.filter((patient) =>
      !addedPatients.includes(patient._id) && !PatientsLinked.some(linkedPatient => linkedPatient._id === patient._id) && // Exclude linked patients
      patient.name.first.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addPatient = async (patientId: any) => {
    const fullUrl = window.location.href;
    const lastSlashIndex = fullUrl.lastIndexOf('/');
    const fearId = fullUrl.substring(lastSlashIndex + 1);

    try {

      const response = await fetch(url + '/dosAndDonts/fears/addUserToFear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: patientId,
          fearId: fearId,
        }),
      });

      console.log('Response:', response);

      if (response.ok) {
        fetchPatientsLinked();

      } else {
        console.error('Failed to add patient:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding patient:', error);
    }

  };


  const deletePatient = async (userId: any) => {
    const fullUrl = window.location.href;
    const lastSlashIndex = fullUrl.lastIndexOf('/');
    const fearId = fullUrl.substring(lastSlashIndex + 1);
    try {

      const response = await fetch(url + '/dosAndDonts/fears/deleteUserToFear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          fearId: fearId,
        }),
      });

      console.log('Response:', response);

      if (response.ok) {
        fetchPatientsLinked();

      } else {
        console.error('Failed to delete patient:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding patient:', error);
    }

  };

  return (
      <div className={styles.therapistCard}>
        {/* Sidebar Toggle Button */}
        <button
            className={`${styles.toggleSidebarButton} position-absolute top-0 start-0`}
            onClick={toggleSidebar}
        >
          ☰
        </button>

        {/* Offcanvas Sidebar */}
        <Offcanvas show={showSidebar}
                   onHide={() => setShowSidebar(false)}
                   style={{
                     backgroundColor: '#ededed',
                     border: '2px',
                     padding: '1.5rem',
                     color: '#3e368d'
                   }}
        >
          <Offcanvas.Header closeButton style={{margin: '1rem', color: '#3e368d' }}>
            <Offcanvas.Title><h2>Patienten</h2></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{backgroundColor:'#FFFFFF', borderRadius: '15px'}}>
            {/* Search Input */}
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="PatientInnen suchen..."
                className={styles.searchInput}
            />

            {/* Patient List with Scroll */}
            <ListGroup className={`${styles.patientList} ${styles.scrollable}`}>
              {filteredPatients.map((patient, index) => (
                  <ListGroup.Item key={index}>
                    <Button onClick={() => addPatient(patient._id)} className={styles.addButton}>
                      +
                    </Button>
                    {patient.name.first} {patient.name.last}

                  </ListGroup.Item>
              ))}
            </ListGroup>

            {/* Add Patient Input */}
            <div className={styles.addPatientContainer}>
              <input
                  type="text"
                  value={searchQueryLinked}
                  onChange={handleSearchChangeLinked}
                  onClick={stopPropagationLinked}
                  placeholder="Verlinkte PatientInnen suchen..."
                  className={styles.searchInput}
              />
              {loadingLinked ? (
                  <p>Loading...</p>
              ) : (
                  <ListGroup className={`${styles.patientList} ${styles.scrollable}`}>
                    {filteredPatientsLinked.map((patientLinked, index) => (
                        <ListGroup.Item key={index}>
                          <Button
                            onClick={() => deletePatient(patientLinked._id)}
                            className={styles.addButton}
                          >
                            -
                          </Button>
                          {patientLinked.name.first} {patientLinked.name.last}

                        </ListGroup.Item>
                    ))}
                  </ListGroup>
              )}
            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Header Container - Includes title and close button */}
          <div className={`${styles.therapistCardHeader} position-relative`}>
            {/* Close button at the upper right corner of the card */}
            <button
                className={`${styles.closeButton} position-absolute top-0 start-100`}
                onClick={onClose}
            >
              &times;
            </button>

            {/* Title Positioned at the top center */}
            {isEditMode ? (
                <input
                    type="text"
                    value={initialTitle}
                    onChange={(e) => onTitleChange(e.target.value)}
                    className={styles.editableTitle}
                    placeholder="Titel hinzufügen..."
                />
            ) : (
                <h2 className={styles.therapistCardTitle}>{initialTitle}</h2>
            )}
          </div>

          {/* Containers - Divided into left and right */}
          <div className={styles.therapistCardContainer}>
            {/* Left Container */}
            <div className={styles.therapistCardLeft}>
              {/* Subheading for Left Container */}
              <h4>Don't</h4>

              {/* Text Field with Cream background */}
              <textarea
                  value={leftTextField}
                  onChange={onTextAreaChange}
                  className={`${styles.creamTextField} editable left`}
                  placeholder="Schreibe hier etwas..."
                  readOnly={!isEditMode}
                  rows={3}
              />
            </div>

            {/* Right Container */}
            <div className={styles.therapistCardRight}>
              {/* Subheading for Right Container */}
              <h4>Do</h4>

              {/* Text Field with Cream background */}
              <textarea
                  value={rightTextField}
                  onChange={onTextAreaChange}
                  className={`${styles.creamTextField} editable right`}
                  placeholder="Schreibe hier etwas..."
                  readOnly={!isEditMode}
                  rows={3}
              />
            </div>
          </div>

          {/* Button for Edit/Save */}
          <button className={styles.editSaveButton} onClick={isEditMode ? onSave : onEditToggle}>
            {isEditMode ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
  );
}
export default TherapistCard;