describe ('Tests involving admin privleges and deletions', () =>{

  beforeEach(()=>{
    cy.loginAsAdmin();
  });

  it('sees delete as an option in the table', function(){
    cy.contains("Delete Match").should('exist');
  });

  it('deletes a match containing Alfie as athlete 1', function(){ //TODO brittle right now
    cy.get('button[class=mat-paginator-navigation-previous]').click();
    cy.get('mat-cell[id=Alfie]>button').click();
  });
});
