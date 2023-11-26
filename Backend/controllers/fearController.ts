import {Request, Response } from 'express';
import {FearModel, Fear} from "../data/model/fearModel";

export const getFears = async (req: Request, res: Response): Promise<void> => {
    try {
        const fears = await FearModel.find().populate('dosAndDonts');+
            res.json(fears);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

export const saveFear = async (req: Request, res:Response): Promise<void> => {
    const { name } = req.body;
    try {
        const newFear = new FearModel({name, dosAndDonts: [] });
        const savedFear = await newFear.save();
        res.json(savedFear);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};