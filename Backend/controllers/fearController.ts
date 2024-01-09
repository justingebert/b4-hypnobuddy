import {Request, Response } from 'express';
import User from '../data/model/user';
import {FearModel, Fear} from "../data/model/fearModel";
import {DoAndDontModel} from "../data/model/dosAndDontsModel";

/**
 * Retrieves a list of fears associated with a given therapist.
 * 
 * @param {Request} req - The Express request object, expecting a therapistId in the query.
 * @param {Response} res - The Express response object used to return the fetched data or an error message.
 * @returns {Promise<void>} - A promise resolving to void.
 */
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

/**
 * Retrieves a specific fear by its ID.
 * 
 * @param {Request} req - The Express request object, expecting a fearId in the parameters.
 * @param {Response} res - The Express response object used to return the fetched fear or an error message.
 * @returns {Promise<void>} - A promise resolving to void.
 */
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

/**
 * Saves a new fear to the database.
 * 
 * @param {Request} req - The Express request object, containing the name of the fear in the body and the therapist's ID in the user session.
 * @param {Response} res - The Express response object used to return the saved fear or an error message.
 * @returns {Promise<void>} - A promise resolving to void.
 */
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

/**
 * Adds a 'Do and Don't' entry to a specific fear.
 * 
 * @param {Request} req - The Express request object, containing the fearId, type, and text of the 'Do and Don't' in the body.
 * @param {Response} res - The Express response object used to return the updated fear or an error message.
 * @returns {Promise<void>} - A promise resolving to void.
 */
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

/**
 * Updates the name of an existing fear.
 * 
 * @param {Request} req - The Express request object, containing the new name of the fear in the body and the fearId in the parameters.
 * @param {Response} res - The Express response object used to return the updated fear or an error message.
 * @returns {Promise<void>} - A promise resolving to void.
 */
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
