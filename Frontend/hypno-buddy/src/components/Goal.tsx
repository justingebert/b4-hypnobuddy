import React from 'react';
import style from '../styles/Roadmap/buttons.module.scss';
import styles from '../styles/Roadmap/Goal.module.scss';
import deleteIcon from '../assets/delete.png';
import editIcon from '../assets/edit.png';
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
        <div className={`card  border-3 ${getStatusClass(goal.status)}  ${styles.cardCustom} mb-3`}>
            <div className={` card-body`}>
                <h5 className={`card-title ${styles.title}`}>{goal.title}</h5>
                <p className={`card-text small text-muted ${styles.date}`}>{getDueDate(goal.dueDate)}</p>
                <p className={`card-text ${styles.subtitle}`} dangerouslySetInnerHTML={{ __html: goal.description }} />
                <button className={`btn btn-secondary ${style.btnEditCustom} mr-2`} onClick={() => onEdit(goal)}>
                    <img src={editIcon} alt="Edit" style={{ filter: "invert(1)", fill:"white", width: "20px", height: "20px" }}/>
                </button>
                {!goal.isSubGoal && (
                    <button className={`btn btn-primary ${style.btnPrimaryCustom} m-2`} onClick={() => onCreateSubGoal(goal._id)}>+
                        Zwischenziel</button>
                )}
                <button className={`btn btn-danger ${style.btnDeleteCustom} mr-2`} onClick={() => onDelete(goal._id)}>
                    <img src={deleteIcon} alt="Delete" style={{ filter: "invert(.1)",  width: "20px", height: "20px" }}/>
                </button>
            </div>
        </div>
    );
}

export default GoalItem;
