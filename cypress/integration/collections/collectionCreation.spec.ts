describe ('Tests involving match creation', () =>{
  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  after(() =>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      // cy.logout();
    });
  });

  afterEach(() =>{
    cy.logout();
  });

  it.only('fills out simple collection form and can see collection in user section', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName)
    });
  });

});
