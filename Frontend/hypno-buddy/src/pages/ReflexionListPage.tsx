import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from "../components/CustomButton.tsx";

interface Reflexion {
  _id: string;
  mood: string;
  description?: string;
  deepDiveQuestion?: string;
  deepDiveAnswer?: string;
  date: Date;
}

const ReflexionList: React.FC = () => {
  const [reflexions, setReflexions] = useState<Reflexion[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedReflexionId, setSelectedReflexionId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReflexions();
  }, []);

  const fetchReflexions = async () => {
    try {
      const response = await fetch('http://localhost:3000/reflexion/reflexions');
      const data = await response.json();
      setReflexions(data);
    } catch (error) {
      console.error('Error fetching reflexions:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/reflexion/reflexions/${id}`, { method: 'DELETE' });
      setReflexions(reflexions.filter(reflexion => reflexion._id !== id));
      setShowDeleteModal(false);
      setSelectedReflexionId(null);
    } catch (error) {
      console.error('Error deleting reflexion:', error);
    }
  };

const promptDelete = (id: string) => {
    setSelectedReflexionId(id);
    setShowDeleteModal(true);
  };


  const confirmDelete = async () => {
    if (selectedReflexionId) {
      await handleDelete(selectedReflexionId);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedReflexionId(null);
  };

  return (
    <div className="reflectionDiv">
      <div className="reflectionCard">
        <h2 className="h2-refelxion">Deine Einträge</h2>
        <div className="yesNoDiv">
          <CustomButton
              buttonText="Neuer Eintrag"
              backgroundColor="#4F45DA"
              hoverColor="#56c8c9"
              borderColor="#4F45DA"
              borderHoverColor="#56c8c9"
              handleClick={() => {navigate('/reflexion-add')
              }}
          />
          <CustomButton
              buttonText= {isDeleteMode ? 'Zurück' : 'Löschen'}
              backgroundColor="#958ae8"
              hoverColor="#56c8c9"
              borderColor="#958ae8"
              borderHoverColor="#56c8c9"
              handleClick = {() => setIsDeleteMode(!isDeleteMode)}
          ></CustomButton>
        </div>
      </div>

      <div className="reflextionEntry">
        <div style={{marginInline:'20%'}}>
          {reflexions.map((reflexion) => (
              <ul key={reflexion._id}
                className="singleEntry">
                <p>{new Date(reflexion.date).toLocaleString()}: {reflexion.mood}</p>
                {reflexion.description && <p>Description: {reflexion.description}</p>}
                {reflexion.deepDiveQuestion && <p>Deep Dive Question: {reflexion.deepDiveQuestion}</p>}
                {reflexion.deepDiveAnswer && <p>Deep Dive Answer: {reflexion.deepDiveAnswer}</p>}
                {isDeleteMode && <button onClick={() => promptDelete(reflexion._id)}>Delete</button>}
                {showDeleteModal && selectedReflexionId === reflexion._id && (
                    <div>
                      <p>Bist du dir sicher, den Beitrag zu löschen?</p>
                      <CustomButton
                          buttonText= "Ja"
                          backgroundColor="#958ae8"
                          hoverColor="#56c8c9"
                          borderColor="#958ae8"
                          borderHoverColor="#56c8c9"
                          handleClick = {confirmDelete}
                      />
                      <CustomButton
                          buttonText= "Nein"
                          backgroundColor="#958ae8"
                          hoverColor="#56c8c9"
                          borderColor="#958ae8"
                          borderHoverColor="#56c8c9"
                          handleClick = {cancelDelete}
                      />
                    </div>
                )}
              </ul>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReflexionList;
