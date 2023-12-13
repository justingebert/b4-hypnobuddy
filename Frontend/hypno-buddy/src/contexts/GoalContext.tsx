import React, { createContext, useState, useContext, useCallback } from 'react';
import { RoadmapGoal } from '../types/Roadmap-Goal';

interface GoalsContextType {
    goals: RoadmapGoal[];
    setGoals: React.Dispatch<React.SetStateAction<RoadmapGoal[]>>;
    addGoal: (goal: RoadmapGoal) => void;
    fetchGoals: () => Promise<void>
    createGoal: (goalData: { title: string; description: string; status: string }) => Promise<void>;
    deleteGoal: (goalId: string) => Promise<void>;
    updateGoal: (goalId: string, updatedData: RoadmapGoal) => Promise<void>;
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

    const addGoal = useCallback((newGoal: RoadmapGoal) => {
        setGoals((prevGoals) => [...prevGoals, newGoal]);
    }, []);

    const fetchGoals = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:3000/goal/getAll', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
            });
            if (response.ok) {
                const data = await response.json();
                setGoals(data.goals); // Assuming the response has a 'goals' property
            } else {
                console.error('Failed to fetch goals:', response.status);//TODO implement flash
            }
        } catch (error) {
            console.error('Error fetching goals:', error);//TODO implement flash
        }
    }, []);

    const createGoal = useCallback(async (goalData: { title: string; description: string; status: string }) => {
        try {
            const response = await fetch('http://localhost:3000/goal/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(goalData),
            });

            if (response.ok) {
                const newGoal = await response.json();
                setGoals(prevGoals => [...prevGoals, newGoal.goal]);
            } else {
                // Handle HTTP errors
                console.error('Failed to create goal:', response.status);
            }
        } catch (error) {
            // Handle network errors
            console.error('Error creating goal:', error);
        }
    }, []);

    const deleteGoal = useCallback(async (goalId: string) => {
        try {
            const response = await fetch(`http://localhost:3000/goal/delete/${goalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.ok) {
                setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
            } else {
                console.error('Failed to delete goal:', response.status);
            }
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    }, []);

    const updateGoal = useCallback(async (goalId: string, updatedData: RoadmapGoal) => {
        try {
            const response = await fetch(`http://localhost:3000/goal/update/${goalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(updatedData),
            });

            if (response.ok) {
                const updatedGoal = await response.json();
                setGoals(prevGoals => prevGoals.map(goal => goal.id === goalId ? { ...goal, ...updatedGoal } : goal));
            } else {
                console.error('Failed to update goal:', response.status);
            }
        } catch (error) {
            console.error('Error updating goal:', error);
        }
    }, []);

    const updateGoalOrder = useCallback(async (newOrder: string[]) => {
        try {
            const response = await fetch('http://localhost:3000/goal/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ goalIDs: newOrder }),
            });

            if (response.ok) {
                // Optionally update the local state if needed
                // This depends on how you're managing and displaying goals
            } else {
                console.error('Failed to update goal order:', response.status);
            }
        } catch (error) {
            console.error('Error updating goal order:', error);
        }
    }, []);

    return (
        <GoalsContext.Provider value={{ goals, setGoals, addGoal, fetchGoals, createGoal, deleteGoal, updateGoal }}>
            {children}
        </GoalsContext.Provider>
    );
};
