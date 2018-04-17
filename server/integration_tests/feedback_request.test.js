process.env.NODE_ENV = "test";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const Feedback = require("../models/Feedback");

const request = require("supertest");

const mockEmailService = {
  sendText: jest.fn()
};

jest.mock("../utils/email_service.js", () => {
  return mockEmailService;
});

const app = require("../app");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);

afterAll(testDB.teardown);

let jwtToken;

async function loginAsTom() {
  let email = fixtures.users.tom.email;
  let password = fixtures.users.tom.password;
  let response = await request(app)
    .post("/api/users/login")
    .send({ user: { email, password } });
  jwtToken = response.body.token;
}

describe("Accessing Feedback Request API without login", () => {
  it("should return a 401 unauthorized code", async () => {
    let response = await request(app).post("/api/feedback/request");
    expect(response.statusCode).toBe(401);
  });
});

describe("Accessing Feedback Request API with login", () => {
  beforeAll(loginAsTom);
  let valid_giver = "jacky@example.com";
  let invalid_giver = "unknown@user.com";

  it("should return success for happy path", async () => {
    let feedback_request = {
      giver: valid_giver
    };
    let response = await request(app)
      .post("/api/feedback/request")
      .set("Authorization", "Bearer " + jwtToken)
      .send(feedback_request);
    expect(response.statusCode).toBe(200);
  });

  it("should return 400 bad request for giver email not found in the system", async () => {
    let feedback_request = {
      giver: invalid_giver
    };
    let response = await request(app)
      .post("/api/feedback/request")
      .set("Authorization", "Bearer " + jwtToken)
      .send(feedback_request);
    expect(response.statusCode).toBe(400);
  });

  it("should return 400 bad request for empty giver email", async () => {
    let feedback_request = {
      giver: ""
    };
    let response = await request(app)
      .post("/api/feedback/request")
      .set("Authorization", "Bearer " + jwtToken)
      .send(feedback_request);
    expect(response.statusCode).toBe(400);
  });

  it("should create an entry in the db", async () => {
    const receiver_email = fixtures.users.tom.email;
    const feedback_item = "";
    let feedbackItems = [feedback_item, feedback_item, feedback_item];
    let feedback_request = {
      giver: valid_giver
    };
    await Feedback.remove({ giver: valid_giver });

    await request(app)
      .post("/api/feedback/request")
      .set("Authorization", "Bearer " + jwtToken)
      .send(feedback_request);

    let feedback = await Feedback.findOne({
      giver: valid_giver,
      receiver: receiver_email
    });

    expect(feedback.receiver).toEqual(receiver_email);
    expect(feedback.giver).toEqual(valid_giver);
    expect(feedback.status).toEqual("GIVER_UNREAD");
    expect(Array.from(feedback.feedbackItems)).toEqual(feedbackItems);
  });

  it("should send out email for valid giver email", async () => {
    mockEmailService.sendText.mockClear();
    let feedback_request = {
      giver: valid_giver
    };
    let response = await request(app)
      .post("/api/feedback/request")
      .set("Authorization", "Bearer " + jwtToken)
      .send(feedback_request);
    expect(response.statusCode).toBe(200);
    expect(mockEmailService.sendText).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendText.mock.calls[0][1]).toEqual(valid_giver);
    const message = response.body.msg;
    expect(message).toMatch(
      `Your request for feedback from jacky (jacky@example.com) was sent successfully`
    );
  });

  it("should not send out email for invalid giver email", async () => {
    mockEmailService.sendText.mockClear();
    let feedback_request = {
      giver: invalid_giver
    };
    let response = await request(app)
      .post("/api/feedback/request")
      .set("Authorization", "Bearer " + jwtToken)
      .send(feedback_request);
    expect(response.statusCode).toBe(400);
    expect(mockEmailService.sendText).toHaveBeenCalledTimes(0);
  });
});
