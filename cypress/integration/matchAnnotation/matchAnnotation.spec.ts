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
    cy.loginAsAdmin();
    cy.get('a[name=videoClick]').first().click({force: true});
    cy.get('mat-chip').contains('Advantage Awarded').should('exist');
    cy.get('.cancel-annotation').first().click();
    cy.reload();
    cy.wait(2000);
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
   cy.get('button[id=done-button-performers]').click({force: true});
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

   //Delete annotation?
   cy.logout();
   cy.loginAsAdmin();
   cy.get('a[name=videoClick]').first().click({force: true});
   cy.get('mat-chip').contains('Advantage Awarded').should('exist');
   cy.get('.cancel-annotation').first().click();
   cy.reload();
   cy.wait(2000);
   cy.get('mat-chip').contains('Advantage Awarded').should('not.exist');
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
    cy.logout();
    cy.loginAsAdmin();
    cy.get('a[name=videoClick]').first().click();
    cy.get('mat-chip').contains('Cross Collar Choke').should('exist');
    cy.get('.cancel-annotation').first().click();
    cy.reload();
    cy.wait(2000);
    cy.get('mat-chip').contains('Cross Collar Choke').should('not.exist');
  });

  it('adds custom name and submits annotation', function(){
    // TODO HERE
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

  it('cannot create a customMove that has already been created and approved', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible'); //.click()
    cy.createCustomCervicalChoke("Darth Vader Choke");
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.moveNameAlreadyExistsNotification).should('exist');
    });
  });

  it('deletes the move from admin page and confirms that it is missing from dropdown list', function(){
    cy.deleteMove("Darth Vader Choke");
    cy.visit('http://localhost:4200/matches',{timeout: 5000});
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').eq(9).click({force:true});
    cy.get('mat-icon').eq(12).click({force:true});
    cy.get('div[id=annotationModal]').contains('Darth Vader Choke').should('not.exist');
  });

  it.only('disapproves the custom move from the admin page', function(){
    //TODO LEFT OFF HERE
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
    cy.visit('http://localhost:4200/admin')
    cy.disapproveMove("Darth Vader Choke");
  });

  it('checks that the custom move has been re-named', function(){
    cy.get('a[name=videoClick]').first().click();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains('span',cypressConstants.moveNameRemovedMessage).should('exist');
      cy.contains('span','Darth Vader Choke').should('not.exist');
    });
  });

  it('removes the custom annotation', function(){
    cy.logout();
    cy.loginAsAdmin();
    cy.get('a[name=videoClick]').first().click();
    cy.removeAnnotation("Darth Vader Choke");
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
