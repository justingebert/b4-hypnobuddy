import React, { useState, useEffect } from 'react';
import QueueList from '../components/QueueList';
import { RoadmapGoal } from '../types/Roadmap-Goal.ts';
import GoalCreateForm from '../components/GoalCreateForm';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx"; // Assuming you have a form for adding/editing goals

const QueueView: React.FC = () => {

    const { goals, setGoals, fetchGoals, createGoal, updateGoal, deleteGoal } = useGoals();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingGoal, setEditingGoal] = useState<RoadmapGoal | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        fetchGoals
    }, []);

    const handleCreateNewGoal = async (goalData: RoadmapGoal) => {
        await createGoal(goalData);
        setShowCreateModal(false);
    };

    const handleUpdateGoal = async (updatedGoalData: RoadmapGoal) => {
        // Assuming updateGoal is a function available from useGoals that updates the goal
        await updateGoal(editingGoal.id, updatedGoalData);
        setEditingGoal(null);
        setShowCreateModal(false);
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
                        onSave={editingGoal ? handleUpdateGoal : handleCreateNewGoal}
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
