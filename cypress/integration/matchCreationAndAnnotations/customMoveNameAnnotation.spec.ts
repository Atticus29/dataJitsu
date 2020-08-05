/// <reference types="cypress" />
describe ('Match custom tests: move name', () =>{

  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  afterEach(() =>{
    cy.logout();
  });

  it('adds custom name and submits annotation', function(){
    cy.get('a[name=videoClick]', {timeout: 50000}).first().click({force:true});
    cy.get('button[id=end-move]').should('not.be.enabled');
    cy.get('button[id=begin-move]', {timeout: 5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible'); //.click({force:true})
    cy.createCustomCervicalChoke("darth vader choke");
    cy.get('mat-select[id=performer]').click();
    cy.get('mat-option').first().click();
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').type('2');
    cy.get('mat-radio-button[id=yes-radio-button]').click();
    cy.get('mat-radio-button[id=successful-radio-button]').click();
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click();
    cy.wait(2000);
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.get('button[id=end-move]').should('be.enabled');
    cy.get('button[id=end-move]').click({force:true});
    // cy.get('button[id=end-move]').click({force:true});
    // cy.on('uncaught:exception', (err, runnable) => {
    // return false;
    // });
    // cy.wait(2000);
    cy.contains("Annotation Recorded", {timeout:50000}).should('exist');
    // cy.contains('span','Darth Vader Choke', {timeout:5000}).should('exist');

  });

  it('approves name in admin and checks that it is on the dropdown list now', function(){
    cy.logout();
    cy.loginAsAdmin();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.adminUrl);
      cy.approveMove("Darth Vader Choke");
      cy.visit(cypressConstants.allVideosUrl);
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
      cy.get('a[name=videoClick]').first().click({force:true});
      cy.get('button[id=begin-move]', {timeout: 5000}).click({force:true});
      cy.get('div[id=annotationModal]').should('be.visible'); //.click({force:true})
      cy.contains('mat-tree-node', cypressConstants.submissionNodeName).children('button').click({force: true});
      cy.contains('mat-tree-node', cypressConstants.moveSubcategoryTitle).children('button').click({force:true});
      cy.contains('mat-tree-node', "Darth Vader Choke").should('exist');
    });
    // cy.get('mat-icon').eq(9).click({force:true});
    // cy.get('mat-icon').eq(12).click({force:true});
    // cy.wait(1000);
    cy.get('div[id=annotationModal]').contains('Darth Vader Choke').should('exist');
  });

  it('cannot create a customMove that has already been created and approved, then deletes the move from admin page and confirms that it is missing from dropdown list', function(){
    cy.log("Clicks on move and asserts that move have been re-named")
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
      cy.get('a[name=videoClick]').first().click({force:true});
      cy.get('button[id=begin-move]', {timeout: 5000}).click({force:true});
      cy.get('div[id=annotationModal]').should('be.visible'); //.click({force:true})
      cy.createCustomCervicalChoke("Darth Vader Choke");
      cy.contains(cypressConstants.eventNameAlreadyExistsNotification).should('exist');
      //deletes the move from admin page and confirms that it is missing from dropdown list
      cy.log("deletes the move from admin page and confirms that it is missing from dropdown list");
      cy.deleteMove(cypressConstants.customMoveName);
      cy.visit(cypressConstants.allVideosUrl,{timeout: 5000});
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
      cy.get('a[name=videoClick]').first().click({force:true});
      cy.get('button[id=begin-move]', {timeout: 5000}).click({force:true});
      cy.get('div[id=annotationModal]').should('be.visible');
      cy.contains('mat-tree-node', cypressConstants.submissionNodeName, {timeout:5000}).children('button').click({force:true, timeout:5000});
      cy.contains('mat-tree-node', cypressConstants.moveSubcategoryTitle, {timeout:5000}).children('button').click({force:true, timeout:5000});
      // cy.get('mat-icon').eq(9).click({force:true});
      // cy.get('mat-icon').eq(12).click({force:true});
      cy.get('div[id=annotationModal]').contains(cypressConstants.customMoveName).should('not.exist');
    });

  });

  it('disapproves the custom move from the admin page, checks that the custom move has been re-named, and removes the now-renamed annotation', function(){
    //First delete the annotation that already exists
    cy.log("First delete the annotation that already exists");
    cy.logout();
    cy.loginAsAdmin();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
      cy.get('a[name=videoClick]').first().click({force:true});
      cy.removeAnnotation(cypressConstants.customMoveName);
    });
    cy.reload();

    //Then create the annotation and custom move again
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.allVideosUrl);
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
      cy.get('a[name=videoClick]').first().click({timeout:5000});
      cy.log("Then create the annotation and custom move again");
      // cy.reload();
      cy.get('button[id=begin-move]', {timeout: 5000}).click({timeout:5000});
      cy.wait(1000);
      cy.get('div[id=annotationModal]').should('be.visible'); //.click({force:true})
      cy.createCustomCervicalChoke(cypressConstants.customMoveName);
      cy.get('mat-select[id=performer]').click({force:true});
      cy.get('mat-option').first().click({force:true});
      cy.get('button[id=done-button-performers]').should('be.disabled');
      cy.get('input[id=points]').type('2');
      cy.get('mat-radio-button[id=yes-radio-button]').click({force:true});
      cy.get('mat-radio-button[id=successful-radio-button]').click({force:true});
      cy.get('button[id=done-button-performers]').should('not.be.disabled');
      cy.get('button[id=done-button-performers]').click({force:true});
      cy.get('div[id=annotationModal]').should('not.be.visible');
      cy.get('button[id=end-move]').should('be.enabled');
      cy.get('button[id=end-move]').click({force:true});
      cy.wait(5000);
      cy.on('uncaught:exception', (err, runnable) => {
        return false;
      });
      cy.contains("Annotation Recorded").should('exist');
      cy.contains('span',cypressConstants.customMoveName).should('exist');
      //Then do the important test stuff
      // cy.logout();
      // cy.loginAsAdmin();
      cy.log("disapproveMove");
      cy.visit(cypressConstants.adminUrl);
      cy.disapproveMove(cypressConstants.customMoveName);
      cy.log("checkThatCustomMoveHasBeenRenamed");
      cy.reload();
      cy.checkThatCustomMoveHasBeenRenamed();

      cy.visit(cypressConstants.allVideosUrl);
      cy.removeNowRenamedAnnotation();
    });
  });

});
