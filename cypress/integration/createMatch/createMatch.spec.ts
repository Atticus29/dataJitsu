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
    cy.visit('http://localhost:4200/matches');
    cy.wait(2000);
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    cy.get('mat-cell[id=APineappleUnderTheSea]>button').click();
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
    cy.url().should('match',/matches/);
  });

  it('created match appears on table', function(){
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    cy.contains('APineappleUnderTheSea').should('exist');
  });

  it('cannot create duplicate match', function(){
    cy.visit('http://localhost:4200/newmatch');
    cy.fillInMatchCreationDetails();
    // cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      // cy.get('input[id=matchURL]').clear().type(cypressConstants.testVideoUrl);
      // cy.get('mat-select[id=athlete1-select]').click();
      // cy.get('mat-option').first().next().next().click({force:true})
      // cy.get('mat-select[id=athlete2-select]').click();
      // cy.get('mat-option').first().next().next().next().click({force: true});
      // cy.get('input[id=tournamentName]').clear().type(cypressConstants.testTournament);
      // cy.get('input[id=location]').clear().type(cypressConstants.testLocation);
      // cy.get('input[id=date-input]').clear().type(cypressConstants.testDate);
      // cy.get('mat-select[id=gender-select]').click();
      // cy.get('mat-option').first().next().click({force:true});
      // cy.get('mat-select[id=ageClass]').click();
      // cy.get('mat-option').first().next().click({force:true});
      // cy.get('mat-select[id=rank]').click();
      // cy.get('mat-option').first().next().click({force:true});
      // cy.get('mat-select[id=weight]').click();
      // cy.get('mat-option').first().next().click({force:true});
      cy.get('button[id=new-match-submit-button]').click();
      cy.get('button[id=add-to-queue-modal-button]').click({force:true});
      cy.contains("Match Already Exists in the Database").should('exist');
    // });
  });

});
