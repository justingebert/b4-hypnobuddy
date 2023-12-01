import React from 'react';

function GoalItem({ goal }) {
    return (
        <div>
            <h3>{goal.title}</h3>
            <p>{goal.description}</p>
            {/* Edit button to open the edit modal */}
            <button>Edit</button>
            {/* Delete button to delete the goal */}
            <button>Delete</button>
            <br/>
            <br/>
        </div>
    );
}

export default GoalItem;
