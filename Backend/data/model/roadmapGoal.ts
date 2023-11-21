import mongoose from "mongoose";

const roadmapGoalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    //discussion: include or not
    dueDate: {
        type: Date
    },
    isSubGoal: {
        type: Boolean,
        required: true
    },
    parentGoalId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoadmapGoal',
        required: function () {
            return this.isSubGoal === true;
        }
    },
    subGoals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RoadmapGoal'
    }],
});

const RoadmapGoalModel = mongoose.model('RoadmapGoal', roadmapGoalSchema);

module.exports = RoadmapGoalModel;
