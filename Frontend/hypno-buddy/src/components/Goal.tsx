import React from 'react';

function GoalItem({ goal, onEdit, onDelete }) {
    return (
        <div>
            <h3>{goal.title}</h3>
            <p>{goal.description}</p>
            {/* Edit button to open the edit modal */}
            <button onClick={() => onEdit(goal)}>Edit</button>
            {/* Delete button to delete the goal */}
            <button onClick={() => onDelete(goal.id)}>Delete</button>
            <br/>
            <br/>
        </div>
    );
}

export default GoalItem;
