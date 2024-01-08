import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const deepDiveQuestions = [
    "What made you smile today?",
    "Can you think of a time today when you felt really calm?",
    "What is something new you tried today?",
    "Who did you enjoy talking to today?",
    "What was the best thing about your day?",
    "Can you describe a challenge you faced today?",
    "What is something you are looking forward to tomorrow?",
    "How did you help someone today?",
    "Was there a moment today when you felt proud of yourself?",
    "Did anything surprise you today?",
    "What was the funniest thing that happened today?",
    "Did you feel worried at any time today?",
    "What was your favorite part of the day?",
    "Were there any moments today when you felt really energetic?",
    "How did you make a friend feel happy today?",
    "What is something kind that you did today?",
    "Did you learn anything new and exciting today?",
    "What was the most peaceful moment of your day?",
    "Was there a time today when you felt really grateful?",
    "Can you think of a moment today that made you feel loved?"
  ];

  const ReflexionDeepDivePage: React.FC = () => {
    const { id } = useParams<Record<string, string | undefined>>();
    const navigate = useNavigate();
    const [mood, setMood] = useState<string>('');
    const [deepDiveQuestion, setDeepDiveQuestion] = useState<string>('');
    const [deepDiveAnswer, setDeepDiveAnswer] = useState<string>('');
    const [showDeepDive, setShowDeepDive] = useState<boolean>(false);
  
    useEffect(() => {
        const fetchReflexion = async () => {
          try {
            const response = await fetch(`http://localhost:3000/reflexion/reflexions/${id}`);
            const data = await response.json();
            setMood(data.mood);
          } catch (error) {
            console.error('Error fetching reflexion:', error);
          }
        };
        fetchReflexion();
      }, [id]);
  
    const getRandomQuestion = () => {
        return deepDiveQuestions[Math.floor(Math.random() * deepDiveQuestions.length)];
      };
    
    const handleContinueReflection = (continueReflection: boolean) => {
        if (continueReflection) {
            setDeepDiveQuestion(getRandomQuestion());
            setShowDeepDive(true);
        } else {
            navigate('/reflexion-final');
        }
    };

  const handleSaveDeepDive = async () => {
    try {
      await fetch(`http://localhost:3000/reflexion/reflexions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deepDiveQuestion, deepDiveAnswer })
      });
      navigate('/reflexion-final');
    } catch (error) {
      console.error('Error saving deep dive response:', error);
    }
  };  

  return (
    <div>
      <h2>Selected mood: {mood}</h2>
      {!showDeepDive && (
        <>
          <h3>Would you like to continue reflexion and deepen the understanding of your feelings?</h3>
          <button onClick={() => handleContinueReflection(true)}>Yes</button>
          <button onClick={() => handleContinueReflection(false)}>No</button>
        </>
      )}
      {showDeepDive && (
        <>
          <p>{deepDiveQuestion}</p>
          <button onClick={() => setDeepDiveQuestion(getRandomQuestion())} style={{ display: 'block', margin: '10px 0' }}>Change Question</button>
          <textarea value={deepDiveAnswer} onChange={(e) => setDeepDiveAnswer(e.target.value)} style={{ display: 'block', margin: '10px 0' }} />
          <div>
            <button onClick={handleSaveDeepDive}>Save</button>
            <button onClick={() => navigate('/reflexion-final')}>Cancel</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ReflexionDeepDivePage;
