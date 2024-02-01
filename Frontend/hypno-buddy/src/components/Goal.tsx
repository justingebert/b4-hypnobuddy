import React from 'react';
import style from '../styles/Roadmap/buttons.module.scss';
import styles from '../styles/Roadmap/Goal.module.scss';

function GoalItem({ goal, onEdit, onDelete, onCreateSubGoal }) {
    const getStatusClass = (status) => {
        switch (status) {
            case 'Geplant': return styles.borderSecondaryCustom;
            case 'Umsetzung': return styles.borderPrimaryCustom;
            case 'Erreicht': return styles.borderSuccessCustom;
            default: return styles.bgSecondaryCustom;
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
        <div className={`card  border-2 ${getStatusClass(goal.status)}  ${styles.cardCustom} mb-3`}>
            <div className={` card-body`}>
                <h5 className={`card-title ${styles.title}`}>{goal.title}</h5>
                <p className={`card-text small text-muted ${styles.date}`}>{getDueDate(goal.dueDate)}</p>
                <p className={`card-text ${styles.subtitle}`} dangerouslySetInnerHTML={{ __html: goal.description }} />
                <button className={`btn btn-secondary ${style.btnEditCustom} mr-2`} onClick={() => onEdit(goal)}>Bearbeiten</button>
                <button className={`btn btn-danger ${style.btnDeleteCustom} m-2`} onClick={() => onDelete(goal._id)}>Löschen</button>
                {!goal.isSubGoal && (
                    <button className={`btn btn-primary ${style.btnPrimaryCustom}`} onClick={() => onCreateSubGoal(goal._id)}>+
                        Zwischenziel</button>
                )}

            </div>
        </div>
    );
}

export default GoalItem;
