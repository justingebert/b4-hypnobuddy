import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Reflexion.css";
import excellentImage from '../assets/Sehr Gut.png';
import goodImage from '../assets/Gut.png';
import normalImage from '../assets/Mittel.png';
import notSoGoodImage from '../assets/schlecht.png';
import badImage from '../assets/Sehr schlecht.png';
import CustomButton from "../components/CustomButton.tsx";
import bunny from "../assets/bunny.png";
const AddingReflexionPage: React.FC = () => {
  const navigate = useNavigate();
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

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
      <div className="reflectionDiv">
        <div className="reflectionCard">
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
                backgroundColor="#4F45DA"
                hoverColor="#56c8c9"
                borderColor="#4F45DA"
                borderHoverColor="#56c8c9"
                handleClick={() => {navigate('/previous-reflexions')
                }}
            />
          </div>
        </div>
        <div className="bunnyImageDiv">
          <img src={bunny} className="bunnyImage" alt="bunny"/>
        </div>
        <div className="textInspoDiv">
          <svg height="150" width="800">
            <text className="textInspo" fill="#D3FFB4">
              <textPath href="#textPath">
                 Gefühle sind Wichtig und Richtig.
              </textPath>
            </text>
            <defs>
             <path id="textPath" d="M70 40 Q 280 140, 400 70 T 800 80"/>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AddingReflexionPage;