import { Request, Response } from 'express';
import {
  getDosAndDonts,
  getDoOrDontById,
  updateDoAndDont,
  deleteFearAndDosAndDonts,
} from '../../controllers/dosAndDontsController';
import { DoAndDontModel } from '../../data/model/dosAndDontsModel';
import { FearModel } from '../../data/model/fearModel';

jest.mock('../../data/model/dosAndDontsModel');
jest.mock('../../data/model/fearModel');

/*describe('dosAndDontsController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  describe('getDosAndDonts', () => {
    it('should retrieve all dos and don\'ts from the database', async () => {
      const mockedDosAndDonts = [{ id: '1', text: 'Do something' }];
      (DoAndDontModel.find as jest.Mock).mockResolvedValueOnce(mockedDosAndDonts);

      await getDosAndDonts(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockedDosAndDonts);
    });

    it('should handle errors and return a 500 status', async () => {
      (DoAndDontModel.find as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

      await getDosAndDonts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('getDoOrDontById', () => {
    it('should retrieve a specific do or don\'t by its ID from the database', async () => {
      const mockedDoAndDont = { id: '1', text: 'Do something' };
      (DoAndDontModel.findById as jest.Mock).mockResolvedValueOnce(mockedDoAndDont);
      req.params = { id: '1' };

      await getDoOrDontById(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockedDoAndDont);
    });

    it('should handle not found case and return a 404 status', async () => {
      (DoAndDontModel.findById as jest.Mock).mockResolvedValueOnce(null);
      req.params = { id: '1' };

      await getDoOrDontById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Do and Dont not found' });
    });

    it('should handle errors and return a 500 status', async () => {
      (DoAndDontModel.findById as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      req.params = { id: '1' };

      await getDoOrDontById(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('updateDoAndDont', () => {
    it('should update a specific do or don\'t by its ID in the database', async () => {
      const mockedUpdatedDoAndDont = { id: '1', text: 'Updated text' };
      (DoAndDontModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(
        mockedUpdatedDoAndDont
      );
      req.params = { id: '1' };
      req.body = { text: 'Updated text' };

      await updateDoAndDont(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(mockedUpdatedDoAndDont);
    });

    it('should handle not found case and return a 404 status', async () => {
      (DoAndDontModel.findByIdAndUpdate as jest.Mock).mockResolvedValueOnce(null);
      req.params = { id: '1' };
      req.body = { text: 'Updated text' };

      await updateDoAndDont(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'DoAndDont not found' });
    });

    it('should handle errors and return a 500 status', async () => {
      (DoAndDontModel.findByIdAndUpdate as jest.Mock).mockRejectedValueOnce(
        new Error('Database error')
      );
      req.params = { id: '1' };
      req.body = { text: 'Updated text' };

      await updateDoAndDont(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });

  describe('deleteFearAndDosAndDonts', () => {
    it('should delete a specific fear and its associated dos and don\'ts from the database', async () => {
      const mockedFear = { id: '1' };
      (FearModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockedFear);
      (DoAndDontModel.deleteMany as jest.Mock).mockResolvedValueOnce(undefined);
      req.params = { fearId: '1' };

      await deleteFearAndDosAndDonts(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Fear and associated Do and Dont entries deleted successfully',
      });
    });

    it('should handle not found case for fear and return a 404 status', async () => {
      (FearModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);
      req.params = { fearId: '1' };

      await deleteFearAndDosAndDonts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Fear not found' });
    });

    it('should handle errors and return a 500 status', async () => {
      (FearModel.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      req.params = { fearId: '1' };

      await deleteFearAndDosAndDonts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });

    it('should handle errors in deleteMany and return a 500 status', async () => {
      const mockedFear = { id: '1' };
      (FearModel.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockedFear);
      (DoAndDontModel.deleteMany as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      req.params = { fearId: '1' };

      await deleteFearAndDosAndDonts(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
    });
  });
});*/
