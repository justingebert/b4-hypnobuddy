import request from 'supertest';
import {app, sessionStore} from '../../main';
import RoadmapGoal from '../../data/model/roadmapGoal';
import User from '../../data/model/user';
import { getGoalParams, validate, createGoal } from '../../controllers/goalController';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

//reused code in functions
async function registerTestUser(email, password, role = 'patient') {
    const newUser = new User({
        email: email,
        name: {first: 'John', last: 'Doe'},
        role: role
    });

    await User.register(newUser, password);
}

async function loginUserAndGetUser(email, password) {
    const loginResponse = await request(app)
        .post('/user/login')
        .send({ email: email, password: password });

    if (loginResponse.status !== 200) {
        throw new Error('Failed to log in user for test');
    }

    const userCookie = loginResponse.headers['set-cookie'];
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
    await RoadmapGoal.deleteMany({});
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
 * Remove and close the db and server.
 */
afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
});

//------------------TESTS------------------

describe('getGoalParams Function', () => {
    it('should correctly extract goal parameters from the body', () => {
        const body = {
            userID: "65523e8ad445f1c1acf2ed9f",
            title: 'Sample Goal',
            description: 'Sample description',
            status: 'not_started',
            dueDate: '2023-01-01',
            isSubGoal: false,
            parentGoalId: null,
            subGoals: [],
        };

        const expectedOutput = {
            userID: "65523e8ad445f1c1acf2ed9f",
            title: 'Sample Goal',
            description: 'Sample description',
            status: 'not_started',
            dueDate: '2023-01-01',
            isSubGoal: false,
            parentGoalId: null,
            subGoals: [],
        };

        expect(getGoalParams(body)).toEqual(expectedOutput);
    });
});



describe('Goal Input Validation', () => {
    let user;

    beforeAll(async () => {
        await registerTestUser('john@example.com', '123456');
        user = await loginUserAndGetUser('john@example.com', '123456');
    });

    afterEach(cleanDatabase);

    it('should reject invalid userIDs', async () => {
        const response = await request(app)
            .post('/goal/create')
            .send({ userID: "wrongID", title: 'Sample Goal', description: 'Sample description', status: 'not_started', isSubGoal: false, subGoals: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Invalid MongoDB ID');
    });

    it('should reject non-existing userIDs', async () => {
        const response = await request(app)
            .post('/goal/create')
            .send({ userID: "65523e8ad445f1c1acf2ed9c", title: 'Sample Goal', description: 'Sample description', status: 'not_started', isSubGoal: false, subGoals: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('User not found');
    });

    it('should reject empty title', async () => {
        const response = await request(app)
            .post('/goal/create')
            .send({ userID: user._id, description: 'Sample description', status: 'not_started', isSubGoal: false, subGoals: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Title cannot be empty');
    });

    it('should reject empty description', async () => {
        const response = await request(app)
            .post('/goal/create')
            .send({ userID: user._id,  title: 'Sample Goal', status: 'not_started', isSubGoal: false, subGoals: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Description cannot be empty');
    });

    // Add more validation tests for other fields
});

describe('Goal Creation', () => {
    let user;

    beforeAll(async () => {
        await registerTestUser('john@example.com', '123456');
        user = await loginUserAndGetUser('john@example.com', '123456');
    });

    afterEach(cleanDatabase);

    it('should create a new goal', async () => {
        console.log("user:" + JSON.stringify(user, null, 2))
        const response = await request(app)
            .post('/goal/create')
            .send({
                userID: user._id,
                title: 'Sample Goal',
                description: 'Sample description',
                status: 'in_progress',
                isSubGoal: false,
                subGoals: [],
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('Successfully created goal');
        expect(response.body.goal).toBeDefined(); // Assuming you return the created goal in the response
    });

    it('should save the goalID within user document', async () => {
        const response = await request(app)
            .post('/goal/create')
            .send({
                userID: user._id,
                title: 'Sample Goal',
                description: 'Sample description',
                status: 'in_progress',
                isSubGoal: false,
                subGoals: [],
            });

        const updatedUser = await User.findById(user._id);
        const goalIdString = response.body.goal._id.toString();
        expect(updatedUser.goalIDs.map(String)).toContain(goalIdString);

    });

});