/// <reference types="cypress" />
describe ('Match annotation tests', () =>{

  beforeEach(()=>{
    // cy.visit('http://localhost:4200/');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  afterEach(() =>{
    cy.logout();
  });

  it('annotates a match with a move', ()=>{
    cy.contains('Match Rating');
    cy.contains('Video');
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.wait(1000);
    // cy.get('#tree-div');
    // cy.get('mat-tree-node > mat-icon').first().click({force:true});
    // cy.get('.mat-icon-rtl-mirror').first().click();
    // cy.get('div[id=annotationModal]').contains('Advantage Awarded').click();
    cy.selectAdvantageAnnotation();
    // cy.contains('Advantage').next().click(); //.first()
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
    cy.wait(500);
    // cy.contains("Annotation Recorded").should('exist');

    //Delete annotation
    cy.logout();
    // cy.get('a[id=logOutLink]').click();
    // cy.visit('http://localhost:4200/login');
    // cy.wait(2000);
    cy.loginAsAdmin();
    // cy.get('button[id=email-dialog-open-button]').click();
    // cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    //   cy.get('input[id=dialog-email-input]').type(cypressConstants.adminEmailAddress);
    //   cy.get('input[id=dialog-pw-input]').type(cypressConstants.adminPassword);
    // });
    // cy.get('button[id=dialog-submit-button]').click();
    // cy.wait(1000);
    cy.get('a[name=videoClick]').first().click({force: true});
    cy.get('mat-chip').contains('Advantage Awarded').should('exist');
    cy.get('.cancel-annotation').first().click();
    cy.reload();
    cy.wait(2000);
    // cy.get('mat-chip').contains('Advantage Awarded').within((chipEl)=>{
    //   cy.get('span[class=cancel-annotation]').click();
    // });
    // cy.get('.cancel-annotation').click();
    cy.get('mat-chip').contains('Advantage Awarded').should('not.exist');
  });


  it('cannot annotate a match with a move without the move', ()=>{
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('input[id=points]').click({force:true}).type('2{enter}');
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('cannot annotate a match with a move without the performer of the move', ()=>{
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    // cy.get('mat-icon').first().click({force:true});
    // cy.contains('Advantage').first().next().click();
    cy.selectAdvantageAnnotation();
    cy.get('input[id=points]').type('2{enter}');
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('cannot annotate a match with a move without the points', ()=>{
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    // cy.get('mat-icon').first().click({force:true});
    // cy.contains('Advantage').first().next().click();
    cy.selectAdvantageAnnotation();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('should have the end move disabled before done button has been clicked', function(){
    cy.get('a[name=videoClick]', {timeout: 5000}).first().click();
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
  });

  it('should still have end move disabled if cancel in the modal is clicked', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('button[id=modal-cancel-button]').click();
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
    cy.wait(2000);
  });

  it('should have begin move disabled and end move enabled after done have been clicked', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.get('a[id=play]').click({force:true});
    cy.wait(2000);
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    // cy.get('mat-icon').first().click({force:true});
    // cy.contains('Advantage').first().next().click();
    cy.selectAdvantageAnnotation();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').type('2'); //.click({force:true})
    cy.get('mat-radio-button[id=yes-radio-button]').click();
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.wait(2000);
    cy.get('button[id=begin-move]', {timeout: 5000}).should('be.disabled');
    cy.get('button[id=end-move]').should('be.enabled');
  });

  it('annotates a move once and when it is done it does it again and finds the previous options unselected', function(){
   cy.get('a[name=videoClick]').first().click();
   cy.get('button[id=begin-move]').click();
   cy.get('div[id=annotationModal]').should('be.visible');
   // cy.get('mat-icon').first().click({force:true});
   // cy.contains('Annotation Selected: Advantage').should('not.exist');
   // cy.contains('Advantage').first().next().click();
   cy.selectAdvantageAnnotation();
   cy.get('mat-select[id=performer]').click({force:true});
   cy.get('mat-option').first().click({force:true});
   cy.get('button[id=done-button-performers]').should('be.disabled');
   cy.get('input[id=points]').type('2'); //.click({force:true})
   cy.get('mat-radio-button[id=yes-radio-button]').click();
   cy.contains('Annotation Selected: Advantage').should('exist');
   cy.get('button[id=done-button-performers]').should('not.be.disabled');
   cy.get('button[id=done-button-performers]').click();
   cy.get('div[id=annotationModal]').should('not.be.visible');
   cy.get('button[id=end-move]').click();
   cy.contains('Annotation Selected: Advantage Awarded').should('not.exist');
   cy.wait(1000);
   // //And then again
   cy.get('button[id=begin-move]').click();
   cy.get('div[id=annotationModal]').should('be.visible');
   // cy.get('mat-icon').first().click({force:true});
   cy.contains('Annotation Selected: Advantage Awarded').should('not.exist');
   cy.selectAdvantageAnnotation();
   // cy.contains('Advantage').first().next().click();
   cy.get('mat-select[id=performer]').click({force:true});
   cy.get('mat-option').first().click({force:true});
   cy.get('button[id=done-button-performers]').should('be.disabled');
   cy.get('input[id=points]').type('2'); //.click({force:true})
   cy.get('mat-radio-button[id=yes-radio-button]').click();
   cy.contains('Annotation Selected: Advantage Awarded').should('exist');
   cy.get('button[id=done-button-performers]').should('not.be.disabled');
   cy.get('button[id=done-button-performers]').click({force:true});
   cy.get('div[id=annotationModal]').should('not.be.visible');
  });

  it('can click into the deepest part of the tree', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').eq(9).click({force:true});
    cy.get('mat-icon').eq(10).click({force:true});
    cy.contains('Annotation Selected: Ankle Lock').should('not.exist');
    cy.contains('Ankle Lock').first().click();
    cy.contains('Annotation Selected: Ankle Lock').should('exist');
  });

  it('cannot make the same exact annotation twice', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible'); //.click()
    cy.selectCrossCollarChoke();
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
    // cy.on('uncaught:exception', (err, runnable) => {
    // return false;
    // });
    cy.get('button[id=end-move]').click();
    // cy.on('uncaught:exception', (err, runnable) => {
    // return false;
    // });
    cy.contains("Annotation Recorded").should('exist');

    cy.log("Second time through");
    // cy.on('uncaught:exception', (err, runnable) => {
    //   return false;
    // });
    cy.wait(1000);
    cy.get('button[id=begin-move]').should('be.visible');
    // cy.on('uncaught:exception', (err, runnable) => {
    //   return false;
    // });
    cy.get('button[id=begin-move]').click();
    // cy.on('uncaught:exception', (err, runnable) => {
    //   return false;
    // });
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.wait(1000);
    // cy.selectCrossCollarChoke(); //TODO there are a different number of mat-icons visible this time. Man, this is super brittle
    cy.get('mat-icon').eq(7).click({force:true});
    cy.get('mat-icon').eq(10).click({force:true});
    cy.wait(1000);
    cy.get('div[id=annotationModal]').contains('Cross Collar Choke').first().click();
    cy.get('mat-chip').contains('Cross Collar Choke').should('exist');
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
    // cy.on('uncaught:exception', (err, runnable) => {
    // return false;
    // });
    cy.contains("Annotation has already been made by another user").should('exist');

    //TODO now login as admin and remove the annotation entirely
  });

});


describe ('Match annotation tests with no afterEach', () =>{
  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  it('logs in and logs out and logs in again and still sees the annotation tree on a match', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.wait(3000);
    cy.get('a[id=play]').click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.wait(1000);
    cy.selectAdvantageAnnotation();
    // cy.get('mat-icon').first().click({force:true});
    // cy.contains('Advantage').first().next().click();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').type('2'); //.click({force:true})
    cy.get('mat-radio-button[id=yes-radio-button]').click();
    cy.contains('Annotation Selected: Advantage').should('exist');
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click();
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.wait(1000);
    cy.get('button[id=end-move]').click(); //{force:true}
    // cy.wait(1000);
    cy.visit('http://localhost:4200/login');

    cy.logout();
    // cy.wait(2000);

    //And then again
    cy.log("Second part");
    // cy.visit('http://localhost:4200/');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.selectAdvantageAnnotation();
    // cy.get('mat-icon').first().click({force:true});
    cy.contains('Annotation Selected: Advantage Awarded').should('exist');
    cy.get('button[id=modal-cancel-button]').click();
    cy.logout();
  });
});
