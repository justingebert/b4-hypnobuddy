import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";

import styles from '../styles/RoadmapPage.module.scss';
import {RoadmapGoal} from "../types/Roadmap-Goal.ts";
import {Comment} from "../types/Comment.ts";
import GoalCommentForm from "../components/GoalCommentForm.tsx";
import GoalCreateForm from "../components/GoalCreateForm.tsx";

function RoadmapPage() {
    const { goals, addGoal, setGoals,fetchGoals, saveComment } = useGoals();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useAuth();
    const [editingGoal, setEditingGoal] = useState<RoadmapGoal | null>(null);
    const [showCommentForm, setShowCommentForm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchGoals()
    },[]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Geplant': return 'bg-secondary';
            case 'Umsetzung': return 'bg-primary';
            case 'Erreicht': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    const getDate = (date) => {
        const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        if (date instanceof Date) {
            return date.toLocaleDateString('de-DE', options);
        }
        else if (typeof date === 'string') {
            return new Date(date).toLocaleDateString('de-DE', options);
        }
        return date;
    }

    const onComment = (goal: RoadmapGoal) => {
        setEditingGoal(goal);
        setShowCommentForm(true);
    };

    const handleComment = async (comment: string, isVisible: boolean) => {
        try {
            const commentData = {comment, isVisible, goalID: editingGoal._id, userID: user._id};
            await saveComment(commentData);
            setEditingGoal(null);
            //await fetchGoals();  ?? is fetch needed
            setShowCommentForm(false);
        } catch (error) {
            console.error('Error updating goal with comment:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;
   //if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="container mt-3">
                <h1 className="text-center mb-4">Roadmap</h1>

                {/*<div className={`${styles.timeline} d-flex flex-column align-items-start`}>*/}
                <div className={`${styles.timeline}`}>
                    {goals.length > 0 && goals.map((goal, index) => (
                        <div
                            key={goal._id}
                            // className={`${index % 2 === 0 ? styles.sectionRight : styles.sectionLeft} d-flex align-items-center ${index < goals.length - 1 ? 'mb-3' : ''}`}
                            className={`${index % 2 === 0 ? styles.sectionRight : styles.sectionLeft}`}
                        >
                            <div className={`${styles.circle} ${getStatusClass(goal.status)}`}>
                                {index + 1}
                            </div>
                            <div className={`${styles.textbox}`}>
                                <h5 className={`${styles.title}`}>{goal.title}</h5>
                                <p className={`${styles.date}`}>{getDate(goal.dueDate)}</p>
                                <div className={`${styles.details}`}>
                                    {/*TODO: make detials hideable*/}
                                    <h6>Beschreibung:</h6>
                                    <p className={`${styles.description}`} dangerouslySetInnerHTML={{ __html: goal.description }} />

                                    {goal.comments && goal.comments.length > 0 && (
                                        <div className={`${styles.commentsContainer}`}>
                                            <h6>Kommentare:</h6>
                                            {goal.comments.map(c => (
                                                <div className={`${styles.comment}`}>
                                                    {c.userID === user._id ? (
                                                        <p className={`${styles.writer}`}>Du:</p>
                                                    ) : (
                                                        <p className={`${styles.writer}`}>Dein Therapeut:</p>
                                                    )}
                                                    <p className={`${styles.date}`}>{getDate(c.creationDate)}</p>
                                                    <p className={`${styles.commentText}`}>{c.comment}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {!showCommentForm && (<button className="btn btn-secondary mr-2" onClick={() => onComment(goal)}>Kommentieren</button>)}
                                    {showCommentForm && (
                                        <GoalCommentForm
                                            onSave={handleComment}
                                            onClose={() => setShowCommentForm(false)}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-4">
                    {/*<button className="btn btn-success" onClick={handleAddGoal}>Add Goal</button>*/}
                    <button className="btn btn-primary m-3" onClick={() => navigate('/goalQueueView')}>Bearbeiten</button>
                </div>

            </div>
        </>
    );
}

export default RoadmapPage;
