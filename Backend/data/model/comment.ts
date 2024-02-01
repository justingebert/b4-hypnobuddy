import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    isPrivate: {
        type: Boolean,
    },
    goalID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoadmapGoal',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true
    }
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;