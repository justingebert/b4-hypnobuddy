import React, { useState, useEffect } from 'react';
import QueueList from '../components/QueueList';
import { RoadmapGoal } from '../types/Roadmap-Goal.ts';
import GoalCreateForm from '../components/GoalCreateForm';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx"; // Assuming you have a form for adding/editing goals

const QueueView: React.FC = () => {

    const { goals, setGoals, addGoal } = useGoals();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        //TODO uncomment this when backend is ready
        // const fetchGoals = async () => {
        //     try {
        //         setIsLoading(true);
        //         const response = await fetch('http://localhost:3000/goals');
        //         if (response.ok) {
        //             const data = await response.json();
        //             setGoals(data);
        //         }
        //     } catch (error) {
        //
        //         setError(error.message);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };
        //
        // fetchGoals();

        setGoals([]);
    }, []);

    const handleCreateGoal = (goalData: RoadmapGoal) => {
        //TODO when backend is ready, uncomment this
        // try {
        //     const response = await fetch('http://localhost:3000/goal/create', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(goalData),
        //     });
        //
        //     if (response.ok) {
        //         const newGoal = await response.json();
        //         setGoals(prevGoals => [...prevGoals, newGoal]);
        //     } else {
        //         // Handle the error case
        //         console.error('Failed to create goal');
        //     }
        // } catch (error) {
        //     console.error('Error creating goal:', error);
        // }
        // Create a new goal locally
        addGoal({ ...goalData, id: Date.now().toString()});
        setShowCreateModal(false); // Close the modal after creating the goal
    };

    const onReorder = (reorderedGoals: RoadmapGoal[]) => {
        // Update the goals state with the new order
        setGoals(reorderedGoals);

        // save the new order to the backend
    };

    const goToRoadmap = () => {
        // Navigate to roadmap view
        navigate('/roadmap');
    }

    return (
        <>
            <div>
                <h1>Goals Queue</h1>
                <QueueList goals={goals} onReorder={onReorder} />
                <button onClick={() => setShowCreateModal(true)}>Create Goal</button>

                {showCreateModal && (
                    <GoalCreateForm
                        goalData={null}
                        onSave={handleCreateGoal}
                        onClose={() => setShowCreateModal(false)}
                    />
                )}
            </div>
            <br/>
            <button onClick={goToRoadmap}>Roadmap View</button>
        </>
    );
};

export default QueueView;
