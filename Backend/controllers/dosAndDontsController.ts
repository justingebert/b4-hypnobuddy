import { Request, Response } from 'express';
import { DoAndDontModel, DoAndDont } from '../data/model/dosAndDontsModel';
import {FearModel} from "../data/model/fearModel";

/**
 * Retrieves a list of all Dos and Donts from the database.
 * 
 * @async
 * @function getDosAndDonts
 * @param {Request} req - The express request object.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
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
 * Retrieves a specific Do or Dont by its ID.
 * 
 * @async
 * @function getDoOrDontById
 * @param {Request} req - The express request object, containing the ID in req.params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
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
 * Updates a specific DoAndDont entry in the database using its ID.
 * 
 * @async
 * @function updateDoAndDont
 * @param {Request} req - The express request object, containing the ID in req.params and update information in req.body.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the update is complete.
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
 * Deletes a Fear entry and its associated Dos and Donts from the database using the Fear ID.
 * 
 * @async
 * @function deleteFearAndDosAndDonts
 * @param {Request} req - The express request object, containing the Fear ID in req.params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
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

/**
 * Retrieves Dos and Donts associated with a specific user.
 * 
 * @async
 * @function getDosAndDontsForUser
 * @param {Request} req - The express request object, containing the User ID in req.params.
 * @param {Response} res - The express response object.
 * @returns {Promise<void>} - A promise that resolves when the retrieval is complete.
 */
export const getDosAndDontsForUser = async (req, res): Promise<void> => {
  const { userId } = req.params;
  try {
    const fears = await FearModel.find({ users: userId }).populate('dosAndDonts');
    const dosAndDonts = fears.flatMap(fear => fear.dosAndDonts);
    res.json({ dosAndDonts });
  } catch (error) {
    console.error('Error in getDosAndDontsForUser:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};