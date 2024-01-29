import request from 'supertest';
import {app} from '../../main';
import User from "../../data/model/user";
import VerificationCode from "../../data/model/verificationCode";

//reused code in functions
export async function registerTestUser(email, password, role = 'patient') {
    const newUser = new User({
        email: email,
        name: {first: 'John', last: 'Doe'},
        role: role
    });
  
    await User.register(newUser, password);
  }
  
export async function registerTestTherapist(email, password) {
    await registerTestUser(email, password, 'therapist');
  }
  
export async function createVerificationCode(therapistId, codeType) {
    const verificationCode = new VerificationCode({
        code: 'valid-verification-code',
        therapistId: therapistId,
        type: codeType,
        used: false
    });
  
    await verificationCode.save();
    return verificationCode;
  }
  
export async function loginUserAndGetCookie(email, password) {
      const loginResponse = await request(app)
          .post('/user/login')
          .send({ email: email, password: password });
  
      if (loginResponse.status !== 200) {
          throw new Error('Failed to log in user for test');
      }
  
      return loginResponse.headers['set-cookie'];
  
  }
  
export async function loginUserAndGetUser(email, password) {
  
    const userCookie = await loginUserAndGetCookie(email, password);
  
    const response = await request(app)
        .get('/user/currentUser')
        .set('Cookie', userCookie);
  
    if (response.status !== 200) {
        throw new Error('Failed to get logged in user for test');
    }
  
    return response.body.user;
  }
  
export async function cleanDatabase() {
    await User.deleteMany({});
    await VerificationCode.deleteMany({});
  }

  /**
 * test preparations
 */
export async function prepareTherapist(exampleLogin, therapistBody) {
    await registerTestTherapist(exampleLogin.email, exampleLogin.password);
    therapistBody.therapist = await User.findOne({ email: exampleLogin.email });
    therapistBody.userCookie = await loginUserAndGetCookie(
      exampleLogin.email,
      exampleLogin.password
    );
    therapistBody.user = await loginUserAndGetUser(exampleLogin.email, exampleLogin.password);
    therapistBody.verificationCode = await createVerificationCode(
        therapistBody.therapist._id,
      "therapistVerification"
    );
  }