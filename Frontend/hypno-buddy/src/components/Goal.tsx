import React from 'react';

function GoalItem({ goal, onEdit, onDelete, onCreateSubGoal }) {
    return (
        <div className="card mb-3">
            <div className="card-body">
                <h5 className="card-title">{goal.title}</h5>
                <p className="card-text">{goal.description}</p>
                <button className="btn btn-primary mr-2" onClick={() => onEdit(goal)}>Edit</button>
                <button className="btn btn-danger" onClick={() => onDelete(goal._id)}>Delete</button>
                <button className="btn btn-secondary" onClick={() => onCreateSubGoal(goal._id)}>Create Subgoal</button>
            </div>
        </div>
    );
}

export default GoalItem;
