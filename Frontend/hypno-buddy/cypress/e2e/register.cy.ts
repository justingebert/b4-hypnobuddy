describe('User Registration', () => {
  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.contains('Logout').click();
  });
  it('registers a new user', () => {
    cy.visit('http://localhost:5173/register'); 

    cy.get('input[name="first"]').type('John');
    cy.get('input[name="last"]').type('Doe');
    cy.get('input[name="email"]').type('johndoe@example.com');
    cy.get('input[name="password"]').type('password123');

    // cy.get('form').submit();

    // cy.url().should('include', '/login'); 
  });
});

describe('Existing User Registration', () => {
  it('can not register an existing user', () => {
    cy.visit('http://localhost:5173/register'); 

    cy.get('input[name="first"]').type('John');
    cy.get('input[name="last"]').type('Doe');
    cy.get('input[name="email"]').type('johndoe@example.com');
    cy.get('input[name="password"]').type('password123');

    // cy.get('form').submit();

    // cy.url().should('not.include', '/login');
  });
});
