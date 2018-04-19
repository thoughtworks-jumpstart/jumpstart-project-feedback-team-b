const URL = Cypress.env("baseUrl");
const { User, ExistingUser } = require("../seedData/fakeData");

describe("Request Feedback tests", function() {
  before(function() {
    cy.visit(URL + "signup");
    cy
      .get("input#name")
      .type(User.name)
      .get("input#email")
      .type(User.email)
      .get("input#password")
      .type(User.password)
      .get("[data-cy=signUp-submit]")
      .click();

    cy.visit(URL + "signup");
    cy
      .get("input#name")
      .type(ExistingUser.name)
      .get("input#email")
      .type(ExistingUser.email)
      .get("input#password")
      .type(ExistingUser.password)
      .get("[data-cy=signUp-submit]")
      .click();
  });
  beforeEach(function() {
    cy.visit(URL + "login");
    cy
      .get("input#email")
      .type(User.email)
      .get("input#password")
      .type(User.password);
    cy.get("[data-cy=login-submit]").click();
    cy.get("[data-cy=qa-requestfeedback-link]").click({ force: true });
  });

  it("should successfully request feedback when valid Email is entered", function() {
    cy.get("[data-cy=RequestFeedbackForm_emailInput]").type(ExistingUser.email);
    cy.get("[data-cy=requestFeedback-submit]").click();
    cy.get("[data-cy=info]").should("be.visible");
  });

  it("should give an error message when an invalid email is entered", () => {
    cy
      .get("[data-cy=RequestFeedbackForm_emailInput]")
      .type("invalidEmail@email.com");
    cy.get("[data-cy=requestFeedback-submit]").click();
    cy.get("[data-cy=error]").should("be.visible");
  });
});
