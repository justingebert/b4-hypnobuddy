import User from '../data/model/user';
import passport from 'passport';

import { body, validationResult } from 'express-validator';

/**
 * Get user params from request body
 * @param body
 * @returns {Object} - object with user params
 * @type
 */
const getUserParams = body => {
    return {
        name: {
            first: body.first,
            last: body.last
        },
        email: body.email,
        password: body.password
    };
}

/**
 * validate user input
 */
export const validate = [
    // Validation and sanitization middlewares
    body('email')
        .normalizeEmail({ all_lowercase: true })
        .trim()
        .isEmail().withMessage('Email is invalid'),
    body('password')
        .notEmpty().withMessage('Password cannot be empty'),

    // Middleware to handle the validation result
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Map the errors to extract messages
            let messages = errors.array().map(e => e.msg);

            req.skip = true; // Skip the next middleware do i need that?

            res.json({
                success: false,
                redirect: '/login',
                message: req.flash('error', messages.join(' and ')),
            });
            next();
        } else {
            next();
        }
    }
];

/**
 * Authenticate user
 * @param req - request object
 * @param res - response object
 * @param next - next middleware
 *
 */
export const authenticate = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: info.message, redirect: '/login' });
        }
        req.logIn(user, function(err) {
            if (err) return next(err);

            return res.json({
                success: true,
                message: 'Successful Login',
                user: user.data,
                redirect: '/',
            });
        });
    })(req, res, next);
};

/**
 * create user if not existing
 * @param req
 * @param res
 * @param next
 *
 */
export async function create(req, res, next) {
    console.log(req.body)
    if (req.skip) {
        next();
    }
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
        if (user) {
            const messages = `${user.email}'s account created successfully!`
            res.json({
                success: true,
                redirect: '/login',
                message: messages,
            });
            next();
        } else {
            console.log(error.message)
            const messages = "Failed to create user account because: ${error.message}"
            res.status(400).json({
                success: false,
                redirect: '/register',
                message: messages,
            });
            next();
        }
    });
}

/**
 * logout user by calling req.logout() in passport
 * @param req
 * @param res
 * @param next
 */
export async function logout(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.json({
            success: true,
            redirect: '/',
            message: 'You have been logged out!',
        });

    });
}

/**
 * get current user if authenticated
 * @param req
 * @param res
 * @param next
 */
export async function currentUser(req, res, next){
    if (req.isAuthenticated()) {
        // Assuming req.user holds the authenticated user information
        res.json({
            isAuthenticated: true,
            user: req.user
        });
    } else {
        res.json({ isAuthenticated: false });
    }

}

