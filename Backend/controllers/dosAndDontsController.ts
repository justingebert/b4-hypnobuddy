import { Request, Response } from 'express';
import { DoAndDontModel, DoAndDont } from '../data/model/dosAndDontsModel';
import {FearModel} from "../data/model/fearModel";

/**
 * Retrieves all dos and don'ts from the database.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
export const getDosAndDonts = async (req: Request, res: Response): Promise<void> => {
  try {
    const dosAndDonts = await DoAndDontModel.find();
    res.json(dosAndDonts);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Retrieves a specific do or don't by its ID from the database.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
export const getDoOrDontById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const doAndDont = await DoAndDontModel.findById(id);
    if (!doAndDont) {
      res.status(404).json({ error: 'Do and Dont not found' });
      return;
    }

    res.json(doAndDont);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * Updates a specific do or don't by its ID in the database.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
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

/**
 * Deletes a specific fear and its associated dos and don'ts from the database.
 *
 * @function
 * @async
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>} A Promise that resolves once the operation is complete.
 */
export const deleteFearAndDosAndDonts = async (req: Request, res: Response): Promise<void> => {
  const { fearId } = req.params;

  try {
    const deletedFear = await FearModel.findByIdAndDelete(fearId);

    if (!deletedFear) {
      res.status(404).json({ error: 'Fear not found' });
      return;
    }

    await DoAndDontModel.deleteMany({ fearId });

    res.json({ message: 'Fear and associated Do and Dont entries deleted successfully' });
  } catch (error) {
    console.error('Error in deleteFearAndDosAndDonts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
