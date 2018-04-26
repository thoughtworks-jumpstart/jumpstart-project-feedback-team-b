process.env.NODE_ENV = "test";

const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const Feedback = require("../models/Feedback");

const request = require("supertest");

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

async function createFeedback() {
  const giver = "giver@giver.com";
  const receiver = fixtures.users.tom.email;
  const feedbackItems = [
    "What I did Well",
    "What I could do Better",
    "Suggestions for Improvement"
  ];

  let feedback = new Feedback({ giver, receiver, feedbackItems });
  try {
    await feedback.save();
    return feedback;
  } catch (error) {
    return error;
  }
}

describe("Retrieve feeback by email", () => {
  beforeAll(loginAsTom);
  it("/api/feedback -> should return a list of feedbacks", async () => {
    let response = await request(app)
      .get("/api/feedback")
      .set("Authorization", "Bearer " + jwtToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.receiver).toHaveLength(0);
  });
});

describe("Retrieving feedback by ID API without login", () => {
  it("should return a 401 unauthorized code", async () => {
    let feedback = await createFeedback();
    let response = await request(app).get(`/api/feedback/${feedback._id}`);
    expect(response.statusCode).toBe(401);
  });
});

describe("Retrieve feedback API with login", () => {
  beforeAll(loginAsTom);

  it("/api/feedback/:id -> should return a feedback items if ID value is supplied correctly", async () => {
    const savedFeedback = await createFeedback();
    const savedFeedbackID = savedFeedback._id;
    const savedFeedbackItems = savedFeedback.feedbackItems;
    let response = await request(app)
      .get(`/api/feedback/${savedFeedbackID}`)
      .set("Authorization", "Bearer " + jwtToken);
    expect(response.statusCode).toBe(200);
    // to test the feedbackItems length
    expect(response.body.feedback.feedbackItems).toHaveLength(
      savedFeedbackItems.length
    );
    // To test if the feedbackItems content is the same
    expect(response.body.feedback.feedbackItems).toEqual(
      expect.arrayContaining(savedFeedbackItems)
    );
  });

  it("/api/feedback -> should return a list of feedbacks ", async () => {
    let response = await request(app)
      .get("/api/feedback")
      .set("Authorization", "Bearer " + jwtToken);
    expect(response.statusCode).toBe(200);
    expect(response.body.receiver).toHaveLength(2);
    expect(response.body.receiver[0].giver).toBe("giver@giver.com");
  });

  it("should return a unhappy path if id value is supplied incorrectly", async () => {
    let response = await request(app)
      .get(`/api/feedback/GSDQQD3276530`)
      .set("Authorization", "Bearer " + jwtToken);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      msg: "The feedback could not be found in the system."
    });
  });
});
