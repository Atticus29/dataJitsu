describe ('Tests involving match creation', () =>{

  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  after(() =>{
    //And delete the match just for cleanup
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
      cy.deleteMatch(cypressConstants.testLocation);
    });
  });

  afterEach(() =>{
    cy.logout();
  });

  it('creates a match', function(){
    cy.visit('http://localhost:4200/newmatch');
    cy.fillInMatchCreationDetails();
    cy.get('button[id=new-match-submit-button]').click({force:true});
    cy.wait(2000);
    cy.get('h4').contains('Annotate your submission?').click({force:true});
    cy.get('button[id=add-to-queue-modal-button]').click({force:true});
    cy.url().should('not.match',/newmatch/);
    cy.url().should('match',/matches/);
  });

  it('created match appears on table', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.get('div[class=mat-select-arrow]').click({force:true});
      cy.contains('500').click({force:true});
      cy.contains(cypressConstants.testLocation).should('exist');
    });
  });

  it('cannot create duplicate match', function(){
    cy.visit('http://localhost:4200/newmatch');
    cy.fillInMatchCreationDetails();
      cy.get('button[id=new-match-submit-button]').click({force:true});
      cy.get('button[id=add-to-queue-modal-button]').click({force:true});
      cy.contains("Match Already Exists in the Database").should('exist');
  });

});
