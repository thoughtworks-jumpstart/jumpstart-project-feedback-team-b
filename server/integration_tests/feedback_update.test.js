process.env.NODE_ENV = "test";

const testDB = require("../test_helper/in_memory_mongodb_setup");
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
let invalid_giver = "receiver@receiver.com";
let valid_receiver = "jacky@example.com";
let invalid_receiver = "receiver@receiver.com";

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
  it("should update requested feedback - happy path", async () => {
    let feedbackItems = [
      "Good points",
      "You can do a lot better",
      "Lots of room for improvement"
    ];
    const response = await request(app)
      .put(`/api/feedback/request/${id}`)
      .set("Authorization", "Bearer " + jwtToken)
      .send({ receiver: valid_receiver, feedbackItems: feedbackItems });
    expect(response.statusCode).toBe(200);
  });
});
