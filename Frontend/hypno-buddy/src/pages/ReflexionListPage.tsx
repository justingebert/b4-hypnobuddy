import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from "../components/CustomButton.tsx";
import { BsArrowUpCircleFill } from "react-icons/bs";

interface Reflexion {
  _id: string;
  mood: string;
  description?: string;
  deepDiveQuestion?: string;
  deepDiveAnswer?: string;
  date: Date;
}

const ReflexionList: React.FC = () => {
  const [reflexions, setReflexions] = useState<Reflexion[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedReflexionId, setSelectedReflexionId] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReflexions();
  }, []);

  const fetchReflexions = async () => {
    try {
      const response = await fetch('http://localhost:3000/reflexion/reflexions');
      const data = await response.json();
      setReflexions(data);
    } catch (error) {
      console.error('Error fetching reflexions:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:3000/reflexion/reflexions/${id}`, { method: 'DELETE' });
      setReflexions(reflexions.filter(reflexion => reflexion._id !== id));
      setShowDeleteModal(false);
      setSelectedReflexionId(null);
    } catch (error) {
      console.error('Error deleting reflexion:', error);
    }
  };

const promptDelete = (id: string) => {
    setSelectedReflexionId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedReflexionId) {
      await handleDelete(selectedReflexionId);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedReflexionId(null);
  };

  const cancelButton = () => {
    setIsDeleteMode(!isDeleteMode); 
    setShowDeleteModal(false);
  };
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollThreshold = 200;

    if (scrollY > scrollThreshold) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="reflectionDiv">
      <div className="reflextionEntry">
        <h2 className="h2-refelxion"><b>Deine Einträge</b></h2>
        <div className="yesNoDiv">
          <CustomButton
              buttonText="Neuer Eintrag"
              backgroundColor="#3e368d"
              hoverColor="#ff6641"
              borderColor="#3e368d"
              borderHoverColor="#ff6641"
              handleClick={() => {navigate('/reflexion-add')
              }}
          />
          <CustomButton
              buttonText= {isDeleteMode ? 'Zurück' : 'Löschen'}
              backgroundColor="#9999ff"
              hoverColor="#ff6641"
              borderColor="#9999ff"
              borderHoverColor="#ff6641"
              handleClick = {cancelButton}
          ></CustomButton>
        </div>
        <div style={{marginInline:'20%'}}>
          {reflexions.map((reflexion, index, array) => {
            const currentDate = new Date(reflexion.date).toLocaleDateString();
            const prevDate = index > 0 ? new Date(array[index - 1].date).toLocaleDateString() : null;

            if (prevDate !== currentDate) {
              return (
                  <div key={currentDate} className="dateEntry">
                    <h3 className="datum">{currentDate}</h3>
                    <ul className="singleEntry">
                      <h3 className="moodText">{reflexion.mood}</h3>
                      {reflexion.description && <p className="eintrag">Dein Eintrag:<br />{reflexion.description}</p>}
                      {reflexion.deepDiveQuestion && <p style={{textAlign:"center"}}>{reflexion.deepDiveQuestion}</p>}
                      {reflexion.deepDiveAnswer && <p className="eintrag">Deine Antwort: <br />{reflexion.deepDiveAnswer}</p>}
                      <p className="datumTime">
                        {new Date(reflexion.date).toLocaleTimeString('de-DE', { timeStyle: 'short' })} Uhr
                      </p>
                      {isDeleteMode &&   <CustomButton
                          buttonText= "Löschen"
                          backgroundColor="#ff6641"
                          hoverColor="#9999ff"
                          borderColor="#ff6641"
                          borderHoverColor="#9999ff"
                          handleClick = {() => promptDelete(reflexion._id)}/>}
                      {showDeleteModal && selectedReflexionId === reflexion._id && (
                      <div>
                        <p>Bist du dir sicher, den Beitrag zu löschen?</p>
                          <CustomButton
                              buttonText= "Ja"
                              backgroundColor="#ff6641"
                              hoverColor="#9999ff"
                              borderColor="#ff6641"
                              borderHoverColor="#9999ff"
                              handleClick = {confirmDelete}
                          />
                          <CustomButton
                              buttonText= "Nein"
                              backgroundColor="#9999ff"
                              hoverColor="#8140a7"
                              borderColor="#9999ff"
                              borderHoverColor="#8140a7"
                              handleClick = {cancelDelete}/>
                        </div>
                      )}
                </ul>
            </div>
              );
            } else {
              return (
                  <ul key={reflexion._id} className="singleEntry">
                    <h3 className="moodText">{reflexion.mood}</h3>
                    {reflexion.description && <p className="eintrag">Dein Eintrag: <br />{reflexion.description}</p>}
                    {reflexion.deepDiveQuestion && <p style={{textAlign:"center", paddingTop:"15px"}}>{reflexion.deepDiveQuestion}</p>}
                    {reflexion.deepDiveAnswer && <p className="eintrag">Deine Antwort: <br />{reflexion.deepDiveAnswer}</p>}
                    <p className="datumTime">
                      {new Date(reflexion.date).toLocaleTimeString('de-DE', { timeStyle: 'short' })} Uhr
                    </p>
                    {isDeleteMode &&   <CustomButton
                        buttonText= "Löschen"
                        backgroundColor="#ff6641"
                        hoverColor="#9999ff"
                        borderColor="#ff6641"
                        borderHoverColor="#9999ff"
                        handleClick = {() => promptDelete(reflexion._id)}/>}
                    {showDeleteModal && selectedReflexionId === reflexion._id && (
                        <div>
                          <p>Bist du dir sicher, den Beitrag zu löschen?</p>
                          <CustomButton
                              buttonText= "Ja"
                              backgroundColor="#ff6641"
                              hoverColor="#9999ff"
                              borderColor="#ff6641"
                              borderHoverColor="#9999ff"
                              handleClick = {confirmDelete}
                          />
                          <CustomButton
                              buttonText= "Nein"
                              backgroundColor="#9999ff"
                              hoverColor="#8140a7"
                              borderColor="#9999ff"
                              borderHoverColor="#8140a7"
                              handleClick = {cancelDelete}/>
                        </div>
                    )}
                  </ul>
              );
            }
          })}
        </div>
      </div>

      {isVisible && (
      <button className="buttonScrollToTop" onClick={handleClick}>
        <BsArrowUpCircleFill />
      </button>
      )}
    </div>
  );}
export default ReflexionList;
