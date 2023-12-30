import {Request, Response } from 'express';
import User from '../data/model/user';
import {FearModel, Fear} from "../data/model/fearModel";
import {DoAndDontModel} from "../data/model/dosAndDontsModel";

export const getFears = async (req: Request, res: Response): Promise<void> => {
    try {
        const therapistId = req.query.therapistId as string;
        if (!therapistId) {
            // If therapistId is not provided, return an error or handle it as per your requirement
            res.status(400).json({ error: 'Missing therapistId parameter' });
            return;
        }
        const fears = await FearModel.find({ therapistId });
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
        console.log(fear);
        res.json(fear);
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'});
    }
};

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
            // If a fear with the same name exists, create a new one with a unique identifier
            res.status(409).json({ error: 'Please enter a new fear title, this fear already exists' });
        } else {
            // If no fear with the same name exists, create a new fear
            const newFear = new FearModel({ name, therapistId });
            const savedFear = await newFear.save();
            res.json(savedFear);
        }
    } catch (error) {
        console.error('Error in saveFear:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const addDoAndDontToFear = async (req: Request, res: Response): Promise<void> => {
    const {fearId, type, text} = req.body;
    console.log(fearId, text);
    try {
        const newDoAndDont = new DoAndDontModel({type, text, fearId});
        const savedDoAndDont = await newDoAndDont.save();

        const fear = await FearModel.findById(fearId);
        if (!fear) {
            res.status(404).json({error: 'Fear not found'});
            return;
        }

        fear.dosAndDonts.push(savedDoAndDont._id);
        await fear.save();
        res.json(fear);
    } catch (error) {
        console.error('Error in addDoAndDontToFear:', error);
        res.status(500).json({error: 'Internal Server Error'});
    }
};

export const updateFearName = async (req: Request, res: Response): Promise<void> => {
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
