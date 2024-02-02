import {Comment} from "./Comment.ts";

export type Roadmap = {
    id: string;
    title: string;
    description: string;
    creationDate: Date;
    lastUpdated: Date;
    goals: RoadmapGoal[];
};

export type RoadmapGoal = {
    _id: string;
    title: string;
    description: string;
    status: 'Geplant' | 'Umsetzung' | 'Erreicht';
    comments: Comment[];
    creationDate: Date;
    dueDate?: Date;
    isSubGoal: boolean;
    parentGoalId?: string;
    subGoals?: RoadmapGoal[];
};
