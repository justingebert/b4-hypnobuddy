import { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx";

import styles from '../styles/RoadmapPage.module.scss';

function RoadmapPage() {
    const { goals, addGoal, setGoals } = useGoals();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:3000/goal/get');
                if (response.ok) {
                    const data = await response.json();
                    setGoals(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        //fetchGoals(); //TODO uncomment this when backend is ready

    }, []);


    const handleAddGoal = async () => {
        //TODO connect with backend
        // try {
        //     const response = await fetch('http://localhost:3000/goals', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             title: 'New Goal',
        //             description: 'This is a new goal',
        //             status: 'Not Started',
        //         }),
        //     });
        //     if (response.ok) {
        //         const data = await response.json();
        //         setGoals([...goals, data]);
        //     }
        // } catch (error) {
        //     console.error('Error adding goal:', error);
        // }
    }

    const goToQueue = () => {
        navigate('/goalQueueView');
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 'Not Started': return 'bg-secondary';
            case 'in_progress': return 'bg-primary';
            case 'completed': return 'bg-success';
            default: return 'bg-secondary';
        }
    };

    if (isLoading) return <div>Loading...</div>;
   //if (error) return <div>Error: {error}</div>;

    return (
        <>
            <div className="container mt-3">
                <h1 className="text-center mb-4">Goals Roadmap</h1>
                <div className="d-flex flex-column align-items-center">
                    {goals.map((goal, index) => (
                        <div key={goal.id} className={`d-flex align-items-center ${index < goals.length - 1 ? 'mb-3' : ''}`}>
                            <div className={`${styles.circle} ${getStatusClass(goal.status)}`}>
                                {index + 1}
                            </div>
                            <div className="ml-3">
                                <h5>{goal.title}</h5>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button className="btn btn-success" onClick={handleAddGoal}>Add Goal</button>
                    <button className="btn btn-primary" onClick={() => navigate('/goalQueueView')}>Queue View</button>
                </div>
            </div>
        </>
    );
}

export default RoadmapPage;
