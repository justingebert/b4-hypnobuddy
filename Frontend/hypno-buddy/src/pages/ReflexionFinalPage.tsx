import React from 'react';
import { useNavigate } from 'react-router-dom';

const ReflexionFinalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Thank you for adding your mood!</h2>
      <button onClick={() => navigate('/reflexion-add')}>Add New Reflexion</button>
      <button onClick={() => navigate('/previous-reflexions')}>View Previous Reflexions</button>
    </div>
  );
};

export default ReflexionFinalPage;
