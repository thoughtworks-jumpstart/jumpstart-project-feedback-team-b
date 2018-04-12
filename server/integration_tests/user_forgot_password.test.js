process.env.NODE_ENV = "test";
const testDB = require("../test_helper/in_memory_mongodb_setup");
const fixtureLoader = require("../test_helper/fixtures");
const fixtures = require("../test_helper/fixtures").fixtures;
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");

beforeAll(testDB.setup);
beforeAll(fixtureLoader.load);

afterAll(testDB.teardown);

const sendPasswordReset = async () => {
  const email = fixtures.users.tom.email;
  let response = await request(app)
    .post("/api/user/forgot-password")
    .send({ user: { email: email } });
  return response;
};
describe("Existing user forgot password", () => {
  test("Existing user send a 'password reset' request to server and server should send an email to existing user's email", async () => {
    let response = await sendPasswordReset();
    expect(response.statusCode).toBe(200);
    const message = response.body.msg;
    expect(message).toMatch(
      /An email has been sent to tom@example.com with further instructions./
    );
    const email = fixtures.users.tom.email;
    const userFoundByEmail = await User.findOne({ email: email });
    const userToken = userFoundByEmail.passwordResetToken;
    const newResetPassword = "123";

    let resetPasswordResponse = await request(app)
      .post(`/api/user/reset-password/${userToken}`)
      .send({
        user: {
          password: newResetPassword,
          confirm: newResetPassword
        }
      });
    expect(resetPasswordResponse.statusCode).toBe(200);
    expect(resetPasswordResponse.body.msg).toMatch(
      /Your password has been changed successfully./
    );
    //     let newPasswordResponse = await request(app)
    //       .post("/api/users/login")
    //       .send({ user: { email, password: newResetPassword } });
    //     // console.log(newPasswordResponse.body);
    //     expect(newPasswordResponse.statusCode).toBe(200);
  });
  test("should send 'a status 400 and a message: email address ${toAddress} is not associated with any account'", async () => {
    let fakeEmail = "iamsofake@email.com";
    let response = await request(app)
      .post("/api/user/forgot-password")
      .send({ user: { email: fakeEmail } });
    expect(response.statusCode).toBe(400);
    const message = response.body.msg;
    expect(message).toMatch(
      /The email address iamsofake@email.com is not associated with any account./
    );
  });
});
