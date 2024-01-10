import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomButton from "../components/CustomButton.tsx";

/*interface Params {
  id: string;
}
*/
const deepDiveQuestions = [
    "Was hat dich heute zum Lächeln gebracht?",
    "Kannst du dich an eine Zeit erinnern, in der du dich wirklich ruhig gefühlt hast?",
    "Was ist etwas Neues, das du heute ausprobiert hast?",
    "Mit wem hast du dich heute gerne unterhalten?",
    "Was war das Beste an deinem Tag?",
    "Kannst du eine Herausforderung beschreiben, die du heute bewältigt hast?",
    "Was ist etwas, auf das du dich morgen freust?",
    "Wie hast du heute jemandem geholfen?",
    "Gab es heute einen Moment, in dem du stolz auf dich warst?",
    "Hat dich heute etwas überrascht?",
    "Was war das Lustigste, das heute passiert ist?",
    "Hast du dich heute irgendwann besorgt gefühlt?",
    "Was hat dir heute am besten gefallen?",
    "Gab es heute Momente, in denen du dich besonders energiegeladen gefühlt hast?",
    "Wie hast du heute einen Freund glücklich gemacht?",
    "Was hast du heute Gutes getan?",
    "Hast du heute etwas Neues und Spannendes gelernt?",
    "Was war der friedlichste Moment deines Tages?",
    "Gab es heute einen Moment, in dem du dich wirklich dankbar gefühlt hast?",
    "Fällt dir heute ein Moment ein, in dem du dich geliebt gefühlt hast?"
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
    <div className="reflectionDiv">
        <div className="reflectionCard">
      <h2 className="h2-refelxion">Wie du dich fühlst: {mood}</h2>
      {!showDeepDive && (
        <>
            <div className="yesNoDiv">
                <h3>Magst du deine Gefühle mehr vertiefen und verstehen?</h3>
                <div>
                    <CustomButton
                        buttonText="Ja"
                        backgroundColor="#4F45DA"
                        hoverColor="#56c8c9"
                        borderColor="#4F45DA"
                        borderHoverColor="#56c8c9"
                        handleClick= {() => handleContinueReflection(true)}

                    />
                    <CustomButton
                        buttonText="Nein"
                        backgroundColor="#4F45DA"
                        hoverColor="#56c8c9"
                        borderColor="#4F45DA"
                        borderHoverColor="#56c8c9"
                        handleClick= {() => handleContinueReflection(false)}

                    />
                </div>
            </div>
        </>
      )}
      {showDeepDive && (
        <>
            <div className="yesNoDiv">
                <p>{deepDiveQuestion}</p>
                <CustomButton
                    buttonText="Andere Frage"
                    backgroundColor="#4F45DA"
                    hoverColor="#56c8c9"
                    borderColor="#4F45DA"
                    borderHoverColor="#56c8c9"
                    handleClick= {() => setDeepDiveQuestion(getRandomQuestion())}
                />
                <textarea value={deepDiveAnswer} onChange={(e) => setDeepDiveAnswer(e.target.value)}
                          className="inputText"/>
                <div>
                    <CustomButton
                        buttonText="Speichern"
                        backgroundColor="#4F45DA"
                        hoverColor="#56c8c9"
                        borderColor="#4F45DA"
                        borderHoverColor="#56c8c9"
                        handleClick= {handleSaveDeepDive}
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

export default ReflexionDeepDivePage;
