describe ('Tests involving admin privleges and deletions', () =>{

  beforeEach(()=>{
    cy.loginAsAdmin();
  });

  afterEach(() =>{
    cy.logout();
  });

  it('creates a match', function(){
    cy.wait(1000);
    cy.visit('http://localhost:4200/newmatch');
    cy.fillInMatchCreationDetails();
    cy.get('button[id=new-match-submit-button]').click();
    cy.wait(2000);
    cy.get('button[id=add-to-queue-modal-button]').click({force:true});
    cy.wait(2000);
    cy.url().should('not.match',/newmatch/);
  });


  it('sees delete as an option in the table', function(){
    cy.contains("Delete Match").should('exist');
  });

  it('deletes a match containing Alfie as athlete 1', function(){ //TODO brittle right now
    // cy.get('button[class=mat-paginator-navigation-previous]').click();
    cy.get('mat-cell[id=Alfie]>button').click();
  });
});
