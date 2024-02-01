Cypress.on("uncaught:exception", () => {
  return false;
});
describe("Login Functionality", () => {
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.wait(1000);
    cy.contains("Logout").click();
  });

  it("successfully logs in with valid credentials", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').invoke("val", "erik.klein@patient.com");
    cy.get('input[name="password"]').invoke("val", "Recover123!");

    cy.get("form").submit();

    cy.url().should("not.include", "/login");
  });
});

describe("Login Functionality Negative Test", () => {
  it("fails to log in with invalid credentials", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').invoke("val", "invaliduser@example.com");
    cy.get('input[name="password"]').invoke("val", "wrongpassword");

    cy.get("form").submit();

    cy.url().should("include", "/login");
  });
});

describe("Login as a therapist user", () => {
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.wait(1000);
    cy.contains("Logout").click();
  });

  it("successfully logs in as a therapist", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').invoke("val", "anna.bauer@therapy.com");
    cy.get('input[name="password"]').invoke("val", "Therapy123!");

    cy.get("form").submit();

    cy.url().should("not.include", "/login");
  });
});
