/// <reference types="cypress" />
describe ('Match custom annotation tests', () =>{

  beforeEach(()=>{
    // cy.visit('http://localhost:4200/');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  afterEach(() =>{
    cy.logout();
  });

  it('adds custom name and submits annotation', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible'); //.click()
    cy.createCustomCervicalChoke("darth vader choke");
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').type('2');
    cy.get('mat-radio-button[id=yes-radio-button]').click();
    cy.get('mat-radio-button[id=successful-radio-button]').click();
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.get('button[id=end-move]').should('be.enabled');
    cy.get('button[id=end-move]').click();
    cy.on('uncaught:exception', (err, runnable) => {
    return false;
    });
    cy.contains("Annotation Recorded").should('exist');
    cy.contains('span','Darth Vader Choke').should('exist');

    //TODO remove these
    // cy.logout();
    // cy.loginAsAdmin();
    // cy.get('a[name=videoClick]').first().click();
    // cy.removeAnnotation("Darth Vader Choke");
    // cy.visit('http://localhost:4200/admin')
    // cy.disapproveMove("Darth Vader Choke");

  });

  it('approves name in admin and checks that it is on the dropdown list now', function(){
    cy.logout();
    cy.loginAsAdmin();
    cy.visit('http://localhost:4200/admin');
    cy.approveMove("Darth Vader Choke");
    cy.visit('http://localhost:4200/matches');
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible'); //.click()
    cy.get('mat-icon').eq(9).click({force:true});
    cy.get('mat-icon').eq(12).click({force:true});
    // cy.wait(1000);
    cy.get('div[id=annotationModal]').contains('Darth Vader Choke').should('exist');
  });

  it('cannot create a customMove that has already been created and approved, then deletes the move from admin page and confirms that it is missing from dropdown list', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible'); //.click()
    cy.createCustomCervicalChoke("Darth Vader Choke");
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.moveNameAlreadyExistsNotification).should('exist');
    });

    //deletes the move from admin page and confirms that it is missing from dropdown list
    cy.deleteMove("Darth Vader Choke");
    cy.visit('http://localhost:4200/matches',{timeout: 5000});
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').eq(9).click({force:true});
    cy.get('mat-icon').eq(12).click({force:true});
    cy.get('div[id=annotationModal]').contains('Darth Vader Choke').should('not.exist');
  });

  it('disapproves the custom move from the admin page, checks that the custom move has been re-named, and removes the now-renamed annotation', function(){
    //First delete the annotation that already exists
    cy.logout();
    cy.loginAsAdmin();
    cy.get('a[name=videoClick]').first().click();
    cy.removeAnnotation('Darth Vader Choke');

    //Then create the annotation and custom move again
    // cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.wait(1000);
    cy.get('div[id=annotationModal]').should('be.visible'); //.click()
    cy.createCustomCervicalChoke('Darth Vader Choke');
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').type('2');
    cy.get('mat-radio-button[id=yes-radio-button]').click();
    cy.get('mat-radio-button[id=successful-radio-button]').click();
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.get('button[id=end-move]').should('be.enabled');
    cy.get('button[id=end-move]').click();
    cy.on('uncaught:exception', (err, runnable) => {
    return false;
    });
    cy.contains("Annotation Recorded").should('exist');
    cy.contains('span','Darth Vader Choke').should('exist');

    //Then do the important test stuff
    // cy.logout();
    // cy.loginAsAdmin();
    cy.visit('http://localhost:4200/admin');
    cy.disapproveMove("Darth Vader Choke");
    cy.checkThatCustomMoveHasBeenRenamed();
  });

});
