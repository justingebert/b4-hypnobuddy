import RoadmapGoal from '../data/model/roadmapGoal';

import { body, validationResult } from 'express-validator';
import { isValid, parseISO } from 'date-fns';

/**
 * Extracts the goal parameters from the request body
 * @param body - request body containing { userID, title, description, status, dueDate, isSubGoal, parentGoalId, subGoals }
 */
export const getGoalParams = body => {
    console.log('body:', body);
    return {
        userID: body.userID,
        title: body.title,
        description: body.description,
        status: body.status,
        dueDate: body.dueDate,
        isSubGoal: body.isSubGoal,
        parentGoalId: body.parentGoalId,
        subGoals: body.subGoals
    };
}

/**
 * Validates the request body
 */
export const validate = [
    // Validation and sanitization middlewares
    body('userID')
        //TODO: check if id actually exists in the database + write tests
        .custom((value) => {
            console.log('Value before validation:', value);
            if (!/^[a-fA-F0-9]{24}$/.test(value)) {
                throw new Error('Invalid MongoDB ID');
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
 * @param req {body: { userID, title, description, status, dueDate, isSubGoal, parentGoalId, subGoals }}
 * @param res {success: true, message: 'Successful Login', goal: savedRoadmapGoal, redirect: '/'}
 * @param next
 */
export async function createGoal (req, res, next) {
    if (req.skip) {
        return next();
    }
    try {
        console.log(req.body)

        const newRoadmapGoal = new RoadmapGoal(getGoalParams(req.body));
        const savedRoadmapGoal = await newRoadmapGoal.save();
        return res.json({
            success: true,
            message: 'Successfully created goal',
            goal: savedRoadmapGoal,
            redirect: '/',
        });
        next();
    }catch (error){
        console.error('Error creating roadmap goal:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        next();
    }
}
