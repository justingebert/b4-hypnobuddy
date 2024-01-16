describe('Login Functionality', () => {
    it('successfully logs in with valid credentials', () => {
      cy.visit('http://localhost:5173/login'); // Replace with the correct URL if different
  
      // Fill in the login form
      cy.get('input[name="email"]').type('johndoe@example.com'); // Replace with valid credentials
      cy.get('input[name="password"]').type('password123'); // Replace with valid credentials
  
      // Submit the login form
      cy.get('form').submit();
  
      // Assert that the user is redirected to the dashboard or another page after successful login
      cy.url().should('not.include', '/login'); // Replace '/dashboard' with the actual redirect URL
    });
  });

describe('Login Functionality', () => {
    it('fails to log in with invalid credentials', () => {
      cy.visit('http://localhost:5173/login'); // Replace with the correct URL if different
  
      // Fill in the login form with invalid credentials
      cy.get('input[name="email"]').type('invaliduser@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
  
      // Submit the login form
      cy.get('form').submit();
  
      // Assert that the user is not redirected, remains on the login page
      cy.url().should('include', '/login');
  
      // You can also check for a specific error message, if your application displays one
      // cy.contains('Invalid credentials').should('be.visible'); // Replace with the actual error message
    });
  });
  