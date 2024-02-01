Cypress.on("uncaught:exception", () => {
  return false;
});
describe("Reflexion Functionality", () => {
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
    cy.get("button").contains("Logout").click();
  });

  it("successfully saves reflection of a patient in system and deletes it", () => {
    cy.get("button").contains("Reflexion").click();
    cy.url().should("include", "/reflexion-add");
    cy.get('[class^="moodButton"]')
      .eq(0)
      .should("exist")
      .invoke("mouseover")
      .click();
    cy.url().should("include", "/reflexion-description");
    cy.get("button").contains("Ja").click();
    cy.get('[class^="inputText"]').should("exist").invoke("val", "test");
    cy.wait(1000);
    cy.get("button").contains("Speichern").should("exist").click();
    cy.url().should("include", "/reflexion-deep-dive");
    cy.get("button").contains("Ja").click();
    cy.get("button").contains("Andere Frage").should("exist").click();
    cy.get('[class^="inputText"]').should("exist").invoke("val", "test1");
    cy.wait(1000);
    cy.get("button").contains("Speichern").should("exist").click();
    cy.url().should("include", "/reflexion-final");
    cy.get("button").contains("Neuer Eintrag").should("exist");
    cy.get("button").contains("Frühere Einträge").should("exist").click();
    cy.url().should("include", "/previous-reflexions");
    cy.get('[class^="singleEntry"]').should("exist");
    cy.get('[class^="eintrag"]').contains("test").should("exist");
    cy.get('[class^="eintrag"]').contains("test1").should("exist");
    cy.get("button").contains("Löschen").should("exist").click();
    cy.get(".dateEntry > .singleEntry > button")
      .contains("Löschen")
      .should("exist")
      .click();
    cy.get("button").contains("Ja").should("exist").click();
  });
});
