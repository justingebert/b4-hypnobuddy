import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ReflexionDescriptionPage: React.FC = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate();
  const [mood, setMood] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [showDescriptionField, setShowDescriptionField] = useState<boolean>(false);

  useEffect(() => {
    const fetchMood = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reflexion/reflexions/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch reflexion');
        }
        const data = await response.json();
        setMood(data.mood);
      } catch (error) {
        console.error('Error fetching mood:', error);
      }
    };
    fetchMood();
  }, [id]);

  const saveDescription = async () => {
    try {
      await fetch(`http://localhost:3000/reflexion/reflexions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      navigate(`/reflexion-deep-dive/${id}`);
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };

  return (
    <div>
      <h2>Selected mood: {mood}</h2>
      {!showDescriptionField && (
        <>
          <h3>Would you like to describe how you feel?</h3>
          <button onClick={() => setShowDescriptionField(true)}>Yes</button>
          <button onClick={() => navigate('/reflexion-final')}>No</button>
        </>
      )}
      {showDescriptionField && (
        <>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <button onClick={saveDescription}>Save</button>
          <button onClick={() => navigate('/reflexion-final')}>Cancel</button>
        </>
      )}
    </div>
  );
};

export default ReflexionDescriptionPage;
