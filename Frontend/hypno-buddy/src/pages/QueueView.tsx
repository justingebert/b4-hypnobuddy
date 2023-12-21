import React, { useState, useEffect } from 'react';
import QueueList from '../components/QueueList';
import { RoadmapGoal } from '../types/Roadmap-Goal.ts';
import GoalCreateForm from '../components/GoalCreateForm';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx"; // Assuming you have a form for adding/editing goals

const QueueView: React.FC = () => {

    const { goals, setGoals, fetchGoals, createGoal, updateGoal, deleteGoal, updateGoalOrder, createSubGoal } = useGoals();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingGoal, setEditingGoal] = useState<RoadmapGoal | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const navigate = useNavigate();

    useEffect( () => {
        fetchGoals()
    }, []);

    const handleCreateNewGoal = async (goalData: RoadmapGoal) => {
        await createGoal(goalData);
        setShowCreateModal(false);
    };

    /**
     *  This function updates the goal in the backend on save
     * @param updatedGoalData
     */
    const handleUpdateGoal = async (updatedGoalData: RoadmapGoal) => {
        await updateGoal(editingGoal._id, updatedGoalData);
        setEditingGoal(null);
        setShowCreateModal(false);
    };

    /**
     * This function makes the form with the appropriate goal(editingGoal state) data appear
     * @param goal
     */
    const handleEditGoal = (goal: RoadmapGoal) => {
        setEditingGoal(goal);
        setShowCreateModal(true);
    };

    const handleDeleteGoal = async (goalId: string) => {
        await deleteGoal(goalId); // Call the deleteGoal function from the context
        setGoals(goals.filter(goal => goal._id !== goalId)); // Update local state to remove the deleted goal
    };


    const onReorder = async (reorderedGoals: RoadmapGoal[]) => {
        await updateGoalOrder(reorderedGoals.map(goal => goal._id));
        // Update the goals state with the new order
        setGoals(reorderedGoals);
    };

    const handleCreateSubGoal = async (parentGoalId: string) => {
        // Initialize a new subgoal with the parentGoalId
        const newSubGoal = {
            title: '', // Default title or prompt for input
            description: '', // Default description or prompt for input
            status: 'Geplant', // Default status
            parentGoalId: parentGoalId,
            isSubGoal: true,
        };
        setEditingGoal(newSubGoal);
        setShowCreateModal(true);
        await createSubGoal(subGoalData);
    }

    const goToRoadmap = () => {
        navigate('/roadmap');
    }

    return (
        <>
            <div className="container my-4">
                <h1 className="mb-3">Goals Queue</h1>
                <QueueList goals={goals} onReorder={onReorder} onEdit={handleEditGoal} onDelete={handleDeleteGoal} onCreateSubGoal={handleCreateSubGoal}/>
                <button className="btn btn-success m-3" onClick={() => setShowCreateModal(true)}>+ neues Ziel</button>

                {showCreateModal && (
                    <GoalCreateForm
                        goalData={editingGoal}
                        onSave={editingGoal ? handleUpdateGoal : handleCreateNewGoal}
                        onClose={() => setShowCreateModal(false)}
                    />
                )}
            </div>
            <br/>
            <button className="btn btn-secondary m-3" onClick={goToRoadmap}>← Roadmap</button>
        </>
    );
};

export default QueueView;
