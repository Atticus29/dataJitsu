describe ('Match annotation tests', () =>{

  beforeEach(()=>{
    cy.visit('http://localhost:4200/');
  });

  it('annotates a match with a move', ()=>{
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').first().click({force:true});
    cy.contains('Advantage').first().next().click();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').click({force:true}).type('2{enter}'); //
    // cy.get('input[id=points]').type('2{enter}');
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
  });


  it('cannot annotate a match with a move without the move', ()=>{
    cy.visit('http://localhost:4200/login');
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('input[id=points]').click({force:true}).type('2{enter}');
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('cannot annotate a match with a move without the performer of the move', ()=>{
    cy.visit('http://localhost:4200/login');
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').first().click({force:true});
    cy.contains('Advantage').first().next().click();
    cy.get('input[id=points]').type('2{enter}');
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('cannot annotate a match with a move without the points', ()=>{
    cy.visit('http://localhost:4200/login');
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').first().click({force:true});
    cy.contains('Advantage').first().next().click();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
  });

  it('should have the end move disabled before done button has been clicked', function(){
    cy.visit('http://localhost:4200/login');
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.get('a[name=videoClick]', {timeout: 5000}).first().click();
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
  });

  it('should still have end move disabled if cancel in the modal is clicked', function(){
    cy.visit('http://localhost:4200/login');
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('button[id=modal-cancel-button]').click();
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
  });

  it('should have begin move disabled and end move enabled after done have been clicked', function(){
    cy.visit('http://localhost:4200/login');
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.get('a[name=videoClick]').first().click();
    cy.get('a[id=play]').click({force:true});
    cy.wait(5000);
    cy.get('button[id=begin-move]').should('be.enabled');
    cy.get('button[id=end-move]').should('be.disabled');
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').first().click({force:true});
    cy.contains('Advantage').first().next().click();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').click({force:true}).type('2{enter}'); //
    // cy.get('input[id=points]').type('2{enter}');
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.wait(5000);
    cy.get('button[id=begin-move]', {timeout: 5000}).should('be.disabled');
    cy.get('button[id=end-move]').should('be.enabled');
  });

  it.only('logs in and logs out and logs in again and still sees the annotation tree on a match', function(){
    // cy.visit('http://localhost:4200/login');
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.get('a[id=logOutLink]').click();
    cy.contains('Log In');
    // cy.visit('http://localhost:4200/login');
    // cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.get('input[id=userEmail]').type(cypressConstants.usrnm);
      cy.get('input[id=password]').type(cypressConstants.passw);
      cy.get('button[id=loginSubmit]').click();
    });
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
  });

  it.only('annotate a move once and when it is done it does it again and finds the previous options unselected', function(){
    cy.contains('Log In');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.get('a[name=videoClick]').first().click();
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').first().click({force:true});
    cy.contains('Advantage').first().next().click();
    cy.get('button[id=modal-cancel-button]').click();

    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').first().click({force:true});
    cy.contains('Advantage').first().next().click();
    cy.contains('Annotation Selected: Advantage').should('not.exist');
    cy.contains('Advantage').first().next().click();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').click({force:true}).type('2{enter}'); //
    cy.contains('Annotation Selected: Advantage').should('exist');
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
    cy.wait(5000);
    cy.get('button[id=end-move]').click({force:true});
    cy.wait(2000);
    //And then again
    cy.get('button[id=begin-move]').click();
    cy.get('div[id=annotationModal]').should('be.visible');
    cy.get('mat-icon').first().click({force:true});
    cy.contains('Annotation Selected: Advantage').should('not.exist');
    cy.contains('Advantage').first().next().click();
    cy.get('mat-select[id=performer]').click({force:true});
    cy.get('mat-option').first().click({force:true});
    cy.get('button[id=done-button-performers]').should('be.disabled');
    cy.get('input[id=points]').click({force:true}).type('2{enter}'); //
    cy.contains('Annotation Selected: Advantage').should('exist');
    cy.get('button[id=done-button-performers]').should('not.be.disabled');
    cy.get('button[id=done-button-performers]').click({force:true});
    cy.get('div[id=annotationModal]').should('not.be.visible');
  });

});
