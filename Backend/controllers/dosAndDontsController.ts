import { Request, Response } from 'express';
import { DoAndDontModel, DoAndDont } from '../data/model/dosAndDontsModel';

export const getDosAndDonts = async (req: Request, res: Response): Promise<void> => {
  try {
    const dosAndDonts = await DoAndDontModel.find();
    res.json(dosAndDonts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const saveDoAndDont = async (req: Request, res: Response): Promise<void> => {
  const { type, text } = req.body;
  try {
    const newDoAndDont = new DoAndDontModel({ type, text });
    const savedDoAndDont = await newDoAndDont.save();
    res.json(savedDoAndDont);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
