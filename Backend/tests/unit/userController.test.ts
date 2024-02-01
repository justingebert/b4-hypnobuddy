import request from 'supertest';
import {app, sessionStore} from '../../main';
import {getUserParams} from '../../controllers/userController';
import mongoose from "mongoose";
import User from "../../data/model/user";
import {MongoMemoryServer} from "mongodb-memory-server";
import VerificationCode from "../../data/model/verificationCode";
import {log} from "util";

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
describe('getUserParams Function', () => {
    it('should correctly extract and format user parameters from the body', () => {
        const body = {
            first: 'John',
            last: 'Doe',
            email: 'john@example.com',
            password: '123456'
        };

        const expectedOutput = {
            name: {
                first: 'John',
                last: 'Doe'
            },
            email: 'john@example.com',
            password: '123456'
        };

        expect(getUserParams(body)).toEqual(expectedOutput);
    });

    it('should handle missing fields appropriately', () => {
        const body = {
            first: 'Jane',
            last: 'Doe'
            // email and password are missing
        };

        const expectedOutput = {
            name: {
                first: 'Jane',
                last: 'Doe'
            },
            email: undefined,
            password: undefined
        };

        expect(getUserParams(body)).toEqual(expectedOutput);
    });
});
describe('User Input Validation', () => {
    it('should reject invalid email', async () => {
        const response = await request(app)
            .post('/user/create')
            .send({first: 'John', last: 'Doe', email: 'invalid-email', password: '123456'});

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Email is invalid');
    });

    it('should reject empty password', async () => {
        const response = await request(app)
            .post('/user/create')
            .send({first: 'John', last: 'Doe', email: 'john@example.com', password: ''});

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Password cannot be empty');
    });
});
describe('User Account Creation', () => {
    it('should create a new user account', async () => {
        const response = await request(app)
            .post('/user/create')
            .send({first: 'Alice', last: 'Smith', email: 'alice@example.com', password: 'password123'});

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('account created successfully');
    });

});
describe('User Authentication', () => {
    beforeEach(async () => {
        await registerTestUser('john@example.com', '123456');
    });

    afterEach(cleanDatabase);

    it('should authenticate a valid user', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({email: 'john@example.com', password: '123456'});

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe('Successful Login');
    });

    it('should reject an invalid user', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({email: 'invalid@example.com', password: 'wrong password'});

        expect(response.status).toBe(401);
        expect(response.body.success).toBeFalsy();
    });

});
describe('User Logout', () => {
    let userCookie;

    beforeAll(async () => {
        await registerTestUser('john@example.com', '123456');
        userCookie = await loginUserAndGetCookie('john@example.com', '123456');
    });

    afterEach(cleanDatabase);

    it('should successfully log out a user', async () => {
        const response = await request(app)
            .post('/user/logout')
            .set('Cookie', userCookie);

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe('You have been logged out!');
    });

});
describe('Current User Endpoint', () => {
    let userCookie;

    beforeAll(async () => {
        await registerTestUser('john@example.com', '123456');

        const loginResponse = await request(app)
            .post('/user/login')
            .send({email: 'john@example.com', password: '123456'});

        userCookie = loginResponse.headers['set-cookie'];
    });

    afterEach(cleanDatabase);

    it('should return the current authenticated user', async () => {
        // Use the cookie to simulate a logged-in user
        const response = await request(app)
            .get('/user/currentUser')
            .set('Cookie', userCookie);

        expect(response.status).toBe(200);
        expect(response.body.isAuthenticated).toBeTruthy();
        expect(response.body.user).toBeDefined();
    });

    it('should return not authenticated when no user is logged in', async () => {
        const response = await request(app).get('/user/currentUser');

        expect(response.status).toBe(200);
        expect(response.body.isAuthenticated).toBeFalsy();
    });

});
describe('Therapist Verification', () => {
    let therapist,therapistCookie, verificationCode;

    beforeEach(async () => {
        await registerTestTherapist('therapist@example.com', 'password123');
        therapist = await User.findOne({ email: 'therapist@example.com' });
        therapistCookie = await loginUserAndGetCookie('therapist@example.com', 'password123')
        verificationCode = await createVerificationCode(therapist._id, 'therapistVerification');
    });

    afterEach(cleanDatabase);

    it('should successfully verify a therapist', async () => {
        const response = await request(app)
            .post('/user/verify')
            .set('Cookie', therapistCookie)
            .send({code: 'valid-verification-code'});

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('Therapist verified successfully');
        // Expect to receive patientCode in response
        expect(response.body.patientCode).toBeDefined();
    });

    it('should reject verification with invalid code', async () => {
        // Use an invalid verification code
        const response = await request(app)
            .post('/user/verify')
            .set('Cookie', therapistCookie)
            .send({code: 'invalid-code'});

        expect(response.status).toBe(400);
        expect(response.body.success).toBeFalsy();
    });

    it('should update role to therapist after successful verification', async () => {
        // Use a valid verification code
        await request(app)
            .post('/user/verify')
            .set('Cookie', therapistCookie)
            .send({ code: 'valid-verification-code' });

        // Fetch the updated therapist data
        const updatedTherapist = await User.findById(therapist._id);

        expect(updatedTherapist.role).toBe('therapist');
    });
});
describe('Linking Patient to Therapist', () => {
    let therapist, patient, patientCookie, patientLinkingCode;

    beforeEach(async () => {
        await registerTestTherapist('therapist@example.com', 'password123');
        await registerTestUser('patient@example.com', 'password123');
        therapist = await User.findOne({ email: 'therapist@example.com' });
        patient = await User.findOne({ email: 'patient@example.com' });
        patientCookie = await loginUserAndGetCookie('patient@example.com', 'password123')
        patientLinkingCode = await createVerificationCode(therapist._id, 'patientLinking');
    });

    afterEach(cleanDatabase);

    it('should link a patient to a therapist with a valid code', async () => {
        const response = await request(app)
            .post('/user/link')
            .set('Cookie', patientCookie)
            .send({patientCode: patientLinkingCode.code});

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('Linked to therapist successfully');
    });

    it('should reject linking with an invalid code', async () => {
        const response = await request(app)
            .post('/user/link')
            .set('Cookie', patientCookie)
            .send({patientCode: 'invalid-code'});

        expect(response.status).toBe(400);
        expect(response.body.success).toBeFalsy();
    });

    it("should reject linking if user is not Authenticated", async () => {
        const response = await request(app)
            .post('/user/link')
            .send({patientCode: 'valid-linking-code'});

        expect(response.status).toBe(401);
        expect(response.body.success).toBeFalsy();
    })

    it('should link the correct therapist to the patient', async () => {
        // Link patient to therapist
        await request(app)
            .post('/user/link')
            .set('Cookie', patientCookie)
            .send({ patientCode: patientLinkingCode.code });

        // Fetch the updated patient data
        const updatedPatient = await User.findById(patient._id);

        expect(updatedPatient.therapist.toString()).toBe(therapist._id.toString());
    });
});
