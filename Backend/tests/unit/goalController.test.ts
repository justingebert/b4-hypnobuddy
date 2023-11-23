import request from 'supertest';
import { app } from '../../main';
import RoadmapGoal from '../../data/model/roadmapGoal';
import { getGoalParams, validate, createGoal } from '../../controllers/goalController';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

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
});

/**
 * clear all mocks after each test
 * clear all timers after each test
 */
afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllTimers();
});

describe('getGoalParams Function', () => {
    it('should correctly extract goal parameters from the body', () => {
        const body = {
            title: 'Sample Goal',
            description: 'Sample description',
            status: 'not_started',
            dueDate: '2023-01-01',
            isSubGoal: false,
            parentGoalId: null,
            subGoals: [],
        };

        const expectedOutput = {
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

    it('should handle missing fields appropriately', () => {
        const body = {
            title: 'Sample Goal',
            description: 'Sample description',
            // status, dueDate, isSubGoal, parentGoalId, subGoals are missing
        };

        const expectedOutput = {
            title: 'Sample Goal',
            description: 'Sample description',
            status: undefined,
            dueDate: undefined,
            isSubGoal: undefined,
            parentGoalId: undefined,
            subGoals: undefined,
        };

        expect(getGoalParams(body)).toEqual(expectedOutput);
    });

    // Add more tests for different scenarios, such as handling null values, unexpected input types, etc.
});



describe('Goal Input Validation', () => {
    it('should reject empty title', async () => {
        const response = await request(app)
            .post('/goal/create')
            .send({ description: 'Sample description', status: 'not_started', isSubGoal: false, subGoals: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Title cannot be empty');
    });

    it('should reject empty description', async () => {
        const response = await request(app)
            .post('/goal/create')
            .send({ title: 'Sample Goal', status: 'not_started', isSubGoal: false, subGoals: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Description cannot be empty');
    });

    // Add more validation tests for other fields
});

describe('Goal Creation', () => {
    it('should create a new goal', async () => {
        const response = await request(app)
            .post('/goal/create')
            .send({
                title: 'Sample Goal',
                description: 'Sample description',
                status: 'in_progress',
                isSubGoal: false,
                subGoals: [],
            });

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('Successful Login');
        expect(response.body.user).toBeDefined(); // Assuming you return the created goal in the response
    });

    // Add more tests for handling duplicate goals, invalid input, etc.
});

