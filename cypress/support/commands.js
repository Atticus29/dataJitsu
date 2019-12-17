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
    cy.get('mat-option[id=athlete-1-dropdown]').eq(3).click({force: true});
    // cy.get('mat-option').eq(3).click({force:true})
    cy.get('mat-select[id=athlete2-select]').click({force:true});
    cy.get('mat-option[id=athlete-2-dropdown]').eq(10).click({force: true});
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
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2);
    cy.get('mat-select[id=athlete1-select]').click();
    cy.get('mat-option').eq(1).click({force:true});
    cy.get('input[id=lastFc]').clear().type(cypressConstants.athlete1LastName);
    cy.get('input[id=firstFc]').clear().type(cypressConstants.athlete1FirstName);
    cy.get('button[id=dialog-submit-button]').click();
    cy.get('mat-select[id=athlete2-select]').click();
    cy.get('mat-option').eq(1).click({force: true});
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
  cy.contains('mat-tree-node', 'Advantage').children('button').click({force: true});
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.contains('div[class=mat-ripple]',cypressConstants.defaultAnnotationMoveName).click({force: true});
  });
  cy.contains('Annotation Selected: Advantage Awarded').should('exist');
});

Cypress.Commands.add("selectCrossCollarChoke", () => {
  cy.get('mat-icon').eq(9).click({force:true});
  cy.get('mat-icon').eq(12).click({force:true});
  cy.wait(1000);
  cy.get('div[id=annotationModal]').contains('Cross Collar Choke').first().click();
  cy.get('mat-chip').contains('Cross Collar Choke').should('exist');
});

Cypress.Commands.add("selectDropDown", (selectId, selectOption)=>{
  cy.get(`mat-select[id="${selectId}"`).click().then(() => {
    cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text`).should('contain', selectOption);
    cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text:contains("${selectOption}")`).first().click().then(() => {
      // After click, mat-select should contain the text of the selected option
      cy.get(`mat-select[id="${selectId}"`).contains(selectOption);
    });
  });
});

Cypress.Commands.add("createCustomCervicalChoke", (moveName) => {
  // cy.get('mat-icon').eq(9).click({force:true});
  // cy.get('mat-icon').eq(12).click({force:true});
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.contains('mat-tree-node', cypressConstants.submissionNodeName).children('button').click({force: true});
    cy.contains('mat-tree-node', cypressConstants.moveSubcategoryTitle).children('button').click({force:true});
    cy.contains('mat-tree-node', "Add cervical submission").click();
  });
  // cy.wait(1000);
  // cy.contains('div[id=annotationModal]','Add cervical submission').click();
  cy.get('input[id=moveNameFc]').clear().type(moveName);
  cy.get('mat-select[id=subcategory-name-dropdown]').should('not.be.visible');
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectDropDown('move-category-select', cypressConstants.submissionNodeName);
    cy.selectDropDown('move-subcategory-select', cypressConstants.moveSubcategoryTitle);
  });
  cy.get('button[id=dialog-submit-button]').click();
});

Cypress.Commands.add('deleteMove', (moveName) =>{
  cy.logout();
  cy.loginAsAdmin();
  cy.visit('http://localhost:4200/admin', {timeout: 5000});
  cy.contains('li', moveName).children('span[name=delete-move-name]').click();
})

Cypress.Commands.add('removeAnnotation', (moveName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.get('mat-chip').contains(moveName).should('exist');
  cy.get('mat-chip').contains('mat-chip', moveName).children('span[name=cancel-annotation]').click();
  cy.reload();
  cy.get('mat-chip').contains(moveName).should('not.exist');
});

Cypress.Commands.add('disapproveMove', (moveName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.contains('li',moveName, {timeout: 5000}).should('exist');
  //TODO LEFT OFF HERE
  cy.contains('li',moveName).children('span[name=disapprove-move]').click();
  cy.reload();
  cy.get('li').contains(moveName).should('not.exist');
});

Cypress.Commands.add('approveMove', (moveName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.contains('li',moveName, {timeout: 5000}).should('exist');
  //TODO LEFT OFF HERE
  cy.contains('li',moveName).children('span[name=approve-move]').click();
  cy.reload();
  cy.contains('li',moveName, {timeout: 5000}).should('exist');
});

Cypress.Commands.add("login", (email, pass) => {
  cy.visit('http://localhost:4200/login');
  cy.wait(2000);
  cy.get('button[id=email-dialog-open-button]').click({force:true});
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
  cy.get('button[id=email-dialog-open-button]').click({force:true});
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
