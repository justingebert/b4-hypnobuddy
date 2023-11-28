import React, { useState, useEffect } from 'react';
import Goal from "../components/Goal.tsx";

function RoadmapPage() {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:3000/goals');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGoals(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setGoals([]);
                setIsLoading(false);
            }
        };

        fetchGoals();
    }, []);

    if (isLoading) return <div>Loading...</div>;
   //if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Roadmap</h1>
            {goals.map(goal => (
                <Goal key={goal.id} goal={goal} />
            ))}
        </div>
    );
}

export default RoadmapPage;
