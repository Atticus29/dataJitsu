/// <reference types="cypress" />
describe ('All-videos page tests', () =>{

  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  afterEach(() =>{
    cy.logout();
  });

  it('Clicks on a match', ()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      // cy.login(cypressConstants.usrnm,cypressConstants.passw);
      cy.contains('Match Rating');
      cy.contains('Video');
      cy.wait(15000);
      cy.get('input[id=table-filter-input]').click({force:true});
      cy.contains(cypressConstants.testIndividualName, {timeout:60000});
      cy.get('a[name=videoClick]').first().click({force:true});
      cy.contains('vs.');
      cy.contains('Age Class');
      cy.contains('Location');
    });
  });

  it('still sees populated table upon reload of the all-matches page', ()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains('Match Rating');
      cy.contains('Video');
      cy.visit(cypressConstants.allVideosUrl);
      cy.contains('Match Rating');
      // cy.wait(15000);
      cy.contains(cypressConstants.testIndividualName, {timeout:60000});
    });
  });

  it('uses table filter feature successfully', ()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      // cy.logout();
      // cy.loginAsAdmin();
      cy.get('input[id=table-filter-input]').click({force:true});
      cy.contains(cypressConstants.unfilteredExpectationText, {timeout:60000}).should('exist');
      cy.get('input[id=table-filter-input]').type(cypressConstants.filterCriteria);
      cy.contains(cypressConstants.unfilteredExpectationText, {timeout: 60000}).should('not.exist');
    });
  });

  it('does not see delete match as an option until logged in as admin', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      // cy.login(cypressConstants.usrnm,cypressConstants.passw);
      cy.contains("Delete Match", {timeout: 60000}).should('not.be.visible');
      cy.logout();
      cy.loginAsAdmin();
      cy.contains("Delete Match", {timeout: 60000}).should('be.visible');
    });
  });

});
