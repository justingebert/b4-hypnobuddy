Cypress.on("uncaught:exception", () => {
  return false;
});
describe("User Registration", () => {
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    // cy.contains('Logout').click();
  });
  it("registers a new user", () => {
    cy.visit("http://localhost:5173/register");

    cy.get('input[name="first"]').invoke("val", "John");
    cy.get('input[name="last"]').invoke("val", "Doe");
    cy.get('input[name="email"]').invoke("val", "johndoe@example.com");
    cy.get('input[name="password"]').invoke("val", "password123");

    // cy.wait(2000);
    // cy.get("form").submit();

    // cy.url().should("include", "/login");
  });
});

describe("Existing User Registration", () => {
  it("can not register an existing user", () => {
    cy.visit("http://localhost:5173/register");

    cy.get('input[name="first"]').invoke("val", "John");
    cy.get('input[name="last"]').invoke("val", "Doe");
    cy.get('input[name="email"]').invoke("val", "johndoe@example.com");
    cy.get('input[name="password"]').invoke("val", "password123");

    cy.wait(2000);
    cy.get("form").submit();

    cy.url().should("include", "/register");
  });
});
