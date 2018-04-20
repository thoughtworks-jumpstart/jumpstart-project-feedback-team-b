const URL = Cypress.env("baseUrl");
const { User } = require("../seedData/fakeData");

describe("mydashboard renders different feedback components", function() {
  let username = User.name;
  let useremail = User.email;
  let userpassword = User.password;
  before(function() {
    cy.visit(URL + "signup");
    cy
      .get("input#name")
      .type(username)
      .get("input#email")
      .type(useremail)
      .get("input#password")
      .type(userpassword)
      .get("[data-cy=signUp-submit]")
      .click();
  });

  it("should display feedback form when path is /mydashboard/initiate", function() {
    cy.visit(URL + "mydashboard/initiate");
    cy
      .get("input#email")
      .type(useremail)
      .get("input#password")
      .type(userpassword);
    cy.get("[data-cy=login-submit]").click();
    cy
      .get("#qa-templateform")
      .find("form")
      .contains("Receiver's email address:");
    cy
      .get("#qa-templateform")
      .find("form")
      .contains("You are doing great at...");
    cy
      .get("#qa-templateform")
      .find("form")
      .contains("You could work on/improve...");
    cy
      .get("#qa-templateform")
      .find("form")
      .contains("Suggestions...");
  });

  it("should display request feedback form when path is /mydashboard/request", function() {
    cy.visit(URL + "mydashboard/request");
    cy
      .get("input#email")
      .type(useremail)
      .get("input#password")
      .type(userpassword);
    cy.get("[data-cy=login-submit]").click();
    cy
      .get("[data-cy=qa-requestfb]")
      .find("form")
      .contains("Add email address");
    cy
      .get("[data-cy=qa-requestfb]")
      .find("form")
      .contains("You are doing great at...");
    cy
      .get("[data-cy=qa-requestfb]")
      .find("form")
      .contains("You could work on/improve...");
    cy
      .get("[data-cy=qa-requestfb]")
      .find("form")
      .contains("Suggestions...");
  });
});
