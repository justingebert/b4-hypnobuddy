import React, { useState, useEffect } from 'react';
import QueueList from '../components/QueueList';
import { RoadmapGoal } from '../types/Roadmap-Goal.ts';
import GoalCreateForm from '../components/GoalCreateForm';
import {useNavigate} from "react-router-dom";
import {useGoals} from "../contexts/GoalContext.tsx"; // Assuming you have a form for adding/editing goals
import styles from "../styles/Roadmap/Queueview.module.scss";
import styles2 from "../styles/GoalForm.module.scss";

const QueueView: React.FC = () => {

    const { goals, setGoals, fetchGoals, createGoal, updateGoal, deleteGoal, updateGoalOrder, createSubGoal } = useGoals();
    const [editingGoal, setEditingGoal] = useState<RoadmapGoal | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [actionType, setActionType] = useState(null);

    const navigate = useNavigate();

    useEffect( () => {
        fetchGoals()
    }, []);

    //TODO should be split into two functions
    const handleCreateNewGoal = async (goalData: RoadmapGoal) => {

        //if not s a subgoal
        if (!goalData.isSubGoal) {
            await createGoal(goalData);
            setShowCreateModal(false);
            window.scrollTo(0, 0);
            return;
        }
        //if it is a subgoal
        await createSubGoal(goalData)
        setEditingGoal(null);
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
        setActionType('edit');
    };

    //TODO add delete subgoal form parent
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
            title: '',
            description: '',
            status: 'Geplant',
            parentGoalId: parentGoalId,
            isSubGoal: true,
        };
        setEditingGoal(newSubGoal);
        setShowCreateModal(true);
        setActionType('createSubGoal');
    }

    const goToRoadmap = () => {
        navigate('/roadmap');
    }

    return (
        <>
            <div className={`container ${styles.queueView} `}>
                    <div className={`${styles.queueViewTop} d-flex justify-content-center`}>
                        <button className={`${styles.btn} btn btn-secondary box align-self-center`} onClick={goToRoadmap}>← Roadmap</button>
                        <h1 className={`m-5 box ${styles.heading}`}>Goals Queue</h1>
                        <button className={`btn btn-primary box align-self-center`} onClick={() => setShowCreateModal(true)}>+ neues
                            Ziel
                        </button>
                    </div>

                <QueueList goals={goals} onReorder={onReorder} onEdit={handleEditGoal} onDelete={handleDeleteGoal}
                           onCreateSubGoal={handleCreateSubGoal}/>

                {showCreateModal && (
                    <GoalCreateForm
                        goalData={editingGoal}
                        onSave={actionType === 'edit' ? handleUpdateGoal : handleCreateNewGoal}
                        onClose={() => {
                            setShowCreateModal(false)
                            setEditingGoal(null);
                        }
                        }
                    />
                )}
            </div>
            <br/>

        </>
    );
};

export default QueueView;
