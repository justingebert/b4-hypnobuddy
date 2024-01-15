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
    _id: string;
    title: string;
    description: string;
    status: 'Geplant' | 'Umsetzung' | 'Erreicht';
    comments: string[];
    creationDate: Date;
    dueDate?: Date;
    isSubGoal: boolean;
    parentGoalId?: string;
    subGoals?: RoadmapGoal[];
};
