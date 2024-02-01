import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Reflexion.scss";
import excellentImage from '../assets/Sehr Gut.png';
import goodImage from '../assets/Gut.png';
import normalImage from '../assets/Mittel.png';
import notSoGoodImage from '../assets/schlecht.png';
import badImage from '../assets/Sehr schlecht.png';
import CustomButton from "../components/CustomButton.tsx";
import bunny from "../assets/bunny.png";
import {url} from "../contexts/AuthContext.tsx";
const AddingReflexionPage: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const handleMoodClick = async (selectedMood: string) => {
    try {
      const response = await fetch(url + '/reflexion/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ mood: selectedMood })
      });
      const data = await response.json();
      navigate(`/reflexion-description/${data._id}`);
    } catch (error) {
      console.error('Error saving mood:', error);
    }
  };

  const getImageForMood = (mood: string)  => {
    switch (mood) {
      case 'Sehr gut':
        return excellentImage;
      case 'Gut':
        return goodImage;
      case 'Normal':
        return normalImage;
      case 'Nicht so gut':
        return notSoGoodImage;
      case 'Schlecht':
        return badImage;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="reflection">
        <div className="reflectionCard" >
          <h2 className="h2-refelxion">Wie fühlst du dich heute?</h2>
          <div className="moodDiv">
            {['Sehr gut', 'Gut', 'Normal', 'Nicht so gut', 'Schlecht'].map((mood) => (
                <button key={mood}
                        onClick={() => handleMoodClick(mood)}
                        onMouseEnter={() => setHoveredButton(mood)}
                        onMouseLeave={() => setHoveredButton(null)}
                        className={`moodButton ${hoveredButton === mood ? 'hovered' : ''}`}
                >
                  {hoveredButton === mood ? (
                      mood
                  ) : (
                      <img src={getImageForMood(mood) || ''} alt={mood} className="moodButtonImg" />
                  )}
                </button>
            ))}
          </div>
          <div className="previousButtonDiv">
            <CustomButton
                buttonText="Frühere Einträge anzeigen"
                backgroundColor="#3e368d"
                hoverColor="#ff6641"
                borderColor="#3e368d"
                borderHoverColor="#ff6641"
                handleClick={() => {navigate('/previous-reflexions')
                }}
            />
          </div>
          <div style={{display:'flex', justifyContent:'center', padding:'20px'}}>
            <img src={bunny} className="bunnyImage" alt="bunny"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddingReflexionPage;
