import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";

import styles from '../styles/RoadmapPage.module.scss';
import {RoadmapGoal} from "../types/Roadmap-Goal.ts";
import GoalCommentForm from "../components/GoalCommentForm.tsx";
import RoadmapGoalTextbox from "../components/RoadmapGoalTextbox.tsx";

function RoadmapPage() {
    const { goals, addGoal, setGoals,fetchGoals, saveComment } = useGoals();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useAuth();
    const [editingGoal, setEditingGoal] = useState<RoadmapGoal | null>(null);

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

    const handleComment = async (comment: string, isPrivate: boolean, goalID: string) => {
        try {
            const commentData = {comment, isPrivate: isPrivate, goalID: goalID, userID: user._id};
            await saveComment(commentData);
            setEditingGoal(null);
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

                            <RoadmapGoalTextbox goal={goal} handleComment={handleComment} />
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
