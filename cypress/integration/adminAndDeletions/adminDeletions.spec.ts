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
    cy.get('button[id=new-match-submit-button]').click(});
    cy.wait(2000);
    cy.get('button[id=add-to-queue-modal-button]').click({force:true});
    cy.wait(2000);
    cy.url().should('not.match',/newmatch/);
  });


  it('sees delete as an option in the table', function(){
    cy.contains("Delete Match").should('exist');
  });

  it('deletes a match containing APineappleUnderTheSea as location', function(){
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    // cy.get('button[class=mat-paginator-navigation-previous]').click();
    cy.get('mat-cell[id=APineappleUnderTheSea]>button').click();
  });
});
