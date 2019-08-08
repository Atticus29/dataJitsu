describe ('Tests involving admin privleges and deletions', () =>{

  beforeEach(()=>{
    cy.loginAsAdmin();
  });

  it('creates a match', function(){
    cy.wait(1000);
    cy.visit('http://localhost:4200/newmatch');
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
      cy.get('h4').contains('Annotate your submission?').click({force:true});
      cy.get('button[id=add-to-queue-modal-button]').click({force:true});
      cy.url().should('not.match',/newmatch/);
      cy.contains('Athlete 1').should('exist');
    });
  });


  it('sees delete as an option in the table', function(){
    cy.contains("Delete Match").should('exist');
  });

  it('deletes a match containing Alfie as athlete 1', function(){ //TODO brittle right now
    // cy.get('button[class=mat-paginator-navigation-previous]').click();
    cy.get('mat-cell[id=Alfie]>button').click();
  });
});
