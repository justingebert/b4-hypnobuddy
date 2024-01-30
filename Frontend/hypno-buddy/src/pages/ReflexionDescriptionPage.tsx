import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomButton from "../components/CustomButton.tsx";
import bunny from "../assets/bunny.png";

const ReflexionDescriptionPage: React.FC = () => {
  const { id } = useParams<Record<string, string | undefined>>();
  const navigate = useNavigate();
  const [mood, setMood] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [showDescriptionField, setShowDescriptionField] = useState<boolean>(false);

  useEffect(() => {
    const fetchMood = async () => {
      try {
        const response = await fetch(`http://localhost:3000/reflexion/getById/${id}`, {
          credentials: 'include'
        });
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
      await fetch(`http://localhost:3000/reflexion/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ description })
      });
      navigate(`/reflexion-deep-dive/${id}`);
    } catch (error) {
      console.error('Error saving description:', error);
    }
  };

  return (
    <div className="reflection">
      <div className="reflectionCard">
        <h2 className="h2-refelxion">Wie du dich fühlst: {mood}</h2>
      {!showDescriptionField && (
        <>
          <div className="yesNoDiv">
          <h3>Willst du deine Gefühle beschreiben?</h3>
            <div className="yesNoButton">
              <CustomButton
                  buttonText="Ja"
                  backgroundColor="#3e368d"
                  hoverColor="#ff6641"
                  borderColor="#3e368d"
                  borderHoverColor="#ff6641"
                  handleClick= {() => setShowDescriptionField(true)}
              />
              <CustomButton
                  buttonText="Nein"
                  backgroundColor="#3e368d"
                  hoverColor="#ff6641"
                  borderColor="#3e368d"
                  borderHoverColor="#ff6641"
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
                  backgroundColor="#3e368d"
                  hoverColor="#ff6641"
                  borderColor="#3e368d"
                  borderHoverColor="#ff6641"
                  handleClick={saveDescription}
              />
              <CustomButton
                  buttonText="Abbruch"
                  backgroundColor="#9999ff"
                  hoverColor="#ff6641"
                  borderColor="#9999ff"
                  borderHoverColor="#ff6641"
                  handleClick={() => navigate('/reflexion-final')}
              />
            </div>
          </div>
        </>
      )}
        <img src={bunny} className="bunnyImage" alt="bunny"/>
      </div>
    </div>
  );
};

export default ReflexionDescriptionPage;
