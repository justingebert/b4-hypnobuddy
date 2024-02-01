import React, { useState, useEffect } from 'react';
import QueueList from '../components/QueueList';
import { RoadmapGoal } from '../types/Roadmap-Goal.ts';
import GoalCreateForm from '../components/GoalCreateForm';
import { useNavigate } from "react-router-dom";
import { useGoals } from "../contexts/GoalContext.tsx"; // Assuming you have a form for adding/editing goals
import styles from "../styles/Roadmap/Queueview.module.scss";
import style from '../styles/Roadmap/buttons.module.scss';

const QueueView: React.FC = () => {

    const { goals, setGoals, fetchGoals, createGoal, updateGoal, deleteGoal, updateGoalOrder, createSubGoal } = useGoals();
    const [editingGoal, setEditingGoal] = useState<RoadmapGoal | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [actionType, setActionType] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
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

    const onClose = async () => {
        setEditingGoal(null);
        setShowCreateModal(false);
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
                <div className={`row`}>
                    <h1 className={` box ${styles.heading} text-center`}>Goals Queue</h1>
                </div>
                <div className={`row`}>
                    <div className={`col-3 d-flex justify-content-center align-items-center`}>
                        <button className={`$ btn btn-secondary ${style.btnSecondaryCustom} box ${styles.stickyButtons}`}
                            onClick={goToRoadmap}>← Roadmap
                        </button>
                    </div>

                    <div className={`col-6`}>
                        <QueueList goals={goals} onReorder={onReorder} onEdit={handleEditGoal} onDelete={handleDeleteGoal}
                            onCreateSubGoal={handleCreateSubGoal} />
                    </div>
                    <div className={`col-3 d-flex justify-content-center box align-self-center`}>
                        <button className={`btn btn-primary ${style.btnPrimaryCustom}  ${styles.stickyButtons}`}
                            onClick={() => setShowCreateModal(true)}>+ neues
                            Ziel
                        </button>
                    </div>
                </div>
                {showCreateModal && (
                    <GoalCreateForm
                        goalData={editingGoal}
                        onSave={actionType === 'edit' ? handleUpdateGoal : handleCreateNewGoal}
                        onClose={onClose}
                    />
                )}
            </div>

        </>
    );
};

export default QueueView;
