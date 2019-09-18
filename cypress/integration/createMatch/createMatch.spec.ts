describe ('Tests involving match creation', () =>{

  beforeEach(()=>{
    // cy.visit('http://localhost:4200/');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw).then(()=>{
        // cy.wait(2000);
      });
    });
  });

  after(() =>{
    //And delete the match just for cleanup
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.adminEmailAddress,cypressConstants.adminPassword);
    });
    cy.wait(2000);
    cy.visit('http://localhost:4200/matches');
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    cy.get('mat-cell[id=Alfie]>button').click();
    cy.logout();
  });

  afterEach(() =>{
    cy.logout();
  });

  it('creates a match', function(){
    cy.visit('http://localhost:4200/newmatch');
    cy.fillInMatchCreationDetails();
    cy.get('button[id=new-match-submit-button]').click();
    cy.wait(2000);
    cy.get('h4').contains('Annotate your submission?').click({force:true});
    cy.get('button[id=add-to-queue-modal-button]').click({force:true});
    cy.url().should('not.match',/newmatch/);
    cy.url().should('match',/landing/);
  });

  it('created match appears on table', function(){
    // cy.contains('Alfie').should('exist'); //TODO brittle if more than 10 matches
    //TODO flesh out
  });

  it('cannot create duplicate match', function(){
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
      cy.get('button[id=add-to-queue-modal-button]').click({force:true});
      cy.contains("Match Already Exists in the Database").should('exist');
    });
  });

});
