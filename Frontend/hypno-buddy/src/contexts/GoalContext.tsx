import React, { createContext, useState, useContext, useCallback } from 'react';
import { RoadmapGoal } from '../types/Roadmap-Goal';
import {Comment} from "../types/Comment.ts";
import {FlashContext} from "./FlashContext.tsx";
import {url} from "./AuthContext.tsx";

interface GoalsContextType {
    goals: RoadmapGoal[];
    setGoals: React.Dispatch<React.SetStateAction<RoadmapGoal[]>>;
    addGoal: (goal: RoadmapGoal) => void;
    fetchGoals: () => Promise<void>
    fetchGoalsOf: (selectedPatientID: string | undefined) => Promise<void>
    createGoal: (goalData: RoadmapGoal) => Promise<void>;
    deleteGoal: (goalId: string) => Promise<void>;
    updateGoal: (goalId: string, updatedData: RoadmapGoal) => Promise<void>;
    updateGoalOrder: (newOrder: string[]) => Promise<void>
    createSubGoal: (subGoalData: RoadmapGoal) => Promise<void>;
    getLocalGoalById: (goalId: string) => RoadmapGoal | undefined;
    saveComment: (commentData:{ comment:string, isPrivate:boolean, goalID:string, userID:string }) => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (context === undefined) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
};
/**
 *  this provider provides all the goal functions to get,create, delete and update goals
 *  use POST instead of PUT and DELETE -> combined flow control
 * @param children
 * @constructor
 */
export const GoalsProvider: React.FC = ({ children }) => {
    const [goals, setGoals] = useState<RoadmapGoal[]>([]);
    const { flash } = useContext(FlashContext);

    const addGoal = useCallback((newGoal: RoadmapGoal) => {
        setGoals((prevGoals) => [...prevGoals, newGoal]);
    }, []);

    const fetchGoals = useCallback(async () => {
        try {
            const response = await fetch(url + '/goal/getAll', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setGoals(data.goals);
            } else {
                console.error('Failed to fetch goals:', response.status);
            }
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    }, []);

    const createGoal = useCallback(async (goalData: RoadmapGoal) => {
        try {
            const response = await fetch(url + '/goal/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(goalData),
            });

            if (response.ok) {
                const newGoal = await response.json();
                setGoals(prevGoals => [newGoal.goal, ...prevGoals]);
            } else {
                console.error('Failed to create goal:', response.status);
            }
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    }, []);

    const fetchGoalsOf = useCallback(async (selectedPatientID: string|undefined) => {
        try {
            let response: Response;
            if (selectedPatientID) {
                //therapist gets patients goals
                response = await fetch(`http://localhost:3000/goal/ofPatient/${selectedPatientID}`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                });
            }else{
                //user gets own goals
                response = await fetch(`http://localhost:3000/goal/getAll`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: "include",
                });
            }
            if (response.ok) {
                const data = await response.json();
                setGoals(data.goals);
            } else {
                console.error('Failed to fetch goals:', response.status);
            }
        } catch (error) {
            console.error('Error fetching goals:', error);
        }
    }, []);

    const deleteGoal = useCallback(async (goalId: string) => {
        try {
            const response = await fetch(url + `/goal/delete/${goalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                setGoals(prevGoals => prevGoals.map(goal => {
                    // Check if the current goal has subgoals
                    if (goal.subGoals) {
                        // Filter out the deleted subgoal from the subGoals array
                        goal.subGoals = goal.subGoals.filter(subGoal => subGoal._id !== goalId);
                        return goal
                    }
                    return goal;
                }).filter(goal => goal._id !== goalId));

            } else {
                console.error('Failed to delete goal:', response.status);
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    }, []);

    const updateGoal = useCallback(async (goalId: string, updatedData: RoadmapGoal) => {
        try {
            const response = await fetch(url + `/goal/update/${goalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const updatedGoalResponse = await response.json();
                const updatedGoal = updatedGoalResponse.goal;

                setGoals(prevGoals => {
                    const newGoals = prevGoals.map(goal => {
                        if (goal._id === goalId) {
                            return { ...goal, ...updatedGoal };
                        }
                        if (goal.subGoals && goal.subGoals.some(subGoal => subGoal._id === goalId)) {
                            return {
                                ...goal,
                                subGoals: goal.subGoals.map(subGoal =>
                                    subGoal._id === goalId ? { ...subGoal, ...updatedGoal } : subGoal
                                )
                            };
                        }
                        return goal;
                    });
                    return newGoals;
                });
            } else {
                console.error('Failed to update goal:', response.status);
            }
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    }, []);

    /**
     * Updates the order of goals for a user
     * - route: POST /goal/reorder
     * @param req {body: { goalIDs }}
     * @param res {success: true, message: 'Successfully updated goal order', redirect: '/'}
     * @param next
     */
    const updateGoalOrder = useCallback(async (newOrder: string[]) => {
        try {
            const response = await fetch(url + '/goal/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ goalIDs: newOrder }),
            });

            if (response.ok) {
                // Optionally update the local state if needed
            } else {
                console.error('Failed to update goal order:', response.status);
            }
        } catch (error) {
            console.error('Error updating goal order:', error);
        }
    }, []);

    const createSubGoal = useCallback(async (subGoalData: RoadmapGoal) => {
        try {
            const response = await fetch(url + '/goal/createSubGoal', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(subGoalData),
            });

            if (response.ok) {
                const newSubGoalPromise = await response.json();
                const newSubGoal = newSubGoalPromise.subgoal;
                setGoals(prevGoals => prevGoals.map(goal =>
                    goal._id === newSubGoal.parentGoalId
                        ? { ...goal, subGoals: [...(goal.subGoals || []), newSubGoal] }
                        : goal
                ));

            } else {
                console.error('Failed to create subgoal:', response.status);
            }
        } catch (error) {
            // Handle network errors
            console.error('Error creating subgoal:', error);
        }
    }, []);

    const saveComment = useCallback(async (commentData:{ comment:string, isPrivate:boolean, goalID:string, userID:string }) => {
        try {
            console.log(commentData)
            const response = await fetch('http://localhost:3000/goal/saveComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(commentData)
            });

            if (response.ok) {
                const updatedGoalPromise = await response.json();
                setGoals(prevGoals => prevGoals.map(goal => goal._id === commentData.goalID ? { ...goal, ...updatedGoalPromise.goal } : goal));
            } else {
                console.error('Failed to update goal:', response.status);
            }
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    },[]);

    const getLocalGoalById = useCallback((goalId: (string | undefined)) => {
        return goals.find(goal => goal._id === goalId);

    }, []);

    return (
        <GoalsContext.Provider value={{ goals, setGoals, addGoal, fetchGoals, createGoal, deleteGoal, updateGoal, updateGoalOrder, createSubGoal, fetchGoalsOf, saveComment, getLocalGoalById }}>
            {children}
        </GoalsContext.Provider>
    );
};
