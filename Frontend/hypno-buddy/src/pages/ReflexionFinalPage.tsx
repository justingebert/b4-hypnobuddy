import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from "../components/CustomButton.tsx";
import topBunnyImage from "../assets/topBunny.png";
import bunny from "../assets/bunny.png";

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
                    backgroundColor="#3e368d"
                    hoverColor="#9999ff"
                    borderColor="#3e368d"
                    borderHoverColor="#9999ff"
                    handleClick= {() => navigate('/reflexion-add')}
                />
                <CustomButton
                    buttonText="Frühere Einträge"
                    backgroundColor="#3e368d"
                    hoverColor="#9999ff"
                    borderColor="#3e368d"
                    borderHoverColor="#9999ff"
                    handleClick= {() => navigate('/previous-reflexions')}
                />
            </div>
            <img src={bunny} className="bunnyImage" alt="bunny"/>

        </div>
    </div>
  );
};

export default ReflexionFinalPage;
