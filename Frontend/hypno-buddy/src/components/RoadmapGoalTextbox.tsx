import React, { useContext, useState } from 'react';
import styles from "../styles/RoadmapPage.module.scss";
import GoalCommentForm from "./GoalCommentForm.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import { useGoals } from "../contexts/GoalContext.tsx";
import { FlashContext } from "../contexts/FlashContext.tsx";

function RoadmapGoalTextbox({ goal, handleComment }) {
    const { user, selectedPatient } = useAuth();
    const { updateGoal, deleteComment } = useGoals();
    const [showDetails, setShowDetails] = useState(false);

    const getDate = (dueDate) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        if (dueDate instanceof Date) {
            return dueDate.toLocaleDateString('de-DE', options);
        }
        else if (typeof dueDate === 'string') {
            return new Date(dueDate).toLocaleDateString('de-DE', options);
        }
        return dueDate;
    }

    type GoalStatus = 'Geplant' | 'Umsetzung' | 'Erreicht';
    const isActiveStatus = (btnStatus: GoalStatus) => {
        if (btnStatus === 'Geplant') return btnStatus === goal.status ? 'border border-secondary' : ''
        else if (btnStatus === 'Umsetzung') return btnStatus === goal.status ? 'border border-primary' : ''
        else if (btnStatus === 'Erreicht') return btnStatus === goal.status ? 'border border-success' : ''
        else return btnStatus === goal.status ? 'border border-secondary' : '';
    };

    const updateGoalStatus = async (status: GoalStatus) => {
        try {
            if (user.role === 'therapist') {
                return; //therapist aren't allowed to change status
            }
            const updatedGoal = { ...goal, status: status };
            await updateGoal(goal._id, updatedGoal);
        } catch (error) {
            console.error('Error updating goal status:', error);
        }
    }

    const allowEdit = () => {
        return user.role === 'patient' ? 'btn-light' : '';
    }

    return (
        <div className={goal.isSubGoal ? `${styles.subgoalBox}` : `${styles.textbox}`}>
            <div className={`header d-flex flex-row justify-content-between`}>
                <h5 className={`${styles.title}`}>{goal.title}</h5>
                <div className={`statusIcons d-flex flex-row`}>
                    <button className={`btn ${allowEdit()} ${styles.statusBtn} ${isActiveStatus("Geplant")}`}
                        onClick={() => updateGoalStatus("Geplant")}
                        title="Geplant"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-three-dots text-secondary`} viewBox="0 0 16 16">
                            <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3" />
                        </svg>
                    </button>
                    <button className={`btn ${allowEdit()} ${styles.statusBtn} ${isActiveStatus("Umsetzung")}`}
                        onClick={() => updateGoalStatus("Umsetzung")}
                        title="Umsetzung"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-arrow-repeat text-primary`} viewBox="0 0 16 16">
                            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41m-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9" />
                            <path fillRule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5 5 0 0 0 8 3M3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9z" />
                        </svg>
                    </button>
                    <button className={`btn ${allowEdit()} ${styles.statusBtn} ${isActiveStatus("Erreicht")}`}
                        onClick={() => updateGoalStatus("Erreicht")}
                        title="Erreicht"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={`bi bi-check2-circle text-success`} viewBox="0 0 16 16">
                            <path d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0" />
                            <path d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            <p className={`${styles.date}`}>{getDate(goal.dueDate)}</p>

            {goal.isSubGoal ? (
                <p className={`${styles.description}`} dangerouslySetInnerHTML={{ __html: goal.description }} />
            ) : (
                <>
                    <button className={`btn ${styles.detailsButton}`} onClick={() => setShowDetails(!showDetails)}>
                        {showDetails ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z" />
                            </svg>
                        ) : (

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67" />
                            </svg>
                        )}
                    </button>
                    {showDetails && (
                        <>
                            <h6>Beschreibung:</h6>
                            <p className={`${styles.description}`} dangerouslySetInnerHTML={{ __html: goal.description }} />

                            <div className={`${styles.commentsContainer}`}>
                                <h6>Kommentare:</h6>
                                {goal.comments &&
                                    goal.comments.length > 0 &&
                                    goal.comments.map((c) =>
                                        !c.isPrivate || (c.userID === user._id) ? (
                                            <div key={c._id} className={"d-flex flex-row commentBox"}>
                                                <div className={`${styles.comment}`} key={c.commentID}>
                                                    <div>
                                                        <span className={`${styles.writer}`}>
                                                            {c.userID === user._id ? 'Du: ' :
                                                                user.role === 'patient' ? 'Dein Therapeut: ' : `${selectedPatient?.name.first} ${selectedPatient?.name.last}:`
                                                            }
                                                        </span>
                                                        <span className={`${styles.date}`}>{getDate(c.creationDate)}</span>
                                                    </div>
                                                    {c.isPrivate ? (
                                                        <div className={`${styles.date}`}>
                                                            <i>privater Kommentar</i>
                                                        </div>
                                                    ) : null}
                                                    <p className={`${styles.commentText}`}>{c.comment}</p>
                                                </div>
                                                {c.userID === user._id && (
                                                    <button className={`btn btn-light align-self-center ${styles.statusBtn} ${styles.deleteBtn}`}
                                                        title="Löschen" onClick={() => deleteComment(c)}
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        ) : null
                                    )}
                            </div>

                            <GoalCommentForm onSave={handleComment} goalID={goal._id} />
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default RoadmapGoalTextbox;
