// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
Cypress.Commands.add("login", (email, pass) => {
  cy.visit('http://localhost:4200/login');
  cy.get('button[id=email-dialog-open-button]').click();
  cy.get('input[id=dialog-email-input]').type(email);
  cy.get('input[id=dialog-pw-input]').type(pass);
  cy.get('button[id=dialog-submit-button]').click();
  cy.wait(1000);
  cy.contains("Log Out").should('exist');
  cy.contains("Rank").should('exist');
});

Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit('http://localhost:4200/login');
  cy.wait(2000);
  cy.get('button[id=email-dialog-open-button]').click();
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=dialog-email-input]').type(cypressConstants.adminEmailAddress);
    cy.get('input[id=dialog-pw-input]').type(cypressConstants.adminPassword);
  });
  cy.get('button[id=dialog-submit-button]').click();
});

Cypress.Commands.add("logout", () => {
  // cy.visit('http://localhost:4200/login');
  cy.get('a[id=logOutLink]').click({force:true});
  cy.get('button[id=email-dialog-open-button]').should('exist');
});
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
