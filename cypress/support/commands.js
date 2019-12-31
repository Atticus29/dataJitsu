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

Cypress.Commands.add('deleteMatch', (identifyingId) =>{
  cy.logout();
  cy.loginAsAdmin();
  cy.get('div[class=mat-select-arrow]', {timeout:5000}).click({force:true});
  cy.contains('span[class=mat-option-text]','500').click({force:true});
  cy.wait(2000);
  cy.get(`mat-cell[id="${identifyingId}"]>button`, {timeout:5000}).click({force:true});
});

Cypress.Commands.add('checkThatCustomMoveHasBeenRenamed', () =>{
  //assumes logged in as admin
  cy.visit('http://localhost:4200/matches');
  cy.get('a[name=videoClick]').first().click({force:true});
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.contains('span',cypressConstants.moveNameRemovedMessage).should('exist');
    cy.contains('span','Darth Vader Choke').should('not.exist');
  });
});

Cypress.Commands.add('removeNowRenamedAnnotation', () =>{
  //assumes logged in as admin
  cy.get('a[name=videoClick]').first().click({force:true});
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.removeAnnotation(cypressConstants.moveNameRemovedMessage);
  });
});

Cypress.Commands.add("fillInMatchCreationDetails", (email, pass) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl);
    cy.selectAthlete(1, "Batista de Sousa, Gabriel");
    cy.selectAthlete(2, "Diógenes de Aquino, Thamires");
    cy.selectTournament("IBJJF Gi World Jiu-Jitsu Championship");
    cy.get('input[id=location]').click({force:true}).clear().type(cypressConstants.testLocation);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.get('mat-select[id=gender-select]').click({force:true});
    cy.get('mat-option').first().next().click({force:true});
    cy.get('mat-select[id=ageClass]').click({force:true});
    cy.get('mat-option').first().next().click({force:true});
    cy.selectAgeClass('Master 1');
    cy.selectRank("Elite");
    cy.selectWeight("-66kg");
  });
});

Cypress.Commands.add("selectRank", (rankName) =>{
  cy.selectDropDown("rank-select", rankName);
});

Cypress.Commands.add("selectAgeClass", (ageClassName) =>{
  cy.selectDropDown("ageClass", ageClassName);
});

Cypress.Commands.add("selectWeight", (weightClassName) =>{
  cy.selectDropDown("weight-class-select", weightClassName);
});

Cypress.Commands.add("selectTournament", (tournamentName) =>{
  cy.selectDropDown("tournament-select", tournamentName);
});

Cypress.Commands.add("selectAthlete", (number, athleteName) =>{
  cy.selectDropDown("athlete" + number + "-select", athleteName);
});

Cypress.Commands.add("fillInMatchCreationDetailsWithCustomTournamentName", (customTournamentName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2, {timeout:5000});
    cy.selectAthlete(1, "Batista de Sousa, Gabriel");
    cy.selectAthlete(2, "Diógenes de Aquino, Thamires");
    cy.selectCustomTournament(customTournamentName);
    cy.get('input[id=location]').click({force:true}).clear().type(cypressConstants.testLocation);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.get('mat-select[id=gender-select]').click({force:true});
    cy.get('mat-option').first().next().click({force:true});
    cy.selectAgeClass('Master 1');
    cy.selectRank("Elite");
    cy.selectWeight("-66kg");
  });
});

Cypress.Commands.add("selectCustomTournament", (tournamentName) => {
  cy.selectCustomGenericParameter("tournament-select", "custom-tournament-button", 'tournamentNameFc', tournamentName, 'dialog-submit-button');
});

Cypress.Commands.add("selectCustomGenericParameter", (matSelectName, addNewButtonId, inputId, writeInName, submitButtonId) => {
  // cy.selectDropDown(matSelectName, addNewButtonName);
  cy.get(`mat-select[id="${matSelectName}"`).click({force:true}).then(() => {
    cy.get(`button[id=${addNewButtonId}]`).click({force:true, timeout:5000});
    cy.get(`input[id="${inputId}"]`).clear().type(writeInName);
    cy.get(`button[id="${submitButtonId}"]`).click({force:true, timeout:5000});
  });
});


Cypress.Commands.add("fillInMatchCreationDetailsWithWriteInAthleteNames", (email, pass) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2);
    cy.get('mat-select[id=athlete1-select]').click({force:true});
    cy.get('mat-option').eq(1).click({force:true});
    cy.get('input[id=lastFc]').clear().type(cypressConstants.athlete1LastName);
    cy.get('input[id=firstFc]').clear().type(cypressConstants.athlete1FirstName);
    cy.get('button[id=dialog-submit-button]').click({force:true});
    cy.get('mat-select[id=athlete2-select]').click({force:true});
    cy.get('mat-option').eq(1).click({force: true});
    cy.get('input[id=lastFc]').clear().type(cypressConstants.athlete2LastName);
    cy.get('input[id=firstFc]').clear().type(cypressConstants.athlete2FirstName);
    cy.get('button[id=dialog-submit-button]').click({force:true});
    cy.selectTournament("IBJJF Gi World Jiu-Jitsu Championship");
    cy.get('input[id=location]').click({force:true}).clear().type(cypressConstants.testLocation);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.get('mat-select[id=gender-select]').click({force:true});
    cy.get('mat-option').first().next().click({force:true});
    cy.selectAgeClass('Master 1');
    cy.selectRank("Elite");
    cy.selectWeight("-66kg");
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
  cy.get('div[id=annotationModal]').contains('Cross Collar Choke').first().click({force:true});
  cy.get('mat-chip').contains('Cross Collar Choke').should('exist');
});

Cypress.Commands.add("selectDropDown", (selectId, selectOption)=>{
  cy.get(`mat-select[id="${selectId}"`).click({timeout:5000}).then(() => {
    cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text`).should('contain', selectOption);
    cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text:contains("${selectOption}")`).first().click({timeout:5000}).then(() => {
      // After click, mat-select should contain the text of the selected option
      cy.get(`mat-select[id="${selectId}"`).contains(selectOption);
    });
  });
});

Cypress.Commands.add("createCustomCervicalChoke", (moveName) => {
  // cy.get('mat-icon').eq(9).click({force:true});
  // cy.get('mat-icon').eq(12).click({force:true});
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.contains('mat-tree-node', cypressConstants.submissionNodeName, {timeout:5000}).children('button').click({force: true, timeout:5000});
    cy.contains('mat-tree-node', cypressConstants.moveSubcategoryTitle, {timeout:5000}).children('button').click({force:true, timeout:5000});
    cy.contains('mat-tree-node', "Add cervical submission").click({force:true});
  });
  // cy.wait(1000);
  // cy.contains('div[id=annotationModal]','Add cervical submission').click({force:true});
  cy.get('input[id=moveNameFc]').clear().type(moveName);
  cy.contains('span', 'Choose Move Subcategory').should('not.be.visible');
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectDropDown('move-category-select', cypressConstants.submissionNodeName);
    cy.contains('span', 'Choose Move Subcategory').should('be.visible');
    cy.selectDropDown('move-subcategory-select', cypressConstants.moveSubcategoryTitle);
  });
  cy.get('button[id=dialog-submit-button]').click({force:true});
});

Cypress.Commands.add('deleteMove', (moveName) =>{
  cy.logout();
  cy.loginAsAdmin();
  cy.visit('http://localhost:4200/admin', {timeout: 5000});
  cy.contains('li', moveName, {timeout: 5000}).children('span[name=delete-move-name]').click({force:true});
});

Cypress.Commands.add('deleteGeneric', (genericName) =>{
  cy.logout();
  cy.loginAsAdmin();
  cy.visit('http://localhost:4200/admin', {timeout: 5000});
  cy.contains('li', genericName, {timeout: 5000}).children('span[name=delete-move-name]').click({force:true});
});

Cypress.Commands.add('removeAnnotation', (moveName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.get('mat-chip').contains(moveName).should('exist');
  cy.get('mat-chip').contains('mat-chip', moveName).children('span[name=cancel-annotation]').click({force:true});
  cy.reload();
  cy.get('mat-chip').contains(moveName).should('not.exist');
});

Cypress.Commands.add('disapproveMove', (moveName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.contains('li',moveName, {timeout: 5000}).should('exist');
  cy.contains('li',moveName).children('span[name=disapprove-move]').click({force:true});
  cy.reload();
  cy.get('li').contains(moveName).should('not.exist');
});

Cypress.Commands.add('disapproveGeneric', (genericName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.contains('li',genericName, {timeout: 5000}).should('exist');
  cy.contains('li',genericName).children('span[name=disapprove-move]').click({force:true});
  cy.reload();
  cy.get('li').contains(genericName).should('not.exist');
});

Cypress.Commands.add('approveMove', (moveName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.contains('li',moveName, {timeout: 5000}).should('exist');
  //TODO LEFT OFF HERE
  cy.contains('li',moveName).children('span[name=approve-move]').click({force:true});
  cy.reload();
  cy.contains('li',moveName, {timeout: 5000}).should('exist');
});

Cypress.Commands.add('approveGeneric', (genericName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin", {timeout:5000}).should('exist');
  cy.contains('li',genericName, {timeout: 5000}).should('exist');
  //TODO LEFT OFF HERE
  cy.contains('li',genericName).children('span[name=approve-move]').click({force:true});
  cy.reload();
  cy.contains('li',genericName, {timeout: 5000}).should('exist');
});

Cypress.Commands.add("login", (email, pass) => {
  cy.visit('http://localhost:4200/login');
  cy.wait(2000);
  cy.get('button[id=email-dialog-open-button]').click({force:true});
  cy.get('input[id=dialog-email-input]').type(email);
  cy.get('input[id=dialog-pw-input]').type(pass);
  cy.get('button[id=dialog-submit-button]').click({force:true});
  cy.wait(1000);
  // cy.contains("Log Out").should('exist');
  cy.contains("Rank",{timeout:5000}).should('exist');
});

Cypress.Commands.add("loginAsAdmin", () => {
  cy.visit('http://localhost:4200/login');
  cy.wait(2000);
  cy.get('button[id=email-dialog-open-button]').click({force:true});
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=dialog-email-input]').type(cypressConstants.adminEmailAddress);
    cy.get('input[id=dialog-pw-input]').type(cypressConstants.adminPassword);
  });
  cy.get('button[id=dialog-submit-button]', {timeout:5000}).click({force:true});
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
