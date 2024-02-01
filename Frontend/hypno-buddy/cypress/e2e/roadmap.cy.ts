Cypress.on("uncaught:exception", () => {
  return false;
});
describe("QueueView Goal Creation", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').invoke("val", "erik.klein@patient.com");
    cy.get('input[name="password"]').invoke("val", "Recover123!");

    cy.get("form").submit();
    //cy.url().should('not.include', '/login');
    cy.wait(500);

    cy.visit("http://localhost:5173/roadmap");
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.wait(1000);
    cy.contains("Logout").click();
  });

  it("allows a user to create a new goal", () => {
    cy.get("button").contains("Bearbeiten").click();
    cy.url().should("include", "/goalQueueView");

    cy.get("button").contains("+ neues Ziel").click();

    cy.get("input.form-control").first().type("New Goal Title");
    cy.get("textarea.form-control").first().type("New Goal Description");

    cy.wait(1500);
    cy.get("button").contains("Hinzufügen").click();

    cy.contains("New Goal Title").should("be.visible");
  });
});

describe("QueueView Edit Goal", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').invoke("val", "erik.klein@patient.com");
    cy.get('input[name="password"]').invoke("val", "Recover123!");

    cy.get("form").submit();
    //cy.url().should('not.include', '/login');
    cy.wait(500);

    cy.visit("http://localhost:5173/roadmap");
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.wait(1000);
    cy.contains("Logout").click();
  });

  it("allows a user to edit a goal", () => {
    cy.get("button").contains("Bearbeiten").click();
    cy.url().should("include", "/goalQueueView");

    cy.get('[class^="btn btn-secondary _btnEditCustom_8u0ig_37"]').first().click();

    cy.get("input.form-control").first().clear().type("Updated Goal Title");
    cy.get("textarea.form-control")
      .first()
      .clear()
      .type("Updated Goal Description");

    cy.wait(1500);
    cy.get("button").contains("Speichern").click();

    cy.contains("Updated Goal Title").should("be.visible");
  });
});

describe("QueueView Delete Goal", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').invoke("val", "erik.klein@patient.com");
    cy.get('input[name="password"]').invoke("val", "Recover123!");

    cy.get("form").submit();
    //cy.url().should('not.include', '/login');
    cy.wait(500);

    cy.visit("http://localhost:5173/roadmap");
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.wait(1000);
    cy.contains("Logout").click();
  });

  it("allows a user to delete a goal", () => {
    cy.get("button").contains("Bearbeiten").click();
    cy.url().should("include", "/goalQueueView");
    
    cy.get('[class^="btn btn-danger _btnDeleteCustom_8u0ig_25"]').first().click();

    cy.contains("Updated Goal Title").should("not.exist");
  });
});
