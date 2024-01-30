import request from "supertest";
import { DoAndDontModel } from "../../data/model/dosAndDontsModel";
import { FearModel } from "../../data/model/fearModel";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app, sessionStore } from "../../main";
import { cleanDatabase, prepareTherapist } from "./baseTest";

const fearsRoute = "/fears";
const addDosAndDontsRoute = "/addDoAndDont";
const dosAndDontsRoute = "/dosAndDonts";
const userRoute = "/user";

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

describe("Receive All do and donts for User", () => {
  afterAll(cleanDatabase);
  beforeAll(() => prepareTherapist(exampleLogin, therapistBody));

  it("should get 'do' and 'don't' for user", async () => {
    let response = await request(app)
      .post(dosAndDontsRoute + fearsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({ name: "New Fear" });

    expect(response.status).toBe(200);

    const fear = new FearModel(response.body);

    let doAndDont = new DoAndDontModel({
      fearId: fear._id,
      type: "Do",
      text: "test test",
    });

    response = await request(app)
      .post(dosAndDontsRoute + fearsRoute + addDosAndDontsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({
        fearId: doAndDont.fearId,
        type: doAndDont.type,
        text: doAndDont.text,
      });

    expect(response.status).toBe(200);
    console.error(JSON.stringify(response));

    doAndDont = new DoAndDontModel({
      fearId: fear._id,
      type: "Don't",
      text: "test test",
    });

    response = await request(app)
      .post(dosAndDontsRoute + fearsRoute + addDosAndDontsRoute)
      .set("Cookie", therapistBody.userCookie)
      .send({
        fearId: doAndDont.fearId,
        type: doAndDont.type,
        text: doAndDont.text,
      });

    expect(response.status).toBe(200);
    console.error(JSON.stringify(response));

    const dosAndDonts = response.body.dosAndDonts.map(
      (doAndDontData: any) => new String(doAndDontData)
    );

    //response = request(app).get(dosAndDontsRoute + userRoute + "/" + therapistBody.user._id);
    //response = request(app).get(dosAndDontsRoute + dosAndDontsRoute + userRoute + "/" + therapistBody.user._id);
    response = request(app).get(
      dosAndDontsRoute + dosAndDontsRoute + "/" + dosAndDonts[0]
    );
    console.error(JSON.stringify(response));
    response = request(app).get(
      dosAndDontsRoute + dosAndDontsRoute + "/" + dosAndDonts[1]
    );
    console.error(JSON.stringify(response));
    response = request(app).get(dosAndDontsRoute + dosAndDontsRoute);

    const dosAndDontss = response.body.map(
      (doAndDontData: any) => new DoAndDontModel(doAndDontData)
    );

    expect(doAndDont.length).toBe(2);
  });
});
