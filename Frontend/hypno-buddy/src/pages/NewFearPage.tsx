import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DosAndDontsView from "../views/DosAndDontsView.tsx";

function NewFearPage() {
    const [fearTitle, setFearTitle] = useState('');
    const navigate = useNavigate();

    const handleSaveFear = async () => {
        try {
            const response = await fetch(`http://localhost:3000/dosAndDonts/fears`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: fearTitle }),
            });

            const data = await response.json();
            const newFearId = data._id;

            // Redirect to the page for the newly added fear
            navigate(`/dosanddonts/t/${newFearId}`);
        } catch (error) {
            console.error('Error saving fear:', error);
        }
    };

    return (
        <div>
            <h2>Add New Fear</h2>
            <label>
                Fear Title:
                <input type="text" value={fearTitle} onChange={(e) => setFearTitle(e.target.value)} />
            </label>
            <button onClick={handleSaveFear}>Save</button>
        </div>
    );
}

export default NewFearPage;