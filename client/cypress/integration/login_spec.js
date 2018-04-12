describe("Home", function() {
  before(function() {
    cy.visit("http://localhost:3000");
  }),
    it("should redirect to login page ", () => {
      cy
        .get("[data-cy=login]")
        .click()
        .url()
        .should("eq", "http://localhost:3000/login");
    });
});

describe("happy and unhappy paths", function() {
  beforeEach(function() {
    cy.visit("http://localhost:3000/login");
  });

  it("should show alert error message when both fields are not filled", function() {
    cy.get("button[type=submit]").click();
    cy.get("[data-cy=error]").should("be.visible");
  });

  it("should successfully logs user in when both fields are filled", function() {
    cy
      .get("input#email")
      .type("edam@cheesesticks.com")
      .get("input#password")
      .type("thoughtworks");
    cy
      .get("button[type=submit]")
      .click()
      .url()
      .should("eq", "http://localhost:3000/");
  });

  it("should return an error message if invalid id or password is supplied", () => {
    cy
      .get("input#email")
      .type("alnurfaisal@yahoo.com")
      .get("input#password")
      .type("password")
      .get("button[type=submit]")
      .click()
      .get("[data-cy=error]")
      .should("be.visible")
      .contains("Your email or password is invalid");
  });
});

describe("forget password path", function() {
  it("should successfully direct to forgot password when clicked upon at log in page", function() {
    cy.visit("http://localhost:3000/login");
    cy
      .get('a[href="/forgot"]')
      .click()
      .url()
      .should("eq", "http://localhost:3000/forgot");
  });
});

describe("Reset", () => {
  beforeEach(function() {
    cy.visit("http://localhost:3000/forgot");
  }),
    it("should return success message that email reset is sent", () => {
      cy
        .get("input#email")
        .type("alnurfaisal@outlook.com")
        .get("button[type=submit]")
        .click()
        .get("[data-cy=success]")
        .should("be.visible")
        .contains(
          "An email has been sent to alnurfaisal@outlook.com with further instructions."
        );
    });

  it("should return error message that invalid email was supplied", () => {
    cy
      .get("input#email")
      .type("aaa@outlook.com")
      .get("button[type=submit]")
      .click()
      .get("[data-cy=error]")
      .should("be.visible")
      .contains(
        "The email address aaa@outlook.com is not associated with any account."
      );
  });
});
