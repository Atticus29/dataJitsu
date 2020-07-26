describe ('Tests involving admin privleges and deletions', () =>{

  beforeEach(()=>{
    cy.loginAsAdmin();
  });

  afterEach(() =>{
    cy.logout();
  });

  it('creates a match', function(){
    cy.wait(1000);
    cy.visit(cypressConstants.newMatchUrl);
    cy.fillInMatchCreationDetails();
    cy.get('button[id=new-match-submit-button]').click({force:true});
    cy.wait(2000);
    cy.get('button[id=add-to-queue-modal-button]').click({force:true});
    cy.wait(2000);
    cy.url().should('not.match',/newmatch/);
  });


  it('sees delete as an option in the table', function(){
    cy.wait(3000);
    cy.contains("Delete Match").should('exist');
  });

  it('deletes a match containing APineappleUnderTheSea as location', function(){
    cy.wait(2000);
    cy.get('div[class=mat-select-arrow]').click({force:true});
    cy.contains('span[class=mat-option-text]','500').click({force:true});
    // cy.get('button[class=mat-paginator-navigation-previous]').click({force:true});
    cy.get('mat-cell[id=APineappleUnderTheSea]>button').click({force:true});
  });
});
