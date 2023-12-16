import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Fear } from '../../../../Backend/data/model/fearModel.ts';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

function DosAndDontsPage() {
  const [fears, setFears] = useState<Fear[]>([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedFearId, setSelectedFearId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fearResponse = await fetch(`http://localhost:3000/dosAndDonts/fears`);
        const fearData = await fearResponse.json();
        console.log('Fears data:', fearData);

        setFears(fearData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleFearDelete = async (fearId: string) => {
    try {
      // Make a DELETE request to your backend endpoint to delete the fear and its associated entries
      await fetch(`http://localhost:3000/dosAndDonts/fears/${fearId}`, {
        method: 'DELETE',
      });

      // Remove the closed fear from the state
      setFears((prevFears) => prevFears.filter((fear) => fear._id !== fearId));
    } catch (error) {
      console.error('Error closing fear:', error);
    }
  };

  const handleDeleteModeToggle = () => {
    setIsDeleteMode((prevMode) => !prevMode);
  };

  const handleDeleteButtonClick = (fearId: string) => {
    console.log('Delete button clicked for fear ID:', fearId);
    setSelectedFearId(fearId);
  };

  const handleDeleteConfirm = async () => {
    if (selectedFearId) {
      await handleFearDelete(selectedFearId);
    }
    setIsDeleteMode(false);
    setSelectedFearId(null);
  };

  const handleDeleteCancel = () => {
    setSelectedFearId(null);
  };

  return (
    <>
      <div className="">
        <div>
          <h2>Fears</h2>
          {fears.map((fear) => (
            <div className="card" key={fear._id}>
              <Link className="card-content" to={`/dosanddonts/t/${fear._id}`}>
                {fear.name}
              </Link>
              {isDeleteMode && (
                <button
                  onClick={() => handleDeleteButtonClick(fear._id)}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          <Link to="/dosanddonts/t/newFear">Add New Fear</Link>
          <br></br>
          <button onClick={handleDeleteModeToggle} className="btn btn-danger">
            {isDeleteMode ? 'Exit Delete Mode' : 'Delete Fears'}
          </button>
        </div>
      </div>
      {isDeleteMode && selectedFearId && (
        <DeleteConfirmationModal
          isOpen={isDeleteMode}
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </>
  );
}

export default DosAndDontsPage;
