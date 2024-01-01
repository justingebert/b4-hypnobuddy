import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import { Fear } from '../../../../Backend/data/model/fearModel.ts';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import styles from '../styles/TherapistCard.module.css';
import {FlashContext} from "../contexts/FlashContext.tsx";
import NewFearModal from "../components/NewFearModal.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";

function DosAndDontsPage() {
  const {user} = useAuth();
  const navigate = useNavigate();
  const { flash } = useContext(FlashContext);
  const [fears, setFears] = useState<Fear[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedFearId, setSelectedFearId] = useState<string | null>(null);
  const [isNewFearModalOpen, setIsNewFearModalOpen] = useState(false);
  const [newFearTitle, setNewFearTitle] = useState('');
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const fearResponse = await fetch(`http://localhost:3000/dosAndDonts/fears?therapistId=${user._id}`);
          const fearData = await fearResponse.json();

          setFears(fearData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddNewFearClick = () => {
    setIsNewFearModalOpen(true);
  };

  const handleFearDelete = async (fearId: string) => {
    try {
      setIsAddButtonDisabled(true);

      // Make a DELETE request to your backend endpoint to delete the fear and its associated entries
      await fetch(`http://localhost:3000/dosAndDonts/fears/${fearId}`, {
        method: 'DELETE',
      });

      // Remove the closed fear from the state
      setFears((prevFears) => prevFears.filter((fear) => fear._id !== fearId));
      flash('Fear deleted successfully!');
    } catch (error) {
      console.error('Error closing fear:', error);
    } finally {
      setIsAddButtonDisabled(false);
    }
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode((prevMode) => !prevMode);
  };

  const handleDeleteButtonClick = (fearId: string) => {
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

  const handleNewFearModalClose = () => {
    setIsNewFearModalOpen(false);
    setNewFearTitle('');
  };

  const handleNewFearSave = async () => {
    try {
      if (!newFearTitle.trim()) {
        flash('Bitte geben Sie einen Titel ein.');
        return;
      }
      const response = await fetch(`http://localhost:3000/dosAndDonts/fears`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ name: newFearTitle }),
      });
      if (response.status === 409) {
        flash('Bitte geben Sie einen neuen Titel ein, diese Kategorie existiert bereits.')
      } else {
        const data = await response.json();
        const newFearId = data._id;
        // Redirect to the page for the newly added fear
        navigate(`/dosanddonts/t/${newFearId}`);
        // Close the new fear modal
        setIsNewFearModalOpen(false);
        // Reset the new fear title input
        setNewFearTitle('');
      }
    } catch (error) {
      console.error('Error saving fear:', error);
    }
  };

  return (
    <div className={styles.layout}>
      <h1 className={styles.h1}>Do's & Dont's</h1>
      <div className={styles.welcomeContainer}>
        <p className={styles.welcomeText}>
          Liebe TherapeutInnen!<br />
          Nutzen Sie die Kraft, das Leben junger Menschen durch Ihre Anleitung zu verändern. <br /> Ihre Dos and Don'ts-Listen sind der Kompass für Eltern, <br/> die den Weg zum emotionalen Wohlbefinden ihres Kindes einschlagen.
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
        {!isDeleteMode && (
            <button className={styles.button} onClick={handleAddNewFearClick} disabled={isAddButtonDisabled}><b>+</b></button>
        )}
        <br></br>
        {fears.length> 0 && (
            <button onClick={handleDeleteModeToggle} className="btn btn-danger">
              {isDeleteMode ? 'Abbrechen' : 'Angst löschen'}
            </button>
        )}
      </div>
      <NewFearModal
          isOpen={isNewFearModalOpen}
          onClose={handleNewFearModalClose}
          onSave={handleNewFearSave}
          fearTitle={newFearTitle}
          onTitleChange={setNewFearTitle}
      />
    </div>
  );
}

export default DosAndDontsPage;
