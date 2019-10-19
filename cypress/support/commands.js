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
Cypress.Commands.add("fillInMatchCreationDetails", (email, pass) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl);
    cy.get('mat-select[id=athlete1-select]').click({force: true});
    cy.get('mat-option').eq(3).click({force:true})
    cy.get('mat-select[id=athlete2-select]').click({force:true});
    cy.get('mat-option').eq(4).click({force: true});
    cy.get('input[id=tournamentName]').click({force:true}).clear().type(cypressConstants.testTournament);
    cy.get('input[id=location]').click({force:true}).clear().type(cypressConstants.testLocation);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.get('mat-select[id=gender-select]').click();
    cy.get('mat-option').first().next().click({force:true});
    cy.get('mat-select[id=ageClass]').click();
    cy.get('mat-option').first().next().click({force:true});
    cy.get('mat-select[id=rank]').click();
    cy.get('mat-option').first().next().click({force:true});
    cy.get('mat-select[id=weight]').click();
    cy.get('mat-option').first().next().click({force:true});
  });
});

Cypress.Commands.add("fillInMatchCreationDetailsWithWriteInAthleteNames", (email, pass) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl);
    cy.get('mat-select[id=athlete1-select]').click();
    cy.get('mat-option').first().next().click({force:true});
    cy.get('input[id=lastFc]').clear().type(cypressConstants.athlete1LastName);
    cy.get('input[id=firstFc]').clear().type(cypressConstants.athlete1FirstName);
    cy.get('button[id=dialog-submit-button]').click();
    cy.get('mat-select[id=athlete2-select]').click();
    cy.get('mat-option').first().next().click({force: true});
    cy.get('input[id=lastFc]').clear().type(cypressConstants.athlete2LastName);
    cy.get('input[id=firstFc]').clear().type(cypressConstants.athlete2FirstName);
    cy.get('button[id=dialog-submit-button]').click();
    cy.get('input[id=tournamentName]').click({force:true}).clear().type(cypressConstants.testTournament);
    cy.get('input[id=location]').click({force:true}).clear().type(cypressConstants.testLocation);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.get('mat-select[id=gender-select]').click();
    cy.get('mat-option').first().next().click({force:true});
    cy.get('mat-select[id=ageClass]').click();
    cy.get('mat-option').first().next().click({force:true});
    cy.get('mat-select[id=rank]').click();
    cy.get('mat-option').first().next().click({force:true});
    cy.get('mat-select[id=weight]').click();
    cy.get('mat-option').first().next().click({force:true});
  });
});



Cypress.Commands.add("selectAdvantageAnnotation", () => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('.mat-icon-rtl-mirror').first().click();
    cy.get('div[id=annotationModal]').contains('Advantage Awarded').click();
  });
});

Cypress.Commands.add("selectCrossCollarChoke", () => {
  cy.get('mat-icon').eq(9).click({force:true});
  cy.get('mat-icon').eq(12).click({force:true});
  cy.wait(1000);
  cy.get('div[id=annotationModal]').contains('Cross Collar Choke').first().click();
  cy.get('mat-chip').contains('Cross Collar Choke').should('exist');
});

Cypress.Commands.add("login", (email, pass) => {
  cy.visit('http://localhost:4200/login');
  cy.get('button[id=email-dialog-open-button]').click();
  cy.get('input[id=dialog-email-input]').type(email);
  cy.get('input[id=dialog-pw-input]').type(pass);
  cy.get('button[id=dialog-submit-button]').click();
  cy.wait(1000);
  // cy.contains("Log Out").should('exist');
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
  cy.wait(1000);
});

Cypress.Commands.add("logout", () => {
  cy.wait(500);
  cy.get('button[id=settings-button]').click({force:true});
  cy.wait(500);
  // cy.visit('http://localhost:4200/login');
  cy.get('button[id=logOutLink]').click({force:true});
  cy.wait(1000);
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
