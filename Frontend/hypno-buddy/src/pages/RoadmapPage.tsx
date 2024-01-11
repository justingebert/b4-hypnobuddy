import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";

import styles from '../styles/RoadmapPage.module.scss';

function RoadmapPage() {
    const { goals, addGoal, setGoals,fetchGoals } = useGoals();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const {user} = useAuth();

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
                                <p className={`${styles.description}`}>{goal.description}</p>
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
