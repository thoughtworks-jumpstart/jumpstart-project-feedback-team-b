let { User } = require("../seedData/fakeData");
const URL = Cypress.env("baseUrl");

describe("Private Route to redirect to login page when user not logged in and updating of profile page userid", function() {
  let username = User.name;
  let useremail = User.email;
  let userpassword = User.password;
  it("should not allow user to access profile page but redirect to login", function() {
    cy.visit(URL + "account");
    cy.url().should("eq", URL + "login");
    cy
      .get("[data-cy=sign-up]")
      .click()
      .url()
      .should("eq", URL + "signup");
    cy
      .get("input#name")
      .type(username)
      .get("input#email")
      .type(useremail)
      .get("input#password")
      .type(userpassword)
      .get("button[type=submit]")
      .click()
      .url()
      .should("eq", URL);
  });
  it("should display updated username on top menu bar after Roy updates", function() {
    cy.get("[data-cy=profile]").click();
    cy.get('a[href="/account"]').click();
    cy
      .get("[data-cy=profile-name]")
      .get('[type="text"]')
      .clear()
      .type("yongming")
      .get("[data-cy=update-profile]")
      .click()
      .get("[data-cy=success]")
      .should("be.visible")
      .contains("Your profile is updated successfully.");
    cy.get("[data-cy=profile]").contains("yongming");
  });
});
