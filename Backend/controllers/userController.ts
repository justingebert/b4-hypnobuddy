import User from '../data/model/user';
import { FearModel } from '../data/model/fearModel';
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
    body('email')
        .normalizeEmail({ all_lowercase: true })
        .trim()
        .isEmail().withMessage('Email is invalid'),
    body('password')
        .notEmpty().withMessage('Password cannot be empty'),

    (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            let messages = errors.array().map(e => e.msg);
            req.skip = true;

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
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
        if (user) {
            const messages = `${user.email}'s account created successfully!`
            res.json({
                success: true,
                redirect: '/login',
                message: messages,
            });
        } else {
            console.log(error.message)
            const messages = error.message
            res.status(400).json({
                success: false,
                redirect: '/register',
                message: messages,
            });
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
        // // Assuming req.user holds the authenticated user information
        // res.json({
        //     isAuthenticated: true,
        //     user: req.user
        // });


        //for tests
        try {
            const user = await User.findById(req.user._id)
                .populate('patients')  // Populate 'patients' field if the user is a therapist
                .populate('patientLinkingCode')
                .populate('therapist'); // Populate 'therapist' field if the user is a patient

            res.json({
                isAuthenticated: true,
                user: user
            });
        } catch (error) {
            console.error("Error fetching user data:", error);
            res.status(500).json({ isAuthenticated: true, error: "Failed to fetch user data" });
        }


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
    const user = req.user;
    const verificationCode = await VerificationCode.findOne({ code: code, type: 'therapistVerification' });

    if (verificationCode && !verificationCode.used) {
        verificationCode.used = true;
        await verificationCode.save();

        const therapist = await User.findById(user._id);
        therapist.role = 'therapist';

        const patientCode = uuidv4();
        therapist.patientLinkingCode = patientCode;
        await therapist.save();
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

/**
 * link patient to therapist by code
 * @param req
 * @param res
 */
export async function linkPatientToTherapist(req, res) {
    const { patientCode } = req.body;
    const verificationCode = await VerificationCode.findOne({ code: patientCode });

    if (verificationCode &&
        verificationCode.type === 'patientLinking' &&
        verificationCode.uses < verificationCode.useLimit) {

        const patient = await User.findById(req.user._id);
        const therapist = await User.findById(verificationCode.therapistId);

        patient.therapist = therapist._id;
        await patient.save();

        therapist.patients.push(patient._id);
        await therapist.save();

        verificationCode.uses += 1;
        await verificationCode.save();

        res.json({ success: true, message: 'Linked to therapist successfully' });
    } else {
        if (verificationCode && verificationCode.uses >= verificationCode.useLimit) {
            res.status(400).json({ success: false, message: 'Code limit reached' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid code' });
        }
    }
}


/**
 * get patients of therapist
 * @param req
 * @param res
 */
export async function getPatients(req, res) {
    const therapist = await User.findById(req.user._id).populate('patients');
    res.json({ success: true, patients: therapist.patients });
}

export async function getAllPatients(req, res) {
    try {
        const patients = await User.find({ role: 'patient' });
        res.json(patients);
    } catch (error) {
        console.error('Error in getFears:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export async function getAllPatientsLinked(req, res) {
    try {
        const { fearId } = req.body;

        const fear = await FearModel.findById(fearId);

        if (!fear) {
            return res.status(404).json({ error: 'Fear not found' });
        }

        if (!fear.users || !Array.isArray(fear.users)) {
            return res.status(500).json({ error: 'Invalid data in Fear model' });
        }

        const patients = await User.find({ _id: { $in: fear.users }, role: 'patient' });

        res.json(patients);
    } catch (error) {
        console.error('Error in getAllPatients:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

}

export async function getTherapistOfPatient(req, res) {
    try {
        const patientId = req.user._id

        const therapist = await User.findOne(
            {
                role: 'therapist',
                patients: patientId,
            },
            { _id: 1, name: 1 }
        );

        res.json(therapist);
    } catch (error) {
    console.error('Error getting therapist data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
}

