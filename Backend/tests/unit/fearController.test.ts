// Importing dependencies
import { Request, Response } from 'express';
import { FearModel } from '../../data/model/fearModel';
import { DoAndDontModel } from '../../data/model/dosAndDontsModel';
import { 
        getFears, 
        getFearById, 
        saveFear, 
        addDoAndDontToFear, 
        updateFearName } from '../path/to/your/controller';

// Mocking FearModel and DoAndDontModel methods
jest.mock('../data/model/fearModel', () => ({
  FearModel: {
    find: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

jest.mock('../data/model/dosAndDontsModel', () => ({
  DoAndDontModel: {
    save: jest.fn(),
  },
}));

// Helper functions to create mock Request and Response objects
const mockRequest = (data) => ({
  ...data,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('getFearById', () => {
    it('should fetch a fear by its ID', async () => {
      const req = mockRequest({ params: { fearId: 'fear123' } });
      const res = mockResponse();
      FearModel.findById.mockResolvedValue({ /* mock fear data */ });
  
      await getFearById(req as unknown as Request, res as unknown as Response);
  
      expect(FearModel.findById).toHaveBeenCalledWith('fear123');
      expect(res.json).toHaveBeenCalledWith({ /* expected fear data */ });
    });
  
    // Add tests for cases like fear not found, or internal server errors
  });

  describe('saveFear', () => {
    it('should save a new fear', async () => {
      const req = mockRequest({ body: { name: 'New Fear' }, user: { _id: 'user123' } });
      const res = mockResponse();
      FearModel.findOne.mockResolvedValue(null);
      FearModel.prototype.save = jest.fn().mockResolvedValue({ /* saved fear data */ });
  
      await saveFear(req as unknown as Request, res as unknown as Response);
  
      expect(FearModel.prototype.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ /* expected saved fear data */ });
    });
  
    // Add tests for cases like fear already exists, unauthorized user, etc.
  });

  describe('addDoAndDontToFear', () => {
    it('should add a DoAndDont to a fear', async () => {
      const req = mockRequest({ body: { fearId: 'fear123', type: 'do', text: 'Do this' } });
      const res = mockResponse();
      FearModel.findById.mockResolvedValue({ dosAndDonts: [], save: jest.fn() });
      DoAndDontModel.prototype.save = jest.fn().mockResolvedValue({ _id: 'doAndDont123' });
  
      await addDoAndDontToFear(req as unknown as Request, res as unknown as Response);
  
      expect(DoAndDontModel.prototype.save).toHaveBeenCalled();
      expect(FearModel.findById).toHaveBeenCalledWith('fear123');
      expect(res.json).toHaveBeenCalled();
    });
  
    // Add tests for cases like fear not found, or internal server errors
  });

  describe('updateFearName', () => {
    it('should update a fear name', async () => {
      const req = mockRequest({ params: { fearId: 'fearId123' }, body: { name: 'Updated Fear Name' } });
      const res = mockResponse();
      
      FearModel.findByIdAndUpdate.mockResolvedValue({ _id: 'fearId123', name: 'Updated Fear Name' });
  
      await updateFearName(req as unknown as Request, res as unknown as Response);
  
      expect(FearModel.findByIdAndUpdate).toHaveBeenCalledWith(
        { _id: 'fearId123' },
        { name: 'Updated Fear Name' },
        { new: true }
      );
      expect(res.json).toHaveBeenCalledWith({ _id: 'fearId123', name: 'Updated Fear Name' });
    });
  
    // Add tests for cases like fear not found, or internal server errors
  });
  