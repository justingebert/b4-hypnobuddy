import { useState, useEffect } from 'react';

function GoalModal({ show, goalData, onSave, onClose }) {
    const [formData, setFormData] = useState(goalData || { title: '', description: '' });

    useEffect(() => {
        setFormData(goalData || { title: '', description: '' });
    }, [goalData]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave(formData);
        onClose(); // Close the modal after saving
    };

    if (!show) return null;

    return (
        <div className="modal">
            <form onSubmit={handleSubmit}>
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                />
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                />
                <button type="submit">Save Goal</button>
                <button onClick={onClose}>Close</button>
            </form>
        </div>
    );
}

export default GoalModal;
