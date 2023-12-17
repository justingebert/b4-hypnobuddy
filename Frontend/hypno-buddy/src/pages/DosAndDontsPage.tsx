import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Fear } from '../../../../Backend/data/model/fearModel.ts';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import styles from '../styles/TherapistCard.module.css';
import {FlashContext} from "../contexts/FlashContext.tsx";

function DosAndDontsPage() {
  const navigate = useNavigate();
  const { flash } = useContext(FlashContext);
  const [fears, setFears] = useState<Fear[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedFearId, setSelectedFearId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fearResponse = await fetch(`http://localhost:3000/dosAndDonts/fears`);
        const fearData = await fearResponse.json();

        setFears(fearData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddNewFearClick = () => {
    navigate('/dosanddonts/t/newFear');
  };

  const handleFearDelete = async (fearId: string) => {
    try {
      // Make a DELETE request to your backend endpoint to delete the fear and its associated entries
      await fetch(`http://localhost:3000/dosAndDonts/fears/${fearId}`, {
        method: 'DELETE',
      });

      // Remove the closed fear from the state
      setFears((prevFears) => prevFears.filter((fear) => fear._id !== fearId));
      flash('Fear deleted successfully!');
    } catch (error) {
      console.error('Error closing fear:', error);
    }
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode((prevMode) => !prevMode);
  };

  const handleDeleteButtonClick = (fearId: string) => {
    console.log('Delete button clicked for fear ID:', fearId);
    setSelectedFearId(fearId);
  };

  const handleDeleteConfirm = async () => {
    if (selectedFearId) {
      await handleFearDelete(selectedFearId);
    }
    setIsDeleteMode(false);
    setSelectedFearId(null);
  };

  const handleDeleteCancel = () => {
    setSelectedFearId(null);
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.h1}>Do's & Dont's</h1>
      <div className={styles.welcomeContainer}>
        <p className={styles.welcomeText}>
          Liebe TherapeutInnen!<br />
          Nutzen Sie die Kraft, das Leben junger Menschen durch Ihre Anleitung zu verändern. <br /> Ihre Dos and Don'ts-Listen sind der Kompass für Eltern, die den Weg zum emotionalen Wohlbefinden ihres Kindes einschlagen. <br />Mit jeder Einsicht sähen Sie die Samen der Widerstandsfähigkeit und fördern das Wachstum eines helleren Morgen.
        </p>
      </div>
      <div className={styles.cardContainer}>
        {fears.map((fear) => (
            <div className={styles.card} key={fear._id}>
              <Link className={styles.cardContent} to={`/dosanddonts/t/${fear._id}`}>
                <h3>{fear.name}</h3>
              </Link>
              {isDeleteMode && (
                  <button
                    onClick={() => handleDeleteButtonClick(fear._id)}
                    className="btn btn-danger"
                  >
                    <b>x</b>
                  </button>
              )}
              {isDeleteMode && selectedFearId === fear._id && (
                  <DeleteConfirmationModal
                      isOpen={isDeleteMode}
                      onCancel={handleDeleteCancel}
                      onConfirm={handleDeleteConfirm}
                  />
              )}
            </div>
        ))}
      </div>
      <div className={styles.centerContainer}>
        <button className={styles.button} onClick={handleAddNewFearClick}><b>+</b></button>
        <br></br>
        <button onClick={handleDeleteModeToggle} className="btn btn-danger">
          {isDeleteMode ? 'Abbrechen' : 'Angst löschen'}
        </button>
      </div>
    </div>
  );
}

export default DosAndDontsPage;
