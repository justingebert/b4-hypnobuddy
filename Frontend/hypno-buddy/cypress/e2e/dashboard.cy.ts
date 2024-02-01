Cypress.on("uncaught:exception", () => {
  return false;
});
describe("Dashboard Functionality", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').invoke("val", "erik.klein@patient.com");
    cy.get('input[name="password"]').invoke("val", "Recover123!");

    cy.wait(1000);

    cy.get("form").submit();

    cy.url().should("not.include", "/login");
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.wait(1000);
    cy.get("button").contains("Logout").click();
  });

  it("successfully checks button Reflexion and url /reflexion-add in dashboard", () => {
    cy.get("button").contains("Reflexion").click();
    cy.url().should("include", "/reflexion-add");
  });

  it("successfully checks button Dos & Don'ts and url /dosanddonts in dashboard", () => {
    cy.get("button").contains("Dos & Don'ts").click();
    cy.url().should("include", "/dosanddonts");
  });

  it("successfully checks button Roadmap and url /roadmap in dashboard", () => {
    cy.get("button").contains("Roadmap").click();
    cy.url().should("include", "/roadmap");
  });
});
