import React from 'react';
import styles from '../styles/Roadmap/Goal.module.scss';

function GoalItem({ goal, onEdit, onDelete, onCreateSubGoal }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Geplant': return 'border border-secondary';
            case 'Umsetzung': return 'border border-primary';
            case 'Erreicht': return 'border border-success';
            default: return 'bg-secondary';
        }
    };

    const getDueDate = (dueDate) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        if (dueDate instanceof Date) {
            return dueDate.toLocaleDateString('de-DE', options);
        }
        else if (typeof dueDate === 'string') {
            return new Date(dueDate).toLocaleDateString('de-DE', options);
        }
        return dueDate;
    }

    return (
        <div className={`card  ${styles.cardCustom} border-2 ${getStatusClass(goal.status)} mb-3`}>
            <div className={` card-body`}>
                <h5 className="card-title">{goal.title}</h5>
                <p className="card-text small text-muted">{getDueDate(goal.dueDate)}</p>
                <p className="card-text" dangerouslySetInnerHTML={{ __html: goal.description }} />
                <button className={`btn btn-secondary ${styles.btnPrimaryCustom} mr-2`} onClick={() => onEdit(goal)}>Bearbeiten</button>
                <button className="btn btn-danger m-2" onClick={() => onDelete(goal._id)}>Löschen</button>
                {!goal.isSubGoal && (
                    <button className="btn btn-primary" onClick={() => onCreateSubGoal(goal._id)}>+
                        Zwischenziel</button>
                )}

            </div>
        </div>
    );
}

export default GoalItem;
