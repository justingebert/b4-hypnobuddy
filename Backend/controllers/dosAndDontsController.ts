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
    const newDoAndDont = new DoAndDontModel({ type, text, fearId });
    const savedDoAndDont = await newDoAndDont.save();

    const fear = await FearModel.findById(fearId);
    if (fear) {
      fear.dosAndDonts.push(savedDoAndDont._id);
      await fear.save();
    }
    res.json(savedDoAndDont);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateDoAndDont = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    const updatedDoAndDont = await DoAndDontModel.findByIdAndUpdate(
      id,
      { text },
      { new: true } // Return the updated document
    );

    if (!updatedDoAndDont) {
      res.status(404).json({ error: 'DoAndDont not found' });
      return;
    }

    res.json(updatedDoAndDont);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
