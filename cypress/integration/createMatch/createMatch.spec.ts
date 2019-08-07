describe ('Tests involving match creation', () =>{

  beforeEach(()=>{
    // cy.visit('http://localhost:4200/');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw).then(()=>{
        cy.wait(2000);
      });
    });
  });

  it.only('creates a match', function(){
    cy.visit('http://localhost:4200/newmatch');
    // cy.contains("New Match").click();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl);
      cy.get('input[id=athlete1Name]').clear().type(cypressConstants.testAthlete1);
      cy.get('input[id=athlete2Name]').clear().type(cypressConstants.testAthlete2);
      cy.get('input[id=tournamentName]').clear().type(cypressConstants.testTournament);
      cy.get('input[id=location]').clear().type(cypressConstants.testLocation);
      cy.get('input[id=date-input]').clear().type(cypressConstants.testDate);
      cy.get('mat-select[id=gender-select]').click();
      cy.get('mat-option').first().next().click({force:true});
      cy.get('mat-select[id=ageClass]').click();
      cy.get('mat-option').first().next().click({force:true});
      cy.get('mat-select[id=rank]').click();
      cy.get('mat-option').first().next().click({force:true});
      cy.get('mat-select[id=weight]').click();
      cy.get('mat-option').first().next().click({force:true});
      cy.get('button[id=new-match-submit-button]').click();
      cy.wait(2000);
      cy.get('button[id=add-to-queue-modal-button]').should('be.visible');
      cy.get('button[id=add-to-queue-modal-button]').click();
      cy.url().should('not.match',/newmatch/);
      cy.contains('Athlete 1').should('exist');
    });
  });

  it('created match appears on table', function(){
    // cy.contains('Alfie').should('exist'); //TODO brittle if more than 10 matches
    //TODO flesh out
  });

});
