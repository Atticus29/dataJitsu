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
// declare namespace Cypress {
//   interface Chainable<Subject> {
//     myCustomCommand(value: string): Chainable<Subject>
//   }
// }
// declare namespace Cypress {
//   interface Chainable<Subject> {
//     logout(): Chainable<undefined>;
//     login(email: string, pw: string): Chainable<undefined>;
//   }
// }

// function logout(): Cypress.Chainable<any>{
//   return cy.get('a[id=logOutLink]').click();
// }
// -- This is a parent command --


Cypress.Commands.add('login', (email: string, pw: string) => {
  cy.visit('/login');
  cy.get('input[id=userEmail]').type(email);
  cy.get('input[id=password]').type(pw);
  return cy.get('button[id=loginSubmit]').click();
});

Cypress.Commands.add('logout', () => {
  cy.get('a[id=logOutLink]').click(); //return
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
