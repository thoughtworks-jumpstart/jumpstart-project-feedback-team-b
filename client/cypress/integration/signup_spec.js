let { User } = require("../seedData/fakeData");
const URL = Cypress.env("baseUrl");

describe("The Signup Page", function() {
  it("succesfully loads sign up page when clicked on the navbar", function() {
    cy.visit(URL);
    cy
      .get("[data-cy=signup]")
      .click()
      .url()
      .should("eq", URL + "signup");
  });
});

describe("error messages for signup page", function() {
  beforeEach(function() {
    cy.visit(URL + "signup");
  });

  it("should not be able to submit a form with empty fields", function() {
    cy.get("button[type=submit]").click();
    cy.get("[data-cy=error]").should("be.visible");
  });

  it("should not be able to submit a form with empty password field", function() {
    cy
      .get("input#name")
      .type("lala")
      .get("input#email")
      .type("bobo@twtw.com");
    cy.get("button[type=submit]").click();
    cy.get("[data-cy=error]").should("be.visible");
  });

  it("should not be able to submit a form with empty email field", function() {
    cy
      .get("input#name")
      .type("roygavin")
      .get("input#password")
      .type("yellowworld");
    cy.get("button[type=submit]").click();
    cy.get("[data-cy=error]").should("be.visible");
  });

  it("should not be able to submit a form with empty name field", function() {
    cy
      .get("input#email")
      .type("roygavin@wtwt.com")
      .get("input#password")
      .type("yelloo123");
    cy.get("button[type=submit]").click();
    cy.get("[data-cy=error]").should("be.visible");
  });

  it("should not be able to register if email supplied has been registerd before", function() {
    cy
      .get("input#name")
      .type("alnur")
      .get("input#email")
      .type("edam@cheesesticks.com")
      .get("input#password")
      .type("password")
      .get("button[type=submit]")
      .click()
      .get("[data-cy=error]")
      .should("be.visible")
      .contains(
        "The email address you have entered is already associated with another account."
      );
  });

  it("should successfuly register user if details are entered properly", () => {
    cy
      .get("input#name")
      .type(User.name)
      .get("input#email")
      .type(User.email)
      .get("input#password")
      .type(User.password)
      .get("button[type=submit]")
      .click()
      .url()
      .should("eq", URL);
  });
});
