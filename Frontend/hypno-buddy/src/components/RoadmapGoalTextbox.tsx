import React, {useState} from 'react';
import styles from "../styles/RoadmapPage.module.scss";
import GoalCommentForm from "./GoalCommentForm.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";

function RoadmapGoalTextbox({ goal, handleComment }) {
    const {user,selectedPatient} = useAuth();
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

    return (
        <div className={`${styles.textbox}`}>
            <h5 className={`${styles.title}`}>{goal.title}</h5>
            <p className={`${styles.date}`}>{getDate(goal.dueDate)}</p>
            <button className={`btn ${styles.detailsButton}`} onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-up" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894z"/>
                    </svg>
                ) : (

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-compact-down" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M1.553 6.776a.5.5 0 0 1 .67-.223L8 9.44l5.776-2.888a.5.5 0 1 1 .448.894l-6 3a.5.5 0 0 1-.448 0l-6-3a.5.5 0 0 1-.223-.67"/>
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
                                    !c.isPrivate ? (
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
                                    ) : null
                            )}
                    </div>

                    <GoalCommentForm onSave={handleComment} goalID={goal._id} />
                </>
            )}
        </div>
    );
}

export default RoadmapGoalTextbox;
