Cypress.on("uncaught:exception", () => {
  return false;
});
describe("DosAndDontsPatientPage Slider", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').invoke("val", "erik.klein@patient.com");
    cy.get('input[name="password"]').invoke("val", "Recover123!");

    cy.get("form").submit();
    //cy.url().should('not.include', '/login');
    cy.wait(500);

    cy.visit("http://localhost:5173/dosanddonts/p");
  });
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.wait(1000);
    cy.contains("Logout").click();
  });
  it("toggles between dos and donts", () => {
    cy.get("#dos").should("be.visible");
    //cy.get('#donts').should('not.be.visible');

    cy.get('[data-testid="slider-rectangle"]').click();

    cy.get("#donts").should("be.visible");
    //cy.get('#dos').should('not.be.visible');
  });
});
