import { Request, Response } from 'express';
import Reflexion from '../data/model/reflexion';

export const createReflexion = async (req: Request, res: Response) => {
  const { mood, description, deepDiveQuestion, deepDiveAnswer } = req.body;
  const newReflexion = new Reflexion({ mood, description, deepDiveQuestion, deepDiveAnswer, date: new Date() });
  await newReflexion.save();
  res.json(newReflexion);
};

export const getReflexions = async (req: Request, res: Response) => {
  const reflexions = await Reflexion.find().sort({ date: -1 });
  res.json(reflexions);
};

export const getReflexionById = async (req: Request, res: Response) => {
  try {
    const reflexion = await Reflexion.findById(req.params.id);
    if (!reflexion) {
      return res.status(404).json({ message: 'Reflexion not found' });
    }
    res.json(reflexion);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
export const deleteReflexion = async (req: Request, res: Response) => {
  await Reflexion.findByIdAndDelete(req.params.id);
  res.status(204).send();
};

export const updateReflexion = async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedReflexion = await Reflexion.findByIdAndUpdate(id, updateData, { new: true });
  res.json(updatedReflexion);
};
