import {Request, Response } from 'express';
import {FearModel, Fear} from "../data/model/fearModel";
import {DoAndDontModel} from "../data/model/dosAndDontsModel";

export const getFears = async (req: Request, res: Response): Promise<void> => {
    try {
        const fears = await FearModel.find();
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
