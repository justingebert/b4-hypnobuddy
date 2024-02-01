import { Request as ExpressRequest, Response } from 'express';
import mongoose from 'mongoose';
import Reflexion from '../data/model/reflexion';

interface RequestWithUser extends ExpressRequest {
  user?: {
      _id: mongoose.Types.ObjectId;
  };
}

export const createReflexion = async (req: RequestWithUser, res: Response) => {
  if (!req.user?._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
  }
  const { mood, description, deepDiveQuestion, deepDiveAnswer } = req.body;
  const newReflexion = new Reflexion({ 
      user: req.user._id, 
      mood, 
      description, 
      deepDiveQuestion, 
      deepDiveAnswer 
  });
  try {
      await newReflexion.save();
      res.json(newReflexion);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getReflexions = async (req: RequestWithUser, res: Response) => {
  if (!req.user?._id) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
  }
  try {
      const reflexions = await Reflexion.find({ user: req.user._id }).sort({ date: -1 });
      res.json(reflexions);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


export const getReflexionById = async (req: RequestWithUser, res: Response) => {
  try {
    const reflexion = await Reflexion.findOne({ _id: req.params.id, user: req.user?._id });
    if (!reflexion) {
      return res.status(404).json({ message: 'Reflexion not found or not authorized to access' });
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

export const deleteReflexion = async (req: RequestWithUser, res: Response) => {
  try {
    const reflexion = await Reflexion.findOneAndDelete({ _id: req.params.id, user: req.user?._id });
    if (!reflexion) {
      return res.status(404).json({ message: 'Reflexion not found or not authorized to delete' });
    }
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const updateReflexion = async (req: RequestWithUser, res: Response) => {
  try {
    const updatedReflexion = await Reflexion.findOneAndUpdate(
      { _id: req.params.id, user: req.user?._id }, 
      req.body, 
      { new: true }
    );
    if (!updatedReflexion) {
      return res.status(404).json({ message: 'Reflexion not found or not authorized to update' });
    }
    res.json(updatedReflexion);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
