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

    cy.get("input.form-control").first().invoke("val", "New Goal Title");
    cy.get("textarea.form-control")
      .first()
      .invoke("val", "New Goal Description");

    cy.get("form").submit();

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

    cy.get("button").contains("Bearbeiten").first().click();

    cy.get("input.form-control")
      .first()
      .clear()
      .invoke("val", "Updated Goal Title");
    cy.get("textarea.form-control")
      .first()
      .clear()
      .invoke("val", "Updated Goal Description");

    cy.get("form").submit();

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

    cy.get("button").contains("Löschen").click();
    cy.contains("Updated Goal Title").should("not.exist");
  });
});
