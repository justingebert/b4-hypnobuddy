import request from 'supertest';
import {app, sessionStore} from '../../main';
import RoadmapGoal from '../../data/model/roadmapGoal';
import User from '../../data/model/user';
import { getGoalParams } from '../../controllers/goalController';
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

async function loginUserAndGetUserCookie(email, password) {
    const loginResponse = await request(app)
        .post('/user/login')
        .send({ email: email, password: password });

    if (loginResponse.status !== 200) {
        throw new Error('Failed to log in user for test');
    }

    return loginResponse.headers['set-cookie'];

}

async function loginUserAndGetUser(email, password) {

    const userCookie = await loginUserAndGetUserCookie(email, password);

    const response = await request(app)
        .get('/user/currentUser')
        .set('Cookie', userCookie);

    if (response.status !== 200) {
        throw new Error('Failed to get logged in user for test');
    }

    return response.body.user;
}

async function saveExampleGoal(userID){

    const goal = new RoadmapGoal({
        userID: userID,
        title: 'Sample Goal',
        description: 'Sample description',
        status: 'Geplant',
        dueDate: '2023-01-01',
        isSubGoal: false,
        parentGoalId: null,
        subGoals: [],
    });
    await goal.save();

    await User.findOneAndUpdate({ _id: goal.userID }, { $push: { goalIDs: goal._id } });

    return goal;
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
    await mongoose.connection.close();
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

describe('Goal Input Validation', () => {
    const exampleLogin = {email: 'john@example.com', password: '123456'};
    let userCookie;

    beforeAll(async () => {
        await registerTestUser(exampleLogin.email, exampleLogin.password);
        userCookie = await loginUserAndGetUserCookie(exampleLogin.email, exampleLogin.password);
    });

    afterEach(cleanDatabase);

    it.skip('should reject empty title', async () => {
        const response = await request(app)
            .post('/goal/create')
            .set('Cookie', userCookie)
            .send({ description: 'Sample description', status: 'Geplant', isSubGoal: false, subGoals: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Title cannot be empty');
    });

    it.skip('should reject empty description', async () => {
        const response = await request(app)
            .post('/goal/create')
            .set('Cookie', userCookie)
            .send({ title: 'Sample Goal', status: 'Geplant', isSubGoal: false, subGoals: [] });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain('Description cannot be empty');
    });

    // Add more validation tests for other fields
});

describe('Goal Creation', () => {
    const exampleLogin = {email: 'john@example.com', password: '123456'};
    let userCookie;
    let user;

    beforeAll(async () => {
        await registerTestUser(exampleLogin.email, exampleLogin.password);
        userCookie = await loginUserAndGetUserCookie(exampleLogin.email, exampleLogin.password);
        user = await loginUserAndGetUser(exampleLogin.email, exampleLogin.password);
    });

    afterAll(cleanDatabase);

    it('should create a new goal', async () => {
        const response = await request(app)
            .post('/goal/create')
            .set('Cookie', userCookie)
            .send({
                title: 'Sample Goal',
                description: 'Sample description',
                status: 'Geplant',
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
            .set('Cookie', userCookie)
            .send({
                title: 'Sample Goal',
                description: 'Sample description',
                status: 'Umsetzung',
                isSubGoal: false,
                subGoals: [],
            });
        const updatedUser = await User.findById(user._id);
        const goalIdString = response.body.goal._id.toString();
        expect(updatedUser.goalIDs.map(String)).toContain(goalIdString);

    });

});

describe('Getting all goals of a given user', () => {
    const exampleLogin = {email: 'john@example.com', password: '123456'};

    let userCookie;
    let user;
    let goal;

    beforeAll(async () => {
        await registerTestUser(exampleLogin.email, exampleLogin.password);
        userCookie = await loginUserAndGetUserCookie(exampleLogin.email, exampleLogin.password);
        user = await loginUserAndGetUser(exampleLogin.email, exampleLogin.password);
        goal = await saveExampleGoal(user._id);
    });

    afterAll(cleanDatabase);

    it('should return all goals of user', async () => {
        const response = await request(app)
            .get('/goal/getAll')
            .set('Cookie', userCookie)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('Successfully retrieved goal');
        expect(response.body.goals).toBeDefined();
        expect(response.body.goals.length).toBe(1);
        expect(response.body.goals[0]._id).toBe(goal._id.toString());

    });

    it('should return an empty array if the user has no goals', async () => {
        await RoadmapGoal.deleteMany({});
        const response = await request(app)
            .get('/goal/getAll')
            .set('Cookie', userCookie)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('Successfully retrieved goal');
        expect(response.body.goals).toBeDefined();
        expect(response.body.goals.length).toBe(0);
        expect(response.body.goals).toEqual([]);
    });

});

describe('Getting a goal by ID', () => {
    const exampleLogin = {email: 'john@example.com', password: '123456'};

    let user;
    let goal;

    beforeAll(async () => {
        await registerTestUser(exampleLogin.email, exampleLogin.password);
        user = await loginUserAndGetUser(exampleLogin.email, exampleLogin.password);
        goal = await saveExampleGoal(user._id);
    });

    afterAll(cleanDatabase);


    it('should return the goal with the given ID', async () => {
        const response = await request(app)
            .get(`/goal/${goal._id}`)
            .send();

        expect(response.status).toBe(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.message).toContain('Successfully retrieved goal');
        expect(response.body.goal).toBeDefined();
        expect(response.body.goal._id).toBe(goal._id.toString());
    });

    it('should handle invalid goal ID', async () => {
        const invalidGoalId = '1234567f8912345678912345';
        const response = await request(app)
            .get(`/goal/${invalidGoalId}`)

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Goal not found');
    });
});

describe('Deleting a goal', () => {
    const exampleLogin = {email: 'john@example.com', password: '123456'};
    let user;
    let goal;

    beforeAll(async () => {
        await registerTestUser(exampleLogin.email, exampleLogin.password);
        user = await loginUserAndGetUser(exampleLogin.email, exampleLogin.password);
        goal = await saveExampleGoal(user._id);
    });

    afterAll(cleanDatabase);

    it ('should delete a the goal from db', async () => {
        const deleteResponse = await request(app)
            .post(`/goal/delete/${goal._id}`)
            .send();

        const goalFromDb = await RoadmapGoal.findById(goal._id);

        expect(deleteResponse.status).toBe(200);
        expect(deleteResponse.body.success).toBeTruthy();
        expect(deleteResponse.body.message).toContain('Successfully deleted goal');
        expect(goalFromDb).toBeNull();
    });

    it('should remove the goalID from the user document', async () => {
        await request(app)
            .post(`/goal/delete/${goal._id}`)
            .send();

        const userFromDb = await User.findById(user._id);

        expect(userFromDb.goalIDs).not.toContain(goal._id);
    });

    it('should handle invalid goal ID', async () => {
        const invalidGoalId = '1234567f8912345678912345';
        const response = await request(app)
            .post(`/goal/delete/${invalidGoalId}`)

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Goal not found');
    });
});

describe('Updating a goal', () => {
    const exampleLogin = {email: 'john@example.com', password: '123456'};
    let user;
    let goal;

    beforeAll(async () => {
        await registerTestUser(exampleLogin.email, exampleLogin.password);
        user = await loginUserAndGetUser(exampleLogin.email, exampleLogin.password);
        goal = await saveExampleGoal(user._id);
    });

    afterAll(cleanDatabase);

    it('should update the goal', async () => {
        const updateResponse = await request(app)
            .post(`/goal/update/${goal._id}`)
            .send({title: 'Updated Title', description: 'Updated Description'});

        expect(updateResponse.status).toBe(200);
        expect(updateResponse.body.success).toBeTruthy();
        expect(updateResponse.body.message).toContain('Successfully updated goal');
        expect(updateResponse.body.goal).toBeDefined();
        expect(updateResponse.body.goal.title).toBe('Updated Title');
        expect(updateResponse.body.goal.description).toBe('Updated Description');
    });

    it('should handle invalid goal ID', async () => {
        const invalidGoalId = '1234567f8912345678912345';
        const response = await request(app)
            .post(`/goal/update/${invalidGoalId}`)

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Goal not found');
    });
});

describe('Reordering goals', () => {
    const exampleLogin = {email: 'john@example.com', password: '123456'};
    let userCookie;
    let user;
    let goal1
    let goal2;

    beforeAll(async () => {
        await registerTestUser(exampleLogin.email, exampleLogin.password);
        userCookie = await loginUserAndGetUserCookie(exampleLogin.email, exampleLogin.password);
        user = await loginUserAndGetUser(exampleLogin.email, exampleLogin.password);
        goal1 = await saveExampleGoal(user._id);
        goal2 = await saveExampleGoal(user._id);
    });

    afterAll(cleanDatabase);

    it('should reorder the goals', async () => {
        const reorderResponse = await request(app)
            .post(`/goal/reorder`)
            .set('Cookie', userCookie)
            .send({goalIDs: [goal2._id, goal1._id]});

        expect(reorderResponse.status).toBe(200);
        expect(reorderResponse.body.success).toBeTruthy();
        expect(reorderResponse.body.message).toContain('Successfully updated goal order');

        const goalListResponse = await request(app)
            .get('/goal/getAll')
            .set('Cookie', userCookie)
            .send();

        expect(goalListResponse.body.goals[0]._id.toString()).toBe(goal2._id.toString());
        expect(goalListResponse.body.goals[1]._id.toString()).toBe(goal1._id.toString());
    });
});
