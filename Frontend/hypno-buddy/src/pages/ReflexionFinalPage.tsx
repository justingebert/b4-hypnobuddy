import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from "../components/CustomButton.tsx";
import topBunnyImage from "../assets/topBunny.png";

const ReflexionFinalPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="reflectionDiv">
        <div className="reflectionCard">
            <h2 className="h2-refelxion">Das hast du super gemacht!</h2>
            <div className="yesNoDiv">
                <div className="circleDiv">
                    <div className="circle">
                        <img src={topBunnyImage} alt="Bild im Kreis"/>
                    </div>
                </div>
                <CustomButton
                    buttonText="Neuer Eintrag"
                    backgroundColor="#4F45DA"
                    hoverColor="#56c8c9"
                    borderColor="#4F45DA"
                    borderHoverColor="#56c8c9"
                    handleClick= {() => navigate('/reflexion-add')}
                />
                <CustomButton
                    buttonText="Frühere Einträge"
                    backgroundColor="#4F45DA"
                    hoverColor="#56c8c9"
                    borderColor="#4F45DA"
                    borderHoverColor="#56c8c9"
                    handleClick= {() => navigate('/previous-reflexions')}
                />
            </div>
        </div>
    </div>
  );
};

export default ReflexionFinalPage;
