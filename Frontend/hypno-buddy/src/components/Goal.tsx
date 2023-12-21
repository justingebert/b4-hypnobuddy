import React from 'react';

function GoalItem({ goal, onEdit, onDelete, onCreateSubGoal }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Geplant': return 'border border-secondary';
            case 'Umsetzung': return 'border border-primary';
            case 'Erreicht': return 'border border-success';
            default: return 'bg-secondary';
        }
    };

    return (
        <div className={`card border-2 ${getStatusClass(goal.status)} mb-3`}>
            <div className="card-body">
                <h5 className="card-title">{goal.title}</h5>
                <p className="card-text">{goal.description}</p>
                <button className="btn btn-primary mr-2" onClick={() => onEdit(goal)}>Bearbeiten</button>
                <button className="btn btn-danger m-2" onClick={() => onDelete(goal._id)}>Löschen</button>
                {/*
                    TODO: include again when subgoals are implemented
                    <button className="btn btn-secondary" onClick={() => onCreateSubGoal(goal._id)}>Create Subgoal</button>
                */}
            </div>
        </div>
    );
}

export default GoalItem;
