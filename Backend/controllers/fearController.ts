import { Request as ExpressRequest, Response } from 'express';
import mongoose from 'mongoose';
import { FearModel, Fear } from "../data/model/fearModel";
import { DoAndDontModel } from "../data/model/dosAndDontsModel";
import User from '../data/model/user';

interface RequestWithUser extends ExpressRequest {
    user?: {
        _id: mongoose.Types.ObjectId;
    };
}

/**
 * Retrieves a list of fears associated with a given therapist.
 * 
 * @async
 * @function getFears
 * @param {RequestWithUser} req - The express request object, containing therapist ID in query parameters.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getFears = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const therapistId = req.query.therapistId as string;
        if (!therapistId) {
            res.status(400).json({ error: 'Missing therapistId parameter' });
            return;
        }
        const fears = await FearModel.find({ therapistId });
        res.json(fears);
    } catch (error) {
        console.error('Error in getFears:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Retrieves a specific fear by its ID, along with its associated Dos and Donts.
 * 
 * @async
 * @function getFearById
 * @param {RequestWithUser} req - The express request object, containing fear ID in req.params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const getFearById = async (req: RequestWithUser, res: Response): Promise<void> => {
    const { fearId } = req.params;
    try {
        const fear = await FearModel.findById(fearId).populate("dosAndDonts").select('-__v');
        if (!fear) {
            res.status(404).json({ error: 'Fear not found' });
            return;
        }

        const userIds = fear.users.map(userId => new mongoose.Types.ObjectId(userId));
        const users = await User.find({ _id: { $in: userIds } });

        const result: Fear & { users: any[] } = {
            ...fear.toObject(),
            users,
        };
        res.json(result);
    } catch (error) {
        console.error('Error fetching fear:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Creates and saves a new fear in the database.
 * 
 * @async
 * @function saveFear
 * @param {Request} req - The express request object, containing fear name in req.body.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const saveFear = async (req, res): Promise<void> => {
    const { name } = req.body;
    const therapistId = req.user ? req.user._id : null;
    try {
        if(!therapistId) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }
        const existingFear = await FearModel.findOne({ name, therapistId });

        if (existingFear) {
            res.status(409).json({ error: 'Please enter a new fear title, this fear already exists' });
        } else {
            const newFear = new FearModel({ name, therapistId });
            const savedFear = await newFear.save();
            res.json(savedFear);
        }
    } catch (error) {
        console.error('Error in saveFear:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Adds a new Do and Dont entry to a specific fear.
 * 
 * @async
 * @function addDoAndDontToFear
 * @param {RequestWithUser} req - The express request object, containing fear ID and Do and Dont details in req.body.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const addDoAndDontToFear = async (req: RequestWithUser, res: Response): Promise<void> => {
    const { fearId, type, text } = req.body;
    console.log(fearId, text);
    try {
        const newDoAndDont = new DoAndDontModel({ type, text, fearId });
        const savedDoAndDont = await newDoAndDont.save();

        const fear = await FearModel.findById(fearId);
        if (!fear) {
            res.status(404).json({ error: 'Fear not found' });
            return;
        }

        fear.dosAndDonts.push(savedDoAndDont._id);
        await fear.save();
        res.json(fear);
    } catch (error) {
        console.error('Error in addDoAndDontToFear:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Updates the name of a specific fear.
 * 
 * @async
 * @function updateFearName
 * @param {RequestWithUser} req - The express request object, containing fear ID in req.params and new name in req.body.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const updateFearName = async (req: RequestWithUser, res: Response): Promise<void> => {
    const { fearId } = req.params;
    const { name } = req.body;
    console.log(fearId, name);

    try {
        const updatedFear = await FearModel.findByIdAndUpdate(
            { _id: fearId },
            { name },
            { new: true } // Return the updated document
        );
        console.log(updatedFear);

        if (!updatedFear) {
            res.status(404).json({ error: 'Fear not found' });
            return;
        }
        res.json(updatedFear);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Adds a user to a specific fear.
 * 
 * @async
 * @function addUserToFear
 * @param {RequestWithUser} req - The express request object, containing fear ID and user ID in req.body.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const addUserToFear = async (req: RequestWithUser, res: Response): Promise<void> => {
    const { fearId,userId, type, text } = req.body;
    console.log(fearId, userId);
    try {
        const user = await User.findById(userId);
        console.log(user);

        const fear = await FearModel.findById(fearId);
        console.log(fear);

        if (!fear) {
            res.status(404).json({ error: 'Fear not found' });
            return;
        }

        fear.users.push(user._id);
        await fear.save();
        res.json(fear);
    } catch (error) {
        console.error('Error in addUserToFear:', error);

        res.status(500).json({ error: 'Internal Server Error' });
    }
};

/**
 * Removes a user from a specific fear.
 * 
 * @async
 * @function deleteUserToFear
 * @param {RequestWithUser} req - The express request object, containing fear ID and user ID in req.body.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the operation is complete.
 */
export const deleteUserToFear = async (req: RequestWithUser, res: Response): Promise<void> => {
    const { fearId,userId, type, text } = req.body;
    console.log(fearId, userId);
    try {
        const user = await User.findById(userId);
        console.log(user);

        const fear = await FearModel.findById(fearId);
        console.log(fear);

        if (!fear) {
            res.status(404).json({ error: 'Fear not found' });
            return;
        }

        fear.users.pull(user?._id);
        await fear.save();
        res.json(fear);
    } catch (error) {
        console.error('Error in addUserToFear:', error);

        res.status(500).json({ error: 'Internal Server Error' });
    }
};