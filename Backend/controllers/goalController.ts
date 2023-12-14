import RoadmapGoal from '../data/model/roadmapGoal';
import User from '../data/model/user';

import { body, validationResult } from 'express-validator';
import { isValid, parseISO } from 'date-fns';

/**
 * Extracts the goal parameters from the request body
 * @param request - request body containing { userID, title, description, status, dueDate, isSubGoal, parentGoalId, subGoals }
 */
export const getGoalParams = request => {
    //TODO redo when frontend form is set up
    /*return {
        userID: request.user._id,
        title: body.title,
        description: body.description,
        status: body.status,
        dueDate: body.dueDate,
        isSubGoal: body.isSubGoal,
        parentGoalId: body.parentGoalId,
        subGoals: body.subGoals
    };*/

    return {
        userID: request.user._id,
        title: request.body.title,
        description: request.body.description,
        status: request.body.status,
        dueDate: request.body.dueDate,
        isSubGoal: false,
        parentGoalId: null,
        subGoals: []
    }
}

/**
 * Validates the request body
 */
export const validate = [
    // Validation and sanitization middlewares
    body('userID').custom(async (value) => {
        //check if the id is a valid MongoDB ID
        if (!/^[a-fA-F0-9]{24}$/.test(value)) {
            throw new Error('Invalid MongoDB ID');
        }

        //check if the user with the given ID exists
        const userExists = await User.exists({ _id: value });

        if (!userExists) {
            throw new Error('User not found');
        }

        return true;
    }),
    body('title')
        .trim()
        .notEmpty().withMessage('Title cannot be empty'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description cannot be empty'),
    body('status')
        .notEmpty().withMessage('Status cannot be empty')
        .isIn(['not_started', 'in_progress', 'completed']).withMessage('Status must be one of: Not Started, In Progress, Completed'),
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
    body('subGoals')
        .isArray().withMessage('subGoals must be an array'),

    // Middleware to handle the validation result
    (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Map the errors to extract messages
            let messages = errors.array().map(e => e.msg);
            console.log("!Validation Error!");
            console.log(messages);
            console.log(errors);

            req.skip = true; // to avoid rewriting the response
            res.status(400).json({
                success: false,
                redirect: '/',
                message: messages.join(' and ')
            });
        }
        next();
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
        const savedRoadmapGoal = await newRoadmapGoal.save();
        await User.findOneAndUpdate({ _id: savedRoadmapGoal.userID }, { $push: { goalIDs: savedRoadmapGoal._id } });
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
 * @param req {body: { userID }}
 * @param res {success: true, message: 'Successfully retrieved goals', goals: goals, redirect: '/'}
 * @param next
 */
export async function getAllGoals(req, res, next) {
    if (req.skip) {
        return next();
    }
    try {
        const goals = await RoadmapGoal.find({ userID: req.user._id });
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
 * - route: GET /goal/get/:goalId
 * @param req
 * @param res {success: true, message: 'Successfully retrieved goal', goal: goal, redirect: '/'}
 * @param next
 */
export async function getGoal(req, res, next) {
    if (req.skip) {
        return next();
    }
    try {
        const goal = await RoadmapGoal.findById(req.params.goalId);
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

        const deletedGoal = await RoadmapGoal.findByIdAndDelete(goalId);
        if (!deletedGoal) {
            return res.status(404).json({ error: 'Goal not found' });
        }

        //update the User to remove the goalID
        await User.updateOne({ _id: deletedGoal.userID }, { $pull: { goalIDs: deletedGoal._id } });

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

        const updatedGoal = await RoadmapGoal.findByIdAndUpdate(goalId, updatedData, { new: true });
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
 * @param req {body: { goalIDs }}
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