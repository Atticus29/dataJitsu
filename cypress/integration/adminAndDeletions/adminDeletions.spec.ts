describe ('Tests involving admin privleges and deletions', () =>{

  beforeEach(()=>{
    // cy.visit('http://localhost:4200/');
    cy.loginAsAdmin();
  });

  it('sees delete as an option in the table', function(){
    cy.contains("Delete Match").should('exist');
  });
});
