import React from 'react';
import { useNavigate } from 'react-router-dom';

const AddingReflexionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleMoodClick = async (selectedMood: string) => {
    try {
      const response = await fetch('http://localhost:3000/reflexion/reflexions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood })
      });
      const data = await response.json();
      navigate(`/reflexion-description/${data._id}`);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  return (
    <div>
      <h2>How are you feeling today?</h2>
      {['Excellent', 'Good', 'Normal', 'Not so good', 'Bad'].map((mood) => (
        <button key={mood} onClick={() => handleMoodClick(mood)}>{mood}</button>
      ))}
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => navigate('/previous-reflexions')}>View previous reflexions</button>
      </div>
    </div>
  );
};

export default AddingReflexionPage;
