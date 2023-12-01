import { useState, useEffect } from 'react';
import Goal from "../components/Goal.tsx";
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx";

function RoadmapPage() {
    const { goals, addGoal, setGoals } = useGoals();
    const [isLoading, setIsLoading] = useState(true);
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

        fetchGoals();
    }, []);

    //TODO implement with form popping up
    const handleAddGoal = async () => {
        try {
            const response = await fetch('http://localhost:3000/goals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: 'New Goal',
                    description: 'This is a new goal',
                    status: 'Not Started',
                }),
            });
            if (response.ok) {
                const data = await response.json();
                setGoals([...goals, data]);
            }
        } catch (error) {
            console.error('Error adding goal:', error);
        }
    }

    const goToQueue = () => {
        navigate('/goalQueueView');
    }
    if (isLoading) return <div>Loading...</div>;
   //if (error) return <div>Error: {error}</div>;

    return (
        <>
            <h1>Roadmap</h1>
            {goals.map(goal => (
                <Goal key={goal.id} goal={goal}/>
            ))}
            <button onClick={handleAddGoal}>Add Goal</button>
            <button onClick={goToQueue}>Queue View</button>
        </>
    );
}

export default RoadmapPage;
