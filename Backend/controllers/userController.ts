import User from '../data/model/user';
import passport from 'passport';

import { body, validationResult } from 'express-validator';
import VerificationCode from "../data/model/verificationCode";
import { v4 as uuidv4 } from 'uuid';

/**
 * Get user params from request body
 * @param body
 * @returns {Object} - object with user params
 * @type
 */
export const getUserParams = body => {
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

            res.status(400).json({
                success: false,
                redirect: '/login',
                message: messages.join(' and ')
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
        req.logIn(user, function (err) {
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
 * checks authentication -> use to restrict actions that need a currently authenticated user
 * @param req
 * @param res
 * @param next
 * TODO please login message
 */
export function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('User not authenticated');
}


/**
 * create user if not existing
 * @param req
 * @param res
 * @param next
 *
 */
export async function create(req, res, next) {
    if (req.skip) {
        return next();
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
    req.logout(function (err) {
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
export async function currentUser(req, res, next) {
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

//! ROLE MANAGEMENT

/**
 * verify therapist by code, mark code as used, update therapist role, generate new patient linking code
 * @param req
 * @param res
 */
export async function verifyTherapist(req, res) {
    const { code } = req.body;
    const verificationCode = await VerificationCode.findOne({ code: code, type: 'therapistVerification' });

    if (verificationCode && !verificationCode.used) {
        // Mark the therapist verification code as used
        verificationCode.used = true;
        await verificationCode.save();

        // Update the therapist's role
        const therapist = await User.findById(verificationCode.therapistId);
        therapist.role = 'therapist';
        await therapist.save();

        // Generate a new patient linking code for the therapist
        const patientCode = uuidv4();
        const patientVerification = new VerificationCode({
            code: patientCode,
            therapistId: therapist._id,
            type: 'patientLinking',
            used: false,
            useLimit: 10
        });
        await patientVerification.save();

        res.json({
            success: true,
            message: 'Therapist verified successfully',
            patientCode: patientCode
        });
    } else {
        res.status(400).json({ success: false, message: 'Invalid or used verification code' });
    }
}

export async function linkPatientToTherapist(req, res) {
    const { patientCode } = req.body;
    const verificationCode = await VerificationCode.findOne({ code: patientCode });

    if (verificationCode &&
        verificationCode.type === 'patientLinking' &&
        verificationCode.uses < verificationCode.useLimit) {

        const patient = await User.findById(req.user._id);
        patient.therapist = verificationCode.therapistId;
        await patient.save();

        verificationCode.uses += 1;
        await verificationCode.save();

        res.json({ success: true, message: 'Linked to therapist successfully' });
    } else {
        if (verificationCode && verificationCode.uses > verificationCode.useLimit){
            res.status(400).json({ success: false, message: 'Code limit reached' });
        }else{
            res.status(400).json({ success: false, message: 'Invalid code' });

        }
    }
}
