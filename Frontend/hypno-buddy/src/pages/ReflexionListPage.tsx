import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div>
      <h2>Previous Reflexions</h2>
      <button onClick={() => navigate('/reflexion-add')}>Add New Reflexion</button>
      <button onClick={() => setIsDeleteMode(!isDeleteMode)}>
        {isDeleteMode ? 'Exit Delete Mode' : 'Delete Mode'}
      </button>
      <ul>
        {reflexions.map((reflexion) => (
          <li key={reflexion._id}>
            <p>{new Date(reflexion.date).toLocaleString()}: {reflexion.mood}</p>
            {reflexion.description && <p>Description: {reflexion.description}</p>}
            {reflexion.deepDiveQuestion && <p>Deep Dive Question: {reflexion.deepDiveQuestion}</p>}
            {reflexion.deepDiveAnswer && <p>Deep Dive Answer: {reflexion.deepDiveAnswer}</p>}
            {isDeleteMode && <button onClick={() => promptDelete(reflexion._id)}>Delete</button>}
            {showDeleteModal && selectedReflexionId === reflexion._id && (
            <div>
                <p>Are you sure you want to delete this entry?</p>
                <button onClick={confirmDelete}>Yes</button>
                <button onClick={cancelDelete}>No</button>
            </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReflexionList;
