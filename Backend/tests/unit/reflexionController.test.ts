import request from "supertest";
import Reflexion from "../../data/model/reflexion";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app, sessionStore } from "../../main";
import { preparePatient, cleanDatabase } from "../../tests/unit/baseTest";

const reflexionRoute = "/reflexion";
const createRoute = "/create";
const getAllRoute = "/getAll";
const getByIdRoute = "/getById/";
const updateRoute = "/update/";

const exampleLogin = {
  email: "patient@example.com",
  password: "password123",
};
let patientBody = {
  patient: null,
  userCookie: null,
  user: null,
};

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

async function createReflexion() {
    const response = await request(app)
      .post(reflexionRoute + createRoute)
      .set("Cookie", patientBody.userCookie)
      .send({ mood: "Sehr gut", description: "testy", deepDiveQuestion: "testchen", deepDiveAnswer: "testtest" });

    expect(response.status).toBe(200);
    return response;
}

describe("Create reflexion of user", () => {
  afterAll(cleanDatabase);
  beforeAll(() => preparePatient(exampleLogin, patientBody));

  it("should create a new reflexion of user with fully filled body of reflexion", async () => {
    let response = createReflexion();
  });
});
