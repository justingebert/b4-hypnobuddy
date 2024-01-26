describe('Login Functionality', () => {
    it('successfully logs in with valid credentials', () => {
      cy.visit('http://localhost:5173/login'); 
  
      cy.get('input[name="email"]').type('johndoe@example.com'); 
      cy.get('input[name="password"]').type('password123'); 
  
      cy.get('form').submit();
  
      cy.url().should('not.include', '/login'); 
    });
  });

describe('Login Functionality', () => {
    it('fails to log in with invalid credentials', () => {
      cy.visit('http://localhost:5173/login');
  
      cy.get('input[name="email"]').type('invaliduser@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
  
      cy.get('form').submit();
  
      cy.url().should('include', '/login');
    });
  });
  