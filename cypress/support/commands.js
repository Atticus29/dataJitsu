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

Cypress.Commands.add('endMove', (identifyingId) =>{
  cy.get('button[id=end-move]').should('be.enabled');
  // cy.get('button[id=end-move]').trigger('mouseover').click(); //{force:true}, {timeout:50000}
  cy.get('button[id=end-move]').pipe($el => $el.click()) // try this
  // .pipe(
  //   // next line will make assertions on the element returned by this pipe
  //   () => cy.get(calculatorScreen.resultOutput.idLocator)
  // )
  // .should("contain", "0");
});


Cypress.Commands.add('deleteMatch', (identifyingId) =>{
  cy.logout();
  cy.loginAsAdmin();
  cy.wait(2000);
  cy.get('div[class=mat-select-arrow]', {timeout:5000}).click({force:true});
  cy.contains('span[class=mat-option-text]','500').click({force:true});
  cy.wait(2000);
  cy.get(`mat-cell[id="${identifyingId}"]>button`, {timeout:5000}).first().click({force:true});
});

Cypress.Commands.add('checkThatCustomMoveHasBeenRenamed', () =>{
  //assumes logged in as admin
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.visit(cypressConstants.allVideosUrl);
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.contains('span',cypressConstants.eventNameRemovedMessage).should('exist');
    cy.contains('span','Darth Vader Choke').should('not.exist');
  });
});

Cypress.Commands.add('removeNowRenamedAnnotation', () =>{
  //assumes logged in as admin
  cy.get('a[name=videoClick]').first().click({force:true});
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.removeAnnotation(cypressConstants.eventNameRemovedMessage);
  });
});

Cypress.Commands.add("fillInMatchCreationDetails", (email, pass) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl);
    cy.selectAthlete(1, cypressConstants.defaultAthlete1Name);
    cy.selectAthlete(2, cypressConstants.defaultAthlete2Name);
    cy.selectTournament(cypressConstants.defaultTournamentName);
    cy.selectCustomLocation(cypressConstants.testLocation);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.selectGender(cypressConstants.defaultGenderName);
    cy.selectAgeClass(cypressConstants.defaultAgeClass);
    cy.selectRank(cypressConstants.defaultNoGiRank);
    cy.selectWeight(cypressConstants.defaultWeightClass);
  });
});

Cypress.Commands.add("selectGender", (genderName) =>{
  cy.selectDropDown("gender-select", genderName);
});

Cypress.Commands.add("selectRank", (rankName) =>{
  cy.selectDropDown("rank-select", rankName);
});

Cypress.Commands.add("selectAgeClass", (ageClassName) =>{
  cy.selectDropDown("age-class-select", ageClassName);
});

Cypress.Commands.add("selectWeight", (weightClassName) =>{
  cy.selectDropDown("weight-class-select", weightClassName);
});

Cypress.Commands.add("selectTournament", (tournamentName) =>{
  cy.selectDropDown("tournament-select", tournamentName);
});

Cypress.Commands.add("selectLocation", (locationName) =>{
  cy.selectDropDown("location-select", locationName);
});

Cypress.Commands.add("selectAthlete", (number, athleteName) =>{
  cy.selectDropDown("athlete" + number + "-select", athleteName);
});

Cypress.Commands.add("fillInMatchCreationDetailsWithCustomTournamentName", (customTournamentName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2, {timeout:5000});
    cy.selectAthlete(1, cypressConstants.defaultAthlete1Name);
    cy.selectAthlete(2, cypressConstants.defaultAthlete2Name);
    cy.selectCustomTournament(customTournamentName);
    cy.selectCustomLocation(cypressConstants.testLocation5);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.selectGender(cypressConstants.defaultGenderName);
    cy.selectAgeClass(cypressConstants.defaultAgeClass);
    cy.selectRank(cypressConstants.defaultNoGiRank);
    cy.selectWeight(cypressConstants.defaultWeightClass);
  });
});

Cypress.Commands.add("fillInMatchCreationDetailsWithCustomWeightClass", (customWeightClassName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2, {timeout:5000});
    cy.selectAthlete(1, cypressConstants.defaultAthlete1Name);
    cy.selectAthlete(2, cypressConstants.defaultAthlete2Name);
    cy.selectTournament(cypressConstants.defaultTournamentName);
    cy.selectCustomLocation(cypressConstants.testLocation6);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.selectGender(cypressConstants.defaultGenderName);
    cy.selectAgeClass(cypressConstants.defaultAgeClass);
    cy.selectRank(cypressConstants.defaultNoGiRank);
    cy.selectCustomWeightClass(customWeightClassName);
  });
});

Cypress.Commands.add("fillInMatchCreationDetailsWithCustomNoGiRank", (customNoGiRankName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2, {timeout:5000});
    cy.selectAthlete(1, cypressConstants.defaultAthlete1Name);
    cy.selectAthlete(2, cypressConstants.defaultAthlete2Name);
    cy.selectTournament(cypressConstants.defaultTournamentName);
    cy.selectCustomLocation(cypressConstants.testLocation4);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.selectGender(cypressConstants.defaultGenderName);
    cy.selectAgeClass(cypressConstants.defaultAgeClass);
    cy.selectCustomNoGiRank(cypressConstants.customNoGiRankName);
    cy.selectWeight(cypressConstants.defaultWeightClass);
  });
});

Cypress.Commands.add("fillInMatchCreationDetailsWithCustomAgeClass", (customAgeClass) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2, {timeout:5000});
    cy.selectAthlete(1, cypressConstants.defaultAthlete1Name);
    cy.selectAthlete(2, cypressConstants.defaultAthlete2Name);
    cy.selectTournament(cypressConstants.defaultTournamentName);
    cy.selectCustomLocation(cypressConstants.testLocation2);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.selectGender(cypressConstants.defaultGenderName);
    cy.selectCustomAgeClass(customAgeClass);
    cy.selectRank(cypressConstants.defaultNoGiRank);
    cy.selectWeight(cypressConstants.defaultWeightClass);
  });
});

Cypress.Commands.add("fillInMatchCreationDetailsWithCustomLocation", () => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2, {timeout:5000});
    cy.selectAthlete(1, cypressConstants.defaultAthlete1Name);
    cy.selectAthlete(2, cypressConstants.defaultAthlete2Name);
    cy.selectTournament(cypressConstants.defaultTournamentName);
    cy.selectCustomLocation(cypressConstants.customLocation);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.selectGender(cypressConstants.defaultGenderName);
    cy.selectAgeClass(cypressConstants.defaultAgeClass);
    cy.selectRank(cypressConstants.defaultNoGiRank);
    cy.selectWeight(cypressConstants.defaultWeightClass);
  });
});


Cypress.Commands.add("selectCustomTournament", (tournamentName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectCustomGenericParameter(cypressConstants.tournamentSelectName, "custom-tournament-button", 'tournamentNameFc', tournamentName, 'dialog-submit-button');
  });
});

Cypress.Commands.add("selectCustomLocation", (locationName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectCustomGenericParameter(cypressConstants.locationNameSelect, "custom-location-button", 'locationNameFc', locationName, 'dialog-submit-button');
  });
});

Cypress.Commands.add("selectCustomWeightClass", (weightClassName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectCustomGenericParameter(cypressConstants.weightClassSelectName, "custom-weight-class-button", 'weightClassNameFc', weightClassName, 'dialog-submit-button');
  });
});

Cypress.Commands.add("selectCustomNoGiRank", (noGiRankName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectCustomGenericParameter(cypressConstants.noGiRankSelectName, "custom-no-gi-rank-button", 'noGiRankNameFc', noGiRankName, 'dialog-submit-button');
  });
});

Cypress.Commands.add("selectCustomAgeClass", (ageClassName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectCustomGenericParameter(cypressConstants.ageClassSelectName, "custom-age-class-button", 'ageClassNameFc', ageClassName, 'dialog-submit-button');
  });
});

Cypress.Commands.add("selectCustomAthleteNames", (athlete1NameFirst, athlete1NameLast, athlete2NameFirst, athlete2NameLast) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectCustomAthleteNamesHelper('athlete1-select', 'custom-athlete1-button', 'lastFc', 'firstFc', athlete1NameLast, athlete1NameFirst, 'dialog-submit-button');
    cy.selectCustomAthleteNamesHelper('athlete2-select', 'custom-athlete2-button', 'lastFc', 'firstFc', athlete2NameLast, athlete2NameFirst, 'dialog-submit-button');
  });
});

Cypress.Commands.add("selectCustomGenericParameter", (matSelectName, addNewButtonId, inputId, writeInName, submitButtonId) => {
  cy.get(`mat-select[id="${matSelectName}"`).click({force:true}).then(() => {
    cy.get(`button[id=${addNewButtonId}]`).click({force:true, timeout:5000});
    cy.get(`input[id="${inputId}"]`).clear().type(writeInName);
    cy.get(`button[id="${submitButtonId}"]`).click({force:true, timeout:5000});
  });
});

Cypress.Commands.add("selectCustomAthleteNamesHelper", (matSelectName, addNewButtonId, inputId1, inputId2, writeInName1, writeInName2, submitButtonId) => {
  cy.get(`mat-select[id="${matSelectName}"`).click({force:true}).then(() => {
    cy.get(`button[id=${addNewButtonId}]`).click({force:true, timeout:5000});
    cy.get(`input[id="${inputId1}"]`).clear().type(writeInName1);
    cy.get(`input[id="${inputId2}"]`).clear().type(writeInName2);
    cy.get(`button[id="${submitButtonId}"]`).click({force:true, timeout:5000});
  });
});


Cypress.Commands.add("fillInMatchCreationDetailsWithWriteInAthleteNames", (athlete1NameFirst, athlete1NameLast, athlete2NameFirst, athlete2NameLast) => { //cypressConstants.athlete1LastName , cypressConstants.athlete1FirstName
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl2);
    cy.selectCustomAthleteNames(athlete1NameFirst, athlete1NameLast, athlete2NameFirst, athlete2NameLast);
    cy.selectTournament("IBJJF Gi World Jiu-Jitsu Championship");
    cy.selectCustomLocation(cypressConstants.testLocation3);
    cy.get('input[id=date-input]').click({force: true}).clear().type(cypressConstants.testDate);
    cy.selectGender(cypressConstants.defaultGenderName);
    cy.selectAgeClass(cypressConstants.defaultAgeClass);
    cy.selectRank(cypressConstants.defaultNoGiRank);
    cy.selectWeight(cypressConstants.defaultWeightClass);
  });
});



Cypress.Commands.add("selectAdvantageAnnotation", () => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.contains('mat-tree-node', 'Advantage').children('button').click({force: true});
    cy.wait(2000);
    cy.contains('div[class=mat-ripple]',cypressConstants.defaultAnnotationMoveName, {timeout:5000}).click({force: true});
  });
  cy.contains('Annotation Selected: Advantage Awarded').should('exist');
});

Cypress.Commands.add("selectCrossCollarChoke", () => {
  // cy.get('mat-icon').eq(9).click({force:true});
  // cy.get('mat-icon').eq(12).click({force:true});
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.contains('mat-tree-node', cypressConstants.submissionNodeName, {timeout:5000}).children('button').click({force:true, timeout:5000});
    cy.contains('mat-tree-node', cypressConstants.moveSubcategoryTitle, {timeout:5000}).children('button').click({force:true, timeout:5000});
    cy.wait(1000);
    cy.get('div[id=annotationModal]').contains('Cross Collar Choke').first().click({force:true});
    cy.get('mat-chip').contains('Cross Collar Choke').should('exist');
  });
});

Cypress.Commands.add("selectDropDown", (selectId, selectOption)=>{
  cy.get(`mat-select[id="${selectId}"`).click({timeout:5000}).then(() => {
    cy.wait(1000);
    cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text`).should('contain', selectOption);
    cy.wait(1000);
    cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text:contains("${selectOption}")`).first().click({timeout:5000}).then(() => {
      // After click, mat-select should contain the text of the selected option
      cy.wait(1000);
      cy.get(`mat-select[id="${selectId}"`).contains(selectOption);
    });
  });
});

Cypress.Commands.add("createCustomCervicalChoke", (eventName) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.contains('mat-tree-node', cypressConstants.submissionNodeName, {timeout:5000}).children('button').click({force: true, timeout:5000});
    cy.contains('mat-tree-node', cypressConstants.moveSubcategoryTitle, {timeout:5000}).children('button').click({force:true, timeout:5000});
    cy.contains('mat-tree-node', "Add cervical submission").click();
  });
  cy.get('input[id=eventNameFc]').clear().type(eventName);
  cy.contains('span', 'Choose Move Subcategory').should('not.be.visible');
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.selectDropDown('move-category-select', cypressConstants.submissionNodeName);
    cy.contains('span', 'Choose Move Subcategory').should('be.visible');
    cy.selectDropDown('move-subcategory-select', cypressConstants.moveSubcategoryTitle);
  });
  cy.get('button[id=dialog-submit-button]').click();
});

Cypress.Commands.add('deleteMove', (eventName) =>{
  cy.logout();
  cy.loginAsAdmin();
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.visit(cypressConstants.adminUrl, {timeout: 5000});
  });
  cy.contains('li', eventName, {timeout: 5000}).children('span[name=delete-move-name]').click({force:true});
});

Cypress.Commands.add('deleteGeneric', (genericName) =>{
  cy.logout();
  cy.loginAsAdmin();
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.visit(cypressConstants.adminUrl, {timeout: 5000});
  });
  cy.contains('li', genericName, {timeout: 5000}).children('span[name=delete-move-name]').click({force:true});
});

Cypress.Commands.add('removeAnnotation', (eventName) =>{
  //Assumes you've already logged in as admin
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.contains(cypressConstants.adminUserName).should('exist');
  });
  cy.contains(eventName, {timeout:5000}).should('exist');//get('mat-chip').
  cy.contains('mat-chip', eventName, {timeout:5000}).children('span[name=cancel-annotation]').click({force:true}); //get('mat-chip').
  cy.reload();
  cy.contains(eventName, {timeout:5000}).should('not.exist'); //.get('mat-chip')
});

Cypress.Commands.add('disapproveMove', (eventName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.contains('li',eventName, {timeout: 5000}).should('exist');
  cy.contains('li',eventName).children('span[name=disapprove-move]').click({force:true});
  cy.reload();
  cy.get('li').contains(eventName).should('not.exist');
});

Cypress.Commands.add('disapproveGeneric', (genericName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.contains(genericName, {timeout: 5000}).should('exist');
  cy.contains(genericName, {timeout:5000}).children('span[name=disapprove-move]').click({force:true});
  cy.reload();
  cy.contains(genericName).should('not.exist');
});

Cypress.Commands.add('approveMove', (eventName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin").should('exist');
  cy.contains(eventName, {timeout: 5000}).should('exist'); //'li',
  //TODO LEFT OFF HERE
  cy.contains(eventName).children('span[name=approve-move]').click({force:true}); //'li',
  cy.reload();
  cy.contains(eventName, {timeout: 5000}).should('exist'); //'li',
});

Cypress.Commands.add('approveGeneric', (genericName) =>{
  //Assumes you've already logged in as admin
  cy.contains("Admin", {timeout:5000}).should('exist');
  cy.contains(genericName, {timeout: 5000}).should('exist');
  //TODO LEFT OFF HERE
  cy.contains(genericName, {timeout: 5000}).children('span[name=approve-move]').click({force:true});
  cy.reload();
  cy.wait(3000);
  cy.contains(genericName, {timeout: 5000}).should('exist');
});

Cypress.Commands.add("login", (email, pass) => {
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.visit(cypressConstants.loginUrl);
  });
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
  cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    cy.visit(cypressConstants.loginUrl);
    cy.wait(2000);
    cy.get('button[id=email-dialog-open-button]').click({force:true});
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
