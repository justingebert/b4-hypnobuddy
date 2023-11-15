import request from 'supertest';
import {app, sessionStore} from '../../main';
import { getUserParams } from '../../controllers/userController';
import mongoose from "mongoose";
import User from "../../data/model/user";
import {MongoMemoryServer} from "mongodb-memory-server";


async function registerJohn(){
    const newUser = new User({
        email: 'john@example.com',
        name: { first: 'John', last: 'Doe' }
    });

    await User.register(newUser, '123456');
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

    // Additional test cases can be added here, such as handling unexpected input types,
    // extra fields, or null values.
});

describe('User Input Validation', () => {
    it('should reject invalid email', async () => {
        const response = await request(app)
            .post('/user/create')
            .send({ first: 'John', last: 'Doe', email: 'invalid-email', password: '123456' });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Email is invalid');
    });

    it('should reject empty password', async () => {
        const response = await request(app)
            .post('/user/create')
            .send({ first: 'John', last: 'Doe', email: 'john@example.com', password: '' });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Password cannot be empty');
    });

    // Add more tests for other validation rules
});

describe('User Authentication', () => {
    beforeEach(async () => {
        await registerJohn();
    });

    afterEach(async () => {
        // Clean up the database after each test
        await User.deleteMany({});
    });

    it('should authenticate a valid user', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({ email: 'john@example.com', password: '123456' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe('Successful Login');
    });

    it('should reject an invalid user', async () => {
        const response = await request(app)
            .post('/user/login')
            .send({ email: 'invalid@example.com', password: 'wrong password' });

        expect(response.status).toBe(401);
        expect(response.body.success).toBeFalsy();
    });

    // More tests around authentication logic
});


describe('User Logout', () => {
    let userCookie;

    beforeAll(async () => {
        await registerJohn(); // Function to register a user named John

        const loginResponse = await request(app)
            .post('/user/login')
            .send({ email: 'john@example.com', password: '123456' });

        userCookie = loginResponse.headers['set-cookie'];
    });

    afterEach(async () => {
        // Clean up the database after each test
        await User.deleteMany({});
    });

    it('should successfully log out a user', async () => {
        const response = await request(app)
            .post('/user/logout')
            .set('Cookie', userCookie);

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toBe('You have been logged out!');
    });

    // Additional logout related tests
});


describe('User Account Creation', () => {
    it('should create a new user account', async () => {
        const response = await request(app)
            .post('/user/create')
            .send({ first: 'Alice', last: 'Smith', email: 'alice@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('account created successfully');
    });

    // Tests for handling duplicate email, invalid input, etc.
});

describe('Current User Endpoint', () => {
    let userCookie;

    beforeAll(async () => {
        await registerJohn();

        const loginResponse = await request(app)
            .post('/user/login')
            .send({ email: 'john@example.com', password: '123456' });

        userCookie = loginResponse.headers['set-cookie'];
    });

    afterEach(async () => {
        // Clean up the database after each test
        await User.deleteMany({});
    });

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

    // Additional tests around this functionality
});

