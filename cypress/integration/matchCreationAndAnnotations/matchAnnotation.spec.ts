/// <reference types="cypress" />
describe ('Match annotation tests', () =>{

  beforeEach(()=>{
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
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.wait(1000);
    // cy.get('#tree-div');
    // cy.get('mat-tree-node > mat-icon').first().click({force:true});
    // cy.get('.mat-icon-rtl-mirror').first().click({force:true});
    // cy.get('div[id=annotationModal]').contains('Advantage Awarded').click({force:true});
    cy.selectAdvantageAnnotation();
    // cy.contains('Advantage').next().click({force:true}); //.first()
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').type('2');
    cy.get('mat-radio-button[id=yes-radio-button]').click({force:true});
    cy.get('mat-radio-button[id=successful-radio-button]').click({force:true});
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click();
    // cy.wait(3000);
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.get('button[id=end-move]').should('be.enabled');
    cy.wait(2000);
    cy.get('button[id=end-move]').click({force:true});
    // cy.on('uncaught:exception', (err, runnable) => {
    // return false;
    // });
    cy.wait(2000);
    // cy.contains("Annotation Recorded").should('exist');

    //Delete annotation
    cy.logout();
    cy.loginAsAdmin();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force: true});
    cy.contains('Advantage Awarded').should('exist'); //get('mat-chip')
    cy.get('.cancel-annotation').first().click({force:true});
    cy.reload();
    cy.wait(2000);
    cy.contains('Advantage Awarded').should('not.exist'); //.get('mat-chip')
  });


  it('cannot annotate a match with a move without the move', ()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('input[id=points]').click({force:true}).type('2{enter}');
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('cannot annotate a match with a move without the performer of the move', ()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    // cy.get('mat-icon').first().click({force:true});
    // cy.contains('Advantage').first().next().click({force:true});
    cy.selectAdvantageAnnotation();
    cy.get('input[id=points]').type('2{enter}');
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('cannot annotate a match with a move without the points', ()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    // cy.get('mat-icon').first().click({force:true});
    // cy.contains('Advantage').first().next().click({force:true});
    cy.selectAdvantageAnnotation();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('should have the end move disabled before done button has been clicked', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]', {timeout: 5000}).first().click({force:true});
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
  });

  it('should still have end move disabled if cancel in the modal is clicked', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('button[id=modal-cancel-button]').click({force:true});
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
    cy.wait(2000);
  });

  it('should have begin move disabled and end move enabled after done have been clicked', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('a[id=play]').click({force:true});
    cy.wait(2000);
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    // cy.get('mat-icon').first().click({force:true});
    // cy.contains('Advantage').first().next().click({force:true});
    cy.selectAdvantageAnnotation();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').type('2'); //.click({force:true})
    cy.get('mat-radio-button[id=yes-radio-button]').click({force:true});
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.wait(2000);
    cy.get('button[id=begin-move]', {timeout: 5000}).should('be.disabled');
    cy.get('button[id=end-move]').should('be.enabled');
  });

  it('annotates a move once and when it is done it does it again and finds the previous options unselected', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
   cy.get('a[name=videoClick]').first().click({force:true});
   cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
   cy.get('div[id=annotationModal]').should('be.visible');
   // cy.get('mat-icon').first().click({force:true});
   // cy.contains('Annotation Selected: Advantage').should('not.exist');
   // cy.contains('Advantage').first().next().click({force:true});
   cy.selectAdvantageAnnotation();
   cy.get('mat-select[id=performer]').click({force:true});
   cy.get('mat-option').first().click({force:true});
   cy.get('button[id=done-button-performers]').should('be.disabled');
   cy.get('input[id=points]').type('2'); //.click({force:true})
   cy.get('mat-radio-button[id=yes-radio-button]').click({force:true});
   cy.contains('Annotation Selected: Advantage').should('exist');
   cy.get('button[id=done-button-performers]').should('not.be.disabled');
   cy.get('button[id=done-button-performers]').click({force: true});
   cy.get('div[id=annotationModal]').should('not.be.visible');
   cy.get('button[id=end-move]').click({force:true});
   cy.on('uncaught:exception', (err, runnable) => {
    return false;
    });
   cy.wait(3000);
   cy.contains('No Annotation Currently Selected').should('exist');
   // cy.contains('Current Move Being Annotated: Advantage Awarded').should('not.exist');
   // //And then again
   cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
   cy.get('div[id=annotationModal]').should('be.visible');
   // cy.get('mat-icon').first().click({force:true});
   // cy.contains('Annotation Selected: Advantage Awarded').should('not.exist');
   cy.contains('No Annotation Currently Selected').should('exist');

   cy.selectAdvantageAnnotation();
   // cy.contains('Advantage').first().next().click({force:true});
   cy.get('mat-select[id=performer]').click({force:true});
   cy.get('mat-option').first().click({force:true});
   cy.get('button[id=done-button-performers]').should('be.disabled');
   cy.get('input[id=points]').type('2'); //.click({force:true})
   cy.get('mat-radio-button[id=yes-radio-button]').click({force:true});
   cy.get('button[id=done-button-performers]').should('not.be.disabled');
   cy.get('button[id=done-button-performers]').click({force:true});
   cy.get('div[id=annotationModal]').should('not.be.visible');

   //Delete annotation?
   cy.logout();
   cy.loginAsAdmin();
   cy.get('a[name=videoClick]').first().click({force: true});
   cy.get('mat-chip').contains('Advantage Awarded').should('exist');
   cy.get('.cancel-annotation').first().click({force:true});
   cy.reload();
   cy.wait(2000);
   cy.get('mat-chip').contains('Advantage Awarded').should('not.exist');
  });

  it('can click into the deepest part of the tree', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').eq(9).click({force:true});
    cy.get('mat-icon').eq(10).click({force:true});
    cy.contains('Annotation Selected: Ankle Lock').should('not.exist');
    cy.contains('Ankle Lock').first().click({force:true});
    cy.contains('Annotation Selected: Ankle Lock').should('exist');
  });

  it('cannot make the same exact annotation twice', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible'); //.click({force:true})
    cy.selectCrossCollarChoke();
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
    cy.on('uncaught:exception', (err, runnable) => {
    return false;
    });
    cy.get('button[id=end-move]').click({force:true});
    cy.on('uncaught:exception', (err, runnable) => {
    return false;
    });
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
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    // cy.on('uncaught:exception', (err, runnable) => {
    //   return false;
    // });
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.wait(1000);
    // cy.selectCrossCollarChoke(); //TODO there are a different number of mat-icons visible this time. Man, this is super brittle
    cy.get('mat-icon').eq(7).click({force:true});
    cy.get('mat-icon').eq(10).click({force:true});
    cy.wait(1000);
    cy.get('div[id=annotationModal]').contains('Cross Collar Choke').first().click({force:true});
    cy.get('mat-chip').contains('Cross Collar Choke').should('exist');
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
    // cy.on('uncaught:exception', (err, runnable) => {
    // return false;
    // });
    cy.contains("Annotation has already been made by another user").should('exist');

    //TODO now login as admin and remove the annotation entirely
    cy.logout();
    cy.loginAsAdmin();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('mat-chip').contains('Cross Collar Choke').should('exist');
    cy.get('.cancel-annotation').first().click({force:true});
    cy.reload();
    cy.wait(2000);
    cy.get('mat-chip').contains('Cross Collar Choke').should('not.exist');
  });
});


describe ('Match annotation tests with no afterEach', () =>{
  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  it('logs in and logs out and logs in again and still sees the annotation tree on a match', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.wait(3000);
    cy.get('a[id=play]').click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.wait(1000);
    cy.selectAdvantageAnnotation();
    // cy.get('mat-icon').first().click({force:true});
    // cy.contains('Advantage').first().next().click({force:true});
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').type('2'); //.click({force:true})
    cy.get('mat-radio-button[id=yes-radio-button]').click({force:true});
    cy.contains('Annotation Selected: Advantage').should('exist');
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.wait(1000);
    cy.get('button[id=end-move]').click({force:true}); //{force:true}
    cy.on('uncaught:exception', (err, runnable) => {
    return false;
    });
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.loginUrl);
    });

    cy.logout();

    //And then again
    cy.log("Second part");
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
    });
    cy.get('a[name=videoClick]').first().click({force:true});
    cy.get('button[id=begin-move]',{timeout:5000}).click({force:true});
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.selectAdvantageAnnotation();
    // cy.get('mat-icon').first().click({force:true});
    cy.contains('Annotation Selected: Advantage Awarded').should('exist');
    cy.get('button[id=modal-cancel-button]').click({force:true});

    //then cleans up after itself by logging in as admin and deleting the annotation and logging out
    cy.logout();
    cy.loginAsAdmin();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.testIndividualName,{timeout:5000}).should('exist');
      cy.get('a[name=videoClick]').first().click({force:true});
      cy.removeAnnotation(cypressConstants.defaultAnnotationMoveName);
    });
    cy.logout();
  });

});
