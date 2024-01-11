import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";
import GoalCommentForm from "../components/GoalCommentForm.tsx";

import styles from '../styles/RoadmapPage.module.scss';
import {RoadmapGoal} from "../types/Roadmap-Goal.ts";
import GoalCreateForm from "../components/GoalCreateForm.tsx";

function RoadmapPage() {
    const { goals, addGoal, setGoals,fetchGoals } = useGoals();
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

    const onComment = (goal: RoadmapGoal) => {
        setEditingGoal(goal);
        setShowCommentForm(true);
    };

    const handleComment = async (comment: string, isVisible: boolean) => {
        try {
            //await updateGoal();
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
                                <p className={`${styles.date}`}>{getDueDate(goal.dueDate)}</p>
                                <p className={`${styles.description}`} dangerouslySetInnerHTML={{ __html: goal.description }} />

                                {!showCommentForm && (<button className="btn btn-secondary mr-2" onClick={() => onComment(goal)}>Kommentieren</button>)}
                                {showCommentForm && (
                                    <GoalCommentForm
                                        onSave={handleComment}
                                        onClose={() => setShowCommentForm(false)}
                                    />
                                )}
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
