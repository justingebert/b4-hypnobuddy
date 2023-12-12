import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DoAndDont } from '../../../../Backend/data/model/dosAndDontsModel.ts';
import TherapistCard from '../components/TherapistCard.tsx';

function FearPage() {
  const { fearId } = useParams();
  const [fearData, setFearData] = useState({});
  const [dosAndDonts, setDosAndDonts] = useState<DoAndDont[]>([]);
  const [fearTitle, setFearTitle] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isLeftField, setIsLeftField] = useState(true);
  const [leftTextField, setLeftTextField] = useState('');
  const [rightTextField, setRightTextField] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/dosAndDonts/fears/${fearId}`);
        const data = await response.json();
        if (data) {
          setFearData(data);
          setDosAndDonts(data.dosAndDonts || []);
          setFearTitle(data.name);
          setLeftTextField((data.dosAndDonts?.find((item: DoAndDont) => item.type === "Don't")?.text) || '');
          setRightTextField((data.dosAndDonts?.find((item: DoAndDont) => item.type === 'Do')?.text) || '');
        } else {
          console.error(`Fear with ID ${fearId} not found.`);
        }
      } catch (error) {
        console.error('Error fetching data;', error);
      }
    };
    fetchData();
  }, [fearId]);

  const handleEditToggle = () => {
    setEditMode(true);
    setIsLeftField(true);
  };

  const handleSave = async () => {
    try {
      // Update fear title
      await fetch(`http://localhost:3000/dosAndDonts/fears/${fearId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: fearTitle }),
      });
  
     // Update the "Do" entry
    const doEntry = dosAndDonts.find(entry => entry.type === 'Do');
    if (doEntry) {
      await fetch(`http://localhost:3000/dosAndDonts/dosAndDonts/${doEntry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: rightTextField }),
      });
    } else {
      // Create a new "Do" entry for the fear
      await fetch('http://localhost:3000/dosAndDonts/fears/addDoAndDont', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fearId, type: 'Do', text: rightTextField }),
      });
    }

    // Update the "Don't" entry
    const dontEntry = dosAndDonts.find(entry => entry.type === "Don't");
    if (dontEntry) {
      await fetch(`http://localhost:3000/dosAndDonts/dosAndDonts/${dontEntry._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: leftTextField }),
      });
    } else {
      // Create a new "Don't" entry for the fear
      await fetch('http://localhost:3000/dosAndDonts/fears/addDoAndDont', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fearId, type: "Don't", text: leftTextField }),
      });
    }

      // Fetch updated data after save
      const response = await fetch(`http://localhost:3000/dosAndDonts/fears/${fearId}`);
      const data = await response.json();
      if (data) {
        setFearData(data);
        setDosAndDonts(data.dosAndDonts || []);
        setFearTitle(data.name);
        setEditMode(false);
      } else {
        console.error(`Fear with ID ${fearId} not found.`);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };
  

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const maxLines = 5;
    const minRows = 3;
    const currentRows = Math.min(
      maxLines,
      Math.max(minRows, (e.target.value.match(/\n/g) || []).length + 1)
    );

    e.target.rows = currentRows;

    const className = e.target.className;
    const value = e.target.value;

    if (className.includes('left')) {
      setLeftTextField(value);
      setIsLeftField(true);
    } else if (className.includes('right')) {
      setRightTextField(value);
      setIsLeftField(false);
    }
    };

  const handleTitleChange = (newTitle: string) => {
    setFearTitle(newTitle);
  };

  const handleClose = () => {
    setEditMode(false);
    navigate('/dosanddonts/t');
  };

  return (
    <TherapistCard
      initialTitle={fearTitle}
      leftTextField={leftTextField}
      rightTextField={rightTextField}
      isEditMode={editMode}
      isLeftField={isLeftField}
      onEditToggle={handleEditToggle}
      onSave={handleSave}
      onTitleChange={handleTitleChange}
      onTextAreaChange={handleTextAreaChange}
      onClose={handleClose}
    />
  );
}

export default FearPage;
