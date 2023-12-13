import React, { createContext, useState, useContext, useCallback } from 'react';
import { RoadmapGoal } from '../types/Roadmap-Goal';

interface GoalsContextType {
    goals: RoadmapGoal[];
    setGoals: React.Dispatch<React.SetStateAction<RoadmapGoal[]>>;
    addGoal: (goal: RoadmapGoal) => void;
    fetchGoals: () => Promise<void>
    createGoal: (goalData: { title: string; description: string; status: string }) => Promise<void>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (context === undefined) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
};

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



    return (
        <GoalsContext.Provider value={{ goals, setGoals, addGoal, fetchGoals, createGoal }}>
            {children}
        </GoalsContext.Provider>
    );
};
