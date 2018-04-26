process.env.NODE_ENV = "test";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const Feedback = require("../models/Feedback");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;

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
let valid_giver = "jacky@example.com";
let valid_receiver = "jacky@example.com";

async function loginAsTom() {
  let email = fixtures.users.tom.email;
  let password = fixtures.users.tom.password;
  let response = await request(app)
    .post("/api/users/login")
    .send({ user: { email, password } });
  jwtToken = response.body.token;
}

async function createRequest() {
  let feedback_request = {
    giver: valid_giver
  };
  const response = await request(app)
    .post("/api/feedback/request")
    .set("Authorization", "Bearer " + jwtToken)
    .send(feedback_request);

  return response.body.feedbackId;
}

describe("Accessing Feedback API with login", () => {
  let id;
  beforeAll(async () => {
    await loginAsTom();
    id = await createRequest();
  });
  let feedbackItems = [
    "Good points",
    "You can do a lot better",
    "Lots of room for improvement"
  ];
  it("should update requested feedback - happy path", async () => {
    const response = await request(app)
      .put(`/api/feedback/request/${id}`)
      .set("Authorization", "Bearer " + jwtToken)
      .send({ receiver: valid_receiver, feedbackItems: feedbackItems });
    expect(response.statusCode).toBe(200);
  });

  it("should fail to return a happy path if id supplied is invalid", async () => {
    const response = await request(app)
      .put(`/api/feedback/request/123456`)
      .set("Authorization", "Bearer " + jwtToken)
      .send({ receiver: valid_receiver, feedbackItems: feedbackItems });
    expect(response.statusCode).toBe(400);
  });

  it("should update feedback items in db", async () => {
    let feedback_update = {
      receiver: valid_receiver,
      feedbackItems: feedbackItems
    };
    await request(app)
      .put(`/api/feedback/request/${id}`)
      .set("Authorization", "Bearer " + jwtToken)
      .send(feedback_update);

    let feedback = await Feedback.findById(id);
    expect(feedback.status).toEqual("RECEIVER_UNREAD");
    expect(Array.from(feedback.feedbackItems)).toEqual(feedbackItems);
  });
});
