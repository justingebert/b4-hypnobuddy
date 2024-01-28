export type Comment = {
    _id: string;
    userID: string;
    comment: string;
    isPrivate: boolean;
    creationDate: Date;
    roadmapGoalID: string;
};