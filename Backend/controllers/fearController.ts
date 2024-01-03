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

export const getFears = async (req: RequestWithUser, res: Response): Promise<void> => {
    try {
        const fears = await FearModel.find();
        res.json(fears);
    } catch (error) {
        console.error('Error in getFears:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getFearById = async (req: RequestWithUser, res: Response): Promise<void> => {
    const { fearId } = req.params;
    console.log(fearId);

    try {
        // Fetch fear data without populating 'dosAndDonts' and 'users'
        const fear = await FearModel.findById(fearId).populate("dosAndDonts").select('dosAndDonts users');
        if (!fear) {
            res.status(404).json({ error: 'Fear not found' });
            return;
        }

        // Fetch user data based on the user IDs stored in the fear model
        const userIds = fear.users.map(userId => new mongoose.Types.ObjectId(userId));
        const users = await User.find({ _id: { $in: userIds } });

        // Combine fear data with user data
        const result: Fear & { users: any[] } = {
            ...fear.toObject(),
            users,
        };

        console.log(result);
        res.json(result);
    } catch (error) {
        console.error('Error fetching fear:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const saveFear = async (req: RequestWithUser, res: Response): Promise<void> => {
    const { name } = req.body;
    try {
        const newFear = new FearModel({ name });
        const savedFear = await newFear.save();
        console.log(savedFear);
        res.json(savedFear);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

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
