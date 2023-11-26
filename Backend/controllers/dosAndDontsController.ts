import { Request, Response } from 'express';
import { DoAndDontModel, DoAndDont } from '../data/model/dosAndDontsModel';
import {FearModel} from "../data/model/fearModel";

export const getDosAndDonts = async (req: Request, res: Response): Promise<void> => {
  try {
    const dosAndDonts = await DoAndDontModel.find();
    res.json(dosAndDonts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const saveDoAndDont = async (req: Request, res: Response): Promise<void> => {
  const { type, text, fearId } = req.body;
  try {
    const newDoAndDont = new DoAndDontModel({ type, text });
    const savedDoAndDont = await newDoAndDont.save();
    // Associate the new DoAndDont with the specified Fear
    await FearModel.findByIdAndUpdate(fearId, {$push: { dosAndDonts: savedDoAndDont._id } });
    res.json(savedDoAndDont);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
