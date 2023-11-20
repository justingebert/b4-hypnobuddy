export type Roadmap = {
    id: string;
    title: string;
    description: string;
    creationDate: Date;
    lastUpdated: Date;
    goals: RoadmapGoal[];
    //add more
};

export type RoadmapGoal = {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    creationDate: Date;
    dueDate?: Date;
    isSubGoal: boolean;
    parentGoalId?: string;
    subGoals?: RoadmapGoal[];
};
