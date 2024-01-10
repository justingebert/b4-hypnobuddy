import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomButton from "../components/CustomButton.tsx";

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
    <div className="reflectionDiv">
      <div className="reflectionCard">
        <h2 className="h2-refelxion">Wie du dich fühlst: {mood}</h2>
      {!showDescriptionField && (
        <>
          <div className="yesNoDiv">
          <h3>Willst du deine Gefühle beschreiben?</h3>
            <div className="yesNoButton">
              <CustomButton
                  buttonText="Ja"
                  backgroundColor="#4F45DA"
                  hoverColor="#56c8c9"
                  borderColor="#4F45DA"
                  borderHoverColor="#56c8c9"
                  handleClick= {() => setShowDescriptionField(true)}
              />
              <CustomButton
                  buttonText="Nein"
                  backgroundColor="#4F45DA"
                  hoverColor="#56c8c9"
                  borderColor="#4F45DA"
                  borderHoverColor="#56c8c9"
                  handleClick= {() => navigate('/reflexion-final')}
              />
            </div>
        </div>
        </>
      )}
      {showDescriptionField && (
        <>
          <div className="yesNoDiv">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            className="inputText"/>
            <div>
              <CustomButton
                  buttonText="Speichern"
                  backgroundColor="#4F45DA"
                  hoverColor="#56c8c9"
                  borderColor="#4F45DA"
                  borderHoverColor="#56c8c9"
                  handleClick={saveDescription}
              />
              <CustomButton
                  buttonText="Abbruch"
                  backgroundColor="#958ae8"
                  hoverColor="#56c8c9"
                  borderColor="#958ae8"
                  borderHoverColor="#56c8c9"
                  handleClick={() => navigate('/reflexion-final')}
              />
            </div>
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default ReflexionDescriptionPage;
