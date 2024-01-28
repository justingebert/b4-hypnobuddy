import request from 'supertest';
import {app, sessionStore} from '../../main';
import VerificationCode from "../../data/model/verificationCode";
import User from "../../data/model/user";
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";

const dosAndDontsRoute = '/dosAndDonts/fears';

//reused code in functions
async function registerTestUser(email, password, role = 'patient') {
  const newUser = new User({
      email: email,
      name: {first: 'John', last: 'Doe'},
      role: role
  });

  await User.register(newUser, password);
}

async function registerTestTherapist(email, password) {
  await registerTestUser(email, password, 'therapist');
}

async function createVerificationCode(therapistId, codeType) {
  const verificationCode = new VerificationCode({
      code: 'valid-verification-code',
      therapistId: therapistId,
      type: codeType,
      used: false
  });

  await verificationCode.save();
  return verificationCode;
}

async function loginUserAndGetCookie(email, password) {
    const loginResponse = await request(app)
        .post('/user/login')
        .send({ email: email, password: password });

    if (loginResponse.status !== 200) {
        throw new Error('Failed to log in user for test');
    }

    return loginResponse.headers['set-cookie'];

}

async function loginUserAndGetUser(email, password) {

  const userCookie = await loginUserAndGetCookie(email, password);

  const response = await request(app)
      .get('/user/currentUser')
      .set('Cookie', userCookie);

  if (response.status !== 200) {
      throw new Error('Failed to get logged in user for test');
  }

  return response.body.user;
}

async function cleanDatabase() {
  await User.deleteMany({});
  await VerificationCode.deleteMany({});
}


/**
 * Connect to a new mockup database before running any tests.
 */
let mongoServer;
beforeAll(async () => {
    await mongoose.disconnect();
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
});
/**
 * close the db connection after all tests
 */
afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongoServer.stop();
    await sessionStore.close();
});

/**
 * clear all mocks after each test
 * clear all timers after each test
 */
afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllTimers();
});

describe('saveFear', () => {
  let therapist,therapistCookie, verificationCode;
  
  const exampleLogin = {email: 'therapist@example.com', password: 'password123'};
  let userCookie;
  let user;


  beforeAll(async () => {
    await registerTestTherapist(exampleLogin.email, exampleLogin.password);
    therapist = await User.findOne({ email: exampleLogin.email });
    userCookie = await loginUserAndGetCookie(
      exampleLogin.email,
      exampleLogin.password
    );
    user = await loginUserAndGetUser(
      exampleLogin.email,
      exampleLogin.password
    );
    verificationCode = await createVerificationCode(
      therapist._id,
      "therapistVerification"
    );
  });

  afterAll(cleanDatabase);

  it('should save a new fear', async () => {
    const response = await request(app)
            .post(dosAndDontsRoute)
            .set('Cookie', userCookie)
            .send({name: 'New Fear'});

        expect(response.status).toBe(200);
  });
});
//TODO Rework
// describe('getFearById', () => {
//     it('should fetch a fear by its ID', async () => {
//       const req = mockRequest({ params: { fearId: 'fear123' } });
//       const res = mockResponse();
//       //FearModel.findById.mockResolvedValue({ /* mock fear data */ });
  
//       await getFearById(req as unknown as Request, res as unknown as Response);
  
//       expect(FearModel.findById).toHaveBeenCalledWith('fear123');
//       expect((res as any).json).toHaveBeenCalledWith({ /* expected fear data */ });
//     });
//   });

//   describe('addDoAndDontToFear', () => {
//     it('should add a DoAndDont to a fear', async () => {
//       const req = mockRequest({ body: { fearId: 'fear123', type: 'do', text: 'Do this' } });
//       const res = mockResponse();
//       //FearModel.findById.mockResolvedValue({ dosAndDonts: [], save: jest.fn() });
//       DoAndDontModel.prototype.save = jest.fn().mockResolvedValue({ _id: 'doAndDont123' });
  
//       await addDoAndDontToFear(req as unknown as Request, res as unknown as Response);
  
//       expect(DoAndDontModel.prototype.save).toHaveBeenCalled();
//       expect(FearModel.findById).toHaveBeenCalledWith('fear123');
//       expect((res as any).json).toHaveBeenCalled();
//     });
//   });

//   describe('updateFearName', () => {
//     it('should update a fear name', async () => {
//       const req = mockRequest({ params: { fearId: 'fearId123' }, body: { name: 'Updated Fear Name' } });
//       const res = mockResponse();
      
//       //FearModel.findByIdAndUpdate.mockResolvedValue({ _id: 'fearId123', name: 'Updated Fear Name' });
  
//       await updateFearName(req as unknown as Request, res as unknown as Response);
  
//       expect(FearModel.findByIdAndUpdate).toHaveBeenCalledWith(
//         { _id: 'fearId123' },
//         { name: 'Updated Fear Name' },
//         { new: true }
//       );
//       expect((res as any).json).toHaveBeenCalledWith({ _id: 'fearId123', name: 'Updated Fear Name' });
//     });
//   });
  