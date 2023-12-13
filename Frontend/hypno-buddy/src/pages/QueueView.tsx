import React, { useState, useEffect } from 'react';
import QueueList from '../components/QueueList';
import { RoadmapGoal } from '../types/Roadmap-Goal.ts';
import GoalCreateForm from '../components/GoalCreateForm';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx"; // Assuming you have a form for adding/editing goals

const QueueView: React.FC = () => {

    const { goals, setGoals, addGoal, fetchGoals, createGoal } = useGoals();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingGoal, setEditingGoal] = useState<RoadmapGoal | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchGoals
    }, []);

    const handleCreateGoal = async (goalData: RoadmapGoal) => {
        //TODO connect Backend

        if (editingGoal) {
            // Updating an existing goal
            const updatedGoals = goals.map(goal => goal.id === editingGoal.id ? { ...goal, ...goalData } : goal);
            setGoals(updatedGoals);
        } else {
            console.log(goalData)
            await createGoal(goalData)
        }
        setShowCreateModal(false);
        setEditingGoal(null); // Reset editing state
    };

    const handleEditGoal = (goal: RoadmapGoal) => {
        setEditingGoal(goal);
        setShowCreateModal(true);
    };

    const handleDeleteGoal = (goalId: string) => {
        // Logic for handling delete
        // For example, filter out the deleted goal from the goals array
        setGoals(goals.filter(goal => goal.id !== goalId));
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
            <div className="container my-4">
                <h1 className="mb-3">Goals Queue</h1>
                <QueueList goals={goals} onReorder={onReorder} onEdit={handleEditGoal} onDelete={handleDeleteGoal}/>
                <button className="btn btn-success mt-3" onClick={() => setShowCreateModal(true)}>Create Goal</button>

                {showCreateModal && (
                    <GoalCreateForm
                        goalData={editingGoal}
                        onSave={handleCreateGoal}
                        onClose={() => setShowCreateModal(false)}
                    />
                )}
            </div>
            <br/>
            <button className="btn btn-secondary" onClick={goToRoadmap}>Roadmap View</button>
        </>
    );
};

export default QueueView;
