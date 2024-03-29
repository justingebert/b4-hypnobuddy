import RoadmapGoal from '../data/model/roadmapGoal';
import User from '../data/model/user';
import Comment from '../data/model/comment';

import { body, validationResult } from 'express-validator';
import { isValid, parseISO } from 'date-fns';

/**
 * Extracts the goal parameters from the request body
 * @param request - request body containing { userID, title, description, status, dueDate, isSubGoal, parentGoalId, subGoals }
 */
export const getGoalParams = request => {
    return {
        userID: request.user._id,
        title: request.body.title,
        description: request.body.description,
        status: request.body.status,
        dueDate: request.body.dueDate,
        isSubGoal: request.body.isSubGoal,
        parentGoalId: request.body.parentGoalId,
        subGoals: []
    }
}

/**
 * Validates the request body
 */
export const validate = [
    // Validation and sanitization middlewares
    body('title')
        .trim()
        .notEmpty().withMessage('Title cannot be empty'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description cannot be empty'),
    body('status')
        .notEmpty().withMessage('Status cannot be empty')
        .isIn(['Geplant', 'Umsetzung', 'Erreicht']).withMessage('Status must be one of: Geplant, Umsetzung, Erreicht'),
    body('dueDate')
        .custom((value) => {
            if (value !== null && value !== undefined && value !== '') {
                value = parseISO(value);
                if (!isValid(value)) {
                    throw new Error(`Due Date must be a valid date. Received: ${value}`);
                }
            } else {
                value = null;
            }
            return true;
        }),
    body('isSubGoal')
        .notEmpty().withMessage('isSubGoal cannot be empty')
        .isBoolean().withMessage('isSubGoal must be a boolean'),
    body('parentGoalId')
        .optional({ nullable: true })
        .isMongoId().withMessage('parentGoalId must be a valid MongoDB ID'),
    /* TODO include agaain when subGoals are implemented
    body('subGoals')
        .custom((value, { req }) => {
            // If subGoals is undefined or null, set it to an empty array
            req.body.subGoals = value || [];
            return true;
        })
        .isArray().withMessage('subGoals must be an array'),
     */

    // Middleware to handle the validation result
    (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // Map the errors to extract messages
                const messages = errors.array().map(e => e.msg);

                req.skip = true; // to avoid rewriting the response
                return res.status(400).json({
                    success: false,
                    redirect: '/',
                    message: messages.join(' and ')
                });
            }
            next();
        } catch (error) {
            console.error('Error during validation:', error);
            res.status(500).json({
                success: false,
                redirect: '/',
                message: 'Internal Server Error'
            });
        }
    }
];

/**
 * Creates a new goal and saves it to the database
 * -
 * - userID saved within the goal document
 * - goalID saved within the user document
 * @param req {body: { userID, title, description, status, dueDate, isSubGoal, parentGoalId, subGoals }}
 * @param res {success: true, message: 'Successful Login', goal: savedRoadmapGoal, redirect: '/'}
 * @param next
 */
export async function createGoal (req, res, next) {
    if (req.skip) {
        return next();
    }

    try {
        const newRoadmapGoal = new RoadmapGoal(getGoalParams(req));
        newRoadmapGoal.description = newRoadmapGoal.description.replace(/\n/g, '<br>'); //makes multiline description possible
        const savedRoadmapGoal = await newRoadmapGoal.save();

        await User.findOneAndUpdate(
            { _id: savedRoadmapGoal.userID },
            {$push: {goalIDs: {$each: [savedRoadmapGoal._id], $position: 0 }}}
        );
        console.log(savedRoadmapGoal.description)
        return res.json({
            success: true,
            message: 'Successfully created goal',
            goal: savedRoadmapGoal,
            redirect: '/',
        });


    }catch (error){
        console.error('Error creating roadmap goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next();
    }
}

/**
 * Gets all goals for a given user
 * - route: GET /goal/getAll
 * @param req
 * @param res {success: true, message: 'Successfully retrieved goals', goals: goals, redirect: '/'}
 * @param next
 */
export async function getAllGoals(req, res, next) {
    if (req.skip) {
        return next();
    }
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        //get order of goals form user document
        const goalIDs = await User.findOne({ _id: req.user._id }).select('goalIDs');

        const goals = [];
        for (const goalID of goalIDs.goalIDs) {
            const goal = await RoadmapGoal.findById(goalID).populate('comments');
            if (goal) {
                const subGoals = Array.isArray(goal.subGoals) ? goal.subGoals : [];
                const populatedSubGoals = [];

                for (const subGoalID of subGoals) {
                    const subGoal = await RoadmapGoal.findById(subGoalID);
                    if (subGoal) {
                        populatedSubGoals.push(subGoal);
                    }
                }

                goal.subGoals = populatedSubGoals;
                goals.push(goal);
            }
        }

        return res.json({
            success: true,
            message: 'Successfully retrieved goals',
            goals: goals,
            redirect: '/',
        });

    } catch (error) {
        console.error('Error getting all roadmap goals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next();
    }
}

/**
 * Gets all goals for a given user
 * - route: GET /goal/ofPatient/:patientID
 * @param req
 * @param res
 * @param next
 */
export async function getGoalsOfPatient(req, res, next) {
    if (req.skip) {
        return next();
    }
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        //get order of goals form user document
        const goalIDs = await User.findById(req.params.patientID).select('goalIDs');
        //add goals in the correct order to the goals array
        const goals = [];
        if(goalIDs){
            for (const goalID of goalIDs.goalIDs) {
                const goal = await RoadmapGoal.findById(goalID).populate("comments");
                if (goal) {
                    const subGoals = Array.isArray(goal.subGoals) ? goal.subGoals : [];
                    const populatedSubGoals = [];

                    for (const subGoalID of subGoals) {
                        const subGoal = await RoadmapGoal.findById(subGoalID);
                        if (subGoal) {
                            populatedSubGoals.push(subGoal);
                        }
                    }

                    goal.subGoals = populatedSubGoals;
                    goals.push(goal);
                }
            }
        }

        return res.json({
            success: true,
            message: 'Successfully retrieved goals',
            goals: goals,
            redirect: '/',
        });

    } catch (error) {
        console.error('Error getting all roadmap goals:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next();
    }

}

/**
 * Gets a goal by ID
 * - route: GET /goal/:goalId
 * @param req
 * @param res {success: true, message: 'Successfully retrieved goal', goal: goal, redirect: '/'}
 * @param next
 */
export async function getGoal(req, res, next) {
    if (req.skip) {
        return next();
    }
    try {
        const goal = await RoadmapGoal.findById(req.params.goalId).populate('subGoals');
        if(!goal){
            return res.status(404).json({error: 'Goal not found'});
        }
        return res.json({
            success: true,
            message: 'Successfully retrieved goal',
            goal: goal,
            redirect: '/',
        });


    } catch (error) {
        console.error('Error getting roadmap goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next();
    }
}

export async function deleteGoal(req, res, next) {
    if (req.skip) {
        return next();
    }
    try {
        const goalId = req.params.goalId;

        const deleteGoal = await RoadmapGoal.findById(goalId);
        if (!deleteGoal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        //delete comments
        for (const comment of deleteGoal.comments) {
            await Comment.findByIdAndDelete(comment._id);
        }

        //update the User to remove the goalID
        await User.updateOne({ _id: deleteGoal.userID }, { $pull: { goalIDs: deleteGoal._id } });

        await RoadmapGoal.findByIdAndDelete(goalId);

        return res.json({
            success: true,
            message: 'Successfully deleted goal',
            redirect: '/'
        });
    } catch (error) {
        console.error('Error deleting goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next();
    }
}


export async function updateGoal(req, res, next) {
    if (req.skip) {
        return next();
    }
    try {
        const goalId = req.params.goalId;
        const updatedData = req.body;
        if(updatedData.description) {
            updatedData.description = updatedData.description.replace(/\n/g, '<br>'); //makes multiline description possible
        }

        const updatedGoal = await RoadmapGoal.findByIdAndUpdate(goalId, updatedData, { new: true }).populate('subGoals').populate('comments')
        if (!updatedGoal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        return res.json({
            success: true,
            message: 'Successfully updated goal',
            goal: updatedGoal,
            redirect: '/'
        });
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next();
    }
}


/**
 * Updates the order of goals for a user
 * - route: POST /goal/reorder
 * @param req - {body: { goalIDs }} - goalIDs is an array of goalIDs in the new order
 * @param res {success: true, message: 'Successfully updated goal order', redirect: '/'}
 * @param next
 */
export async function updateGoalOrder(req, res, next) {
    if (req.skip) {
        return next();
    }

    try {
        const { goalIDs } = req.body;
        await User.findOneAndUpdate({ _id: req.user._id }, { goalIDs: goalIDs });

        return res.json({
            success: true,
            message: 'Successfully updated goal order',
            redirect: '/',
        });
    } catch (error) {
        console.error('Error updating goal order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next();
    }
}

/**
 * Creates a new subgoal and attaches it to a parent goal
 * @param req - Express request object
 * @param res - Express response object
 */
export async function createSubGoal(req, res) {
    try {
        const { title, description, status, isSubGoal, parentGoalId } = req.body;

        // Create a new subgoal
        const newSubGoal = new RoadmapGoal(getGoalParams(req));
newSubGoal.description = newSubGoal.description.replace(/\n/g, '<br>');
        const savedSubgoal = await newSubGoal.save();

        // Optionally, update the parent goal to include this subgoal's ID
        await RoadmapGoal.findByIdAndUpdate(
            parentGoalId,
            { $push: { subGoals: savedSubgoal._id } },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: 'Subgoal successfully created',
            subgoal: savedSubgoal
        });
    } catch (error) {
        console.error('Error creating subgoal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

/**
 * Creates a new comment and attaches it to a goal
 * @param req - {body:{ userID, comment, visible, roadmapGoalID }}
 * @param res - {success: true, message: 'Comment successfully created', comment: savedComment}
 */
export async function addComment(req, res) {
    try {
        const {comment, isPrivate, goalID, userID } = req.body;

        // Create a new comment
        const newComment = new Comment({
            userID,
            comment,
            isPrivate,
            goalID,
        });
        const savedComment = await newComment.save();

        // update the goal to include this comment's ID
        await RoadmapGoal.findByIdAndUpdate(
            goalID,
            { $push: { comments: savedComment._id } },
            { new: true }
        );

        const goalWithComments = await RoadmapGoal.findById(goalID).populate('comments').populate('subGoals');

        res.status(201).json({
            success: true,
            message: 'Comment successfully created',
            goal: goalWithComments
        });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


/**
 * Deletes a comment and removes it from the goal
 * Route: POST /goal/deleteComment/:commentId
 * @param req
 * @param res
 */
export async function deleteComment(req, res) {
    try {
        const commentId = req.params.commentId;

        const deleteComment = await Comment.findById(commentId);
        if (!deleteComment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        //update the Goal to remove the commentID
        await RoadmapGoal.updateOne({ _id: deleteComment.goalID }, { $pull: { comments: deleteComment._id } });

        await Comment.findByIdAndDelete(commentId);

        return res.json({
            success: true,
            message: 'Successfully deleted comment',
            redirect: '/'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
