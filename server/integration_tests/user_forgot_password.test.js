process.env.NODE_ENV = "test";
const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const User = require("../models/User");

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

const sendPasswordReset = async email => {
  mockEmailService.sendText.mockClear();
  let response = await request(app)
    .post("/api/user/forgot-password")
    .send({ user: { email: email } });
  expect(response.statusCode).toBe(200);
  expect(mockEmailService.sendText).toHaveBeenCalledTimes(1);
  expect(mockEmailService.sendText.mock.calls[0][1]).toEqual(email);
  const message = response.body.msg;
  expect(message).toMatch(
    `An email has been sent to ${email} with further instructions.`
  );
};

const resetPasswordRequest = async (newResetPassword, userToken) => {
  let resetPasswordResponse = await request(app)
    .post("/api/user/reset-password/")
    .send({
      user: {
        password: newResetPassword,
        confirm: newResetPassword,
        token: userToken
      }
    });
  expect(resetPasswordResponse.statusCode).toBe(200);
  expect(resetPasswordResponse.body.msg).toMatch(
    /Your password has been changed successfully./
  );
};

const loginWithNewPassword = async (email, newResetPassword) => {
  let newPasswordResponse = await request(app)
    .post("/api/users/login")
    .send({ user: { email, password: newResetPassword } });
  expect(newPasswordResponse.statusCode).toBe(200);
};

describe("Existing user forgot password", () => {
  test("Existing user send a 'password reset' request to server and server should send an email to existing user's email", async () => {
    const email = fixtures.users.tom.email;
    await sendPasswordReset(email);

    const newResetPassword = "123";
    const userFoundByEmail = await User.findOne({ email: email });
    const userToken = userFoundByEmail.passwordResetToken;
    await resetPasswordRequest(newResetPassword, userToken);

    await loginWithNewPassword(email, newResetPassword);
  });

  test("Reset password with invalid token", async () => {
    let fakePassword = "fakePassworfd";
    let resetPasswordResponse = await request(app)
      .post("/api/user/reset-password/")
      .send({
        user: {
          password: fakePassword,
          confirm: fakePassword,
          token: "fakeToken"
        }
      });
    expect(resetPasswordResponse.statusCode).toBe(400);
  });

  test("should respond normally when invalid email address is given'", async () => {
    mockEmailService.sendText.mockClear();
    let fakeEmail = "iamsofake@email.com";
    let response = await request(app)
      .post("/api/user/forgot-password")
      .send({ user: { email: fakeEmail } });
    const message = response.body.msg;
    expect(mockEmailService.sendText).toHaveBeenCalledTimes(0);
    expect(message).toMatch(
      `An email has been sent to ${fakeEmail} with further instructions.`
    );
  });
});
