import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { DoAndDontModel } from "../../data/model/dosAndDontsModel";
import FearModel from "../../data/model/fearModel";
import { app, sessionStore } from "../../main";
import { cleanDatabase, prepareTherapist } from "./baseTest";

const fearsRoute = "/dosAndDonts/fears";
const dosAndDontsRoute = "/addDoAndDont";

const mockFearId = "65b81cc56adcc9e503a61110";

const exampleLogin = {
  email: "therapist@example.com",
  password: "password123",
};
let therapistBody = {
  therapist: null,
  verificationCode: null,
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

describe("Fear Creation", () => {
  afterAll(cleanDatabase);
  beforeAll(() => prepareTherapist(exampleLogin, therapistBody));

  it("should save a new fear", async () => {
    const response = await request(app)
      .post(fearsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({ name: "New Fear" });

    expect(response.status).toBe(200);
  });

  it("should reject new fear with the existed name", async () => {
    const response = await request(app)
      .post(fearsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({ name: "New Fear" });

    expect(response.status).toBe(409);
    expect(response.body.error).toContain(
      "Please enter a new fear title, this fear already exists"
    );
  });

  it("should reject new fear by unauthorized user", async () => {
    const response = await request(app)
      .post(fearsRoute)
      .send({ name: "New Fear 1" });

    expect(response.status).toBe(401);
    expect(response.body.error).toContain("Unauthorized");
  });
});

describe("Receive Fear list", () => {
  afterAll(cleanDatabase);
  beforeAll(() => prepareTherapist(exampleLogin, therapistBody));

  it("should find all fears in list", async () => {
    let response;
    for (let i = 0; i < 2; ++i) {
      response = await request(app)
        .post(fearsRoute)
        .set("Cookie", therapistBody.userCookie)
        .send({ name: "New Fear " + i });

      expect(response.status).toBe(200);
    }

    response = await request(app)
      .get(fearsRoute + "?therapistId=" + therapistBody.user._id)
      .set("Cookie", therapistBody.userCookie);

    expect(response.status).toBe(200);

    const fears = response.body.map(
      (fearData: any) => new DoAndDontModel(fearData)
    );

    expect(fears.length).toBe(2);
  });
});

describe("Receive Fear by Id", () => {
  afterAll(cleanDatabase);
  beforeAll(() => prepareTherapist(exampleLogin, therapistBody));

  it("should find fear by id", async () => {
    let response = await request(app)
      .post(fearsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({ name: "New Fear" });

    expect(response.status).toBe(200);

    const fear = new FearModel(response.body);

    response = await request(app).get(fearsRoute + "/" + fear._id);

    expect(response.status).toBe(200);
    expect(new FearModel(response.body).name).toContain(fear.name);
  });

  it("should reject request with an invalid code", async () => {
    let response = await request(app).get(fearsRoute + "/" + mockFearId);

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("Fear not found");
  });
});

describe("Adding Do and Don't to Fear", () => {
  afterAll(cleanDatabase);
  beforeAll(() => prepareTherapist(exampleLogin, therapistBody));

  it("should add 'do' to Fear", async () => {
    let response = await request(app)
      .post(fearsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({ name: "New Fear" });

    expect(response.status).toBe(200);

    const fear = new FearModel(response.body);

    const doAndDont = new DoAndDontModel({
      fearId: fear._id,
      type: "Do",
      text: "test test",
    });

    response = await request(app)
      .post(fearsRoute + dosAndDontsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({
        fearId: doAndDont.fearId,
        type: doAndDont.type,
        text: doAndDont.text,
      });

    expect(response.status).toBe(200);
  });

  it("should add 'dont' to Fear", async () => {
    let response = await request(app)
      .post(fearsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({ name: "New Fear 1" });

    expect(response.status).toBe(200);

    const fear = new FearModel(response.body);

    const doAndDont = new DoAndDontModel({
      fearId: fear._id,
      type: "Don't",
      text: "test test",
    });

    response = await request(app)
      .post(fearsRoute + dosAndDontsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({
        fearId: doAndDont.fearId,
        type: doAndDont.type,
        text: doAndDont.text,
      });

    expect(response.status).toBe(200);
  });

  it("should reject request to add doAndDont to Fear", async () => {
    const doAndDont = new DoAndDontModel({
      fearId: mockFearId,
      type: "Don't",
      text: "test test",
    });

    let response = await request(app)
      .post(fearsRoute + dosAndDontsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({
        fearId: doAndDont.fearId,
        type: doAndDont.type,
        text: doAndDont.text,
      });

    expect(response.status).toBe(404);
    expect(response.body.error).toContain("Fear not found");
  });
});
