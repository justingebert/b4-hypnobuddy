export type Comment = {
    _id: string;
    userID: string;
    comment: string;
    visible: boolean;
    creationDate: Date;
    roadmapGoalID: string;
};