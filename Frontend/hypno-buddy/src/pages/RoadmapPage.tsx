import styles from '../styles/RoadmapPage.module.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useGoals } from "../contexts/GoalContext.tsx";
import { useAuth } from "../contexts/AuthContext.tsx";
import { RoadmapGoal } from "../types/Roadmap-Goal.ts";
import RoadmapGoalTextbox from "../components/RoadmapGoalTextbox.tsx";
import style from '../styles/Roadmap/buttons.module.scss';


function RoadmapPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { isAuthenticated, user, selectedPatient } = useAuth();
    const { goals, addGoal, setGoals, fetchGoals, fetchGoalsOf, saveComment } = useGoals();
    const [editingGoal, setEditingGoal] = useState<RoadmapGoal | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedPatient && user.role === 'therapist') {
            fetchGoalsOf(selectedPatient._id); //fetch patients goals
        } else {
            fetchGoalsOf(undefined) //fetch users own goals
        }
    }, [isAuthenticated, user, selectedPatient]);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Geplant': return `${styles.planned}`;
            case 'Umsetzung': return `${styles.doing}`;
            case 'Erreicht': return `${styles.reached}`;
            default: return 'bg-secondary';
        }
    };

    const sortedGoals = goals.slice().sort((a, b) => {
        // Define the order of goal states (you can adjust based on your needs)
        const stateOrder = { 'Erreicht': 1, 'Umsetzung': 2, 'Geplant': 3 };

        // Get the order for each goal
        const orderA = stateOrder[a.status] || 0;
        const orderB = stateOrder[b.status] || 0;

        // Compare the goals based on their state order
        return orderB - orderA;
    });

    const getTimelineColor = (status) => {
        switch (status) {
            case 'Geplant':
                return styles.planned;
            case 'Umsetzung':
                return styles.doing;
            case 'Erreicht':
                return styles.reached;
            default:
                return styles.defaultColor; // Define a default color class
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
            const commentData = { comment, isPrivate: isPrivate, goalID: goalID, userID: user._id };
            await saveComment(commentData);
            setEditingGoal(null);
        } catch (error) {
            console.error('Error updating goal with comment:', error);
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className={styles.roadmap}>
            <div className={`row`}>
                <h1 className={` box ${styles.header} text-center`}>ROADMAP</h1>
            </div>
            {user?.role === 'patient' &&
                <div className={`row`}>
                    <div className={`col-3 d-flex justify-content-center align-items-center`}>
                        <button className={`$ btn btn-secondary ${style.btnSecondaryCustom} box ${styles.button}`} onClick={() => navigate('/goalQueueView')}>
                            Bearbeiten
                        </button>
                    </div>
                </div>
            }
            <h4 className="text-center mb-4">{selectedPatient?.name.first} {selectedPatient?.name.last}</h4>
            <div className={`${styles.timeline} ${getTimelineColor(sortedGoals[0]?.status)}\``}>
                {sortedGoals.length > 0 && sortedGoals.map((goal, index) => (
                    <div
                        key={goal._id}
                        className={`${index % 2 === 0 ? styles.sectionRight : styles.sectionLeft}`}
                    >
                        <div className={`${styles.circle} ${getStatusClass(goal.status)}`}></div>
                        <RoadmapGoalTextbox key={goal._id} goal={goal} handleComment={handleComment} />
                        {goal.subGoals && goal.subGoals.map((subgoal, subIndex) => (
                            <div
                                key={subgoal._id}
                                className={`${index % 2 === 0 ? styles.subSectionRight : styles.subSectionLeft} ${styles.subSection}`}
                            >
                                <RoadmapGoalTextbox goal={subgoal} handleComment={handleComment} />
                            </div>
                        ))}
                    </div>
                ))}

            </div>
        </div>
    );
}

export default RoadmapPage;
