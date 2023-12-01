import React, { useState, useEffect } from 'react';

interface GoalCreateFormProps {
    goalData: any; // Replace 'any' with a specific type if available
    onSave: (goalData: any) => void;
    onClose: () => void;
}

const GoalCreateForm: React.FC<GoalCreateFormProps> = ({ goalData, onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Not Started');
    // const [priority, setPriority] = useState('Low');
    // const [category, setCategory] = useState('General');
    // const [dueDate, setDueDate] = useState('');

    // Reset form when goalData is null (creating a new goal)
    useEffect(() => {
        if (goalData === null) {
            setTitle('');
            setDescription('');
            setStatus('Not Started');
            // setPriority('Low');
            // setCategory('General');
            // setDueDate('');
        } else {
            // If editing an existing goal, populate form with goalData
            // setTitle(goalData.title), etc.
        }
    }, [goalData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, description, status});
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
                <label>
                    Title:
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
                </label>
                <br/>
                <label>
                    Description:
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                </label>
                <br/>
                <label>
                    Status:
                    <select value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </label>
                <br/>
                {/*maybe for later*/}
                {/*<label>*/}
                {/*    Priority:*/}
                {/*    <select value={priority} onChange={e => setPriority(e.target.value)}>*/}
                {/*        <option value="Low">Low</option>*/}
                {/*        <option value="Medium">Medium</option>*/}
                {/*        <option value="High">High</option>*/}
                {/*    </select>*/}
                {/*</label>*/}
                {/*<label>*/}
                {/*    Category:*/}
                {/*    <input type="text" value={category} onChange={e => setCategory(e.target.value)} />*/}
                {/*</label>*/}
                {/*<label>*/}
                {/*    Due Date:*/}
                {/*    <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />*/}
                {/*</label>*/}
                <button type="submit">Save Goal</button>
                <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
};

export default GoalCreateForm;