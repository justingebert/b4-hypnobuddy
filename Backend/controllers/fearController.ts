import {Request, Response } from 'express';
import {FearModel, Fear} from "../data/model/fearModel";

export const getFears = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Inside getFears controller');
        const fears = await FearModel.find();
        console.log(fears);
        res.json(fears);
    } catch (error) {
        console.error('Error in getFears:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

export const getFearById = async (req: Request, res: Response): Promise<void> => {
    const {fearId} = req.params;
    try {
        const fear = await FearModel.findById(fearId).populate('dosAndDonts');
        res.json(fear);
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};
export const saveFear = async (req: Request, res:Response): Promise<void> => {
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
export const addDoAndDontToFear = async (req: Request, res: Response): Promise<void> => {
    const {fearId, doAndDontId} = req.body;
    try {
        const fear = await FearModel.findById(fearId);
        if (!fear) {
            res.status(404).json({error: 'Fear not found'});
            return;
        }

        fear.dosAndDonts.push(doAndDontId);
        await fear.save();
        res.json(fear);
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};