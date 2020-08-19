
/// <reference types="cypress" />
describe('Login tests with no beforeEach', ()=>{
  it.skip('logout works', () => {
    cy.logout();
  });
});

describe ('Login tests', () =>{
  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.allVideosUrl);
    });
  });

  afterEach(() =>{
    cy.logout();
  })

  it('loads', () =>{
    cy.contains("Login");
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      // cy.contains(cypressConstants.title).should('exist');
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  it.skip('signs up a new user', () =>{ //TODO make the signs up a new user test pass
    function makeid(length) {
       var result = '';
       var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
       var charactersLength = characters.length;
       for ( var i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;
    }
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.createAccountUrl);
      cy.get('input[id=affiliation]').type(cypressConstants.affiliation);
      cy.get('input[id=password]').type(cypressConstants.pass);
      cy.get('input[id=email]').type("test" + makeid(7) + "@gmail.com"); //TODO add random letters here
      cy.get('input[id=userName]').type("Bob" + makeid(7));
      cy.get('input[id=weight]').type(cypressConstants.weight);
    });
    //Now the options
    cy.get('#gender').select('Female', {force: true});
    cy.get('#gender').contains('Female');

    cy.get('#ageClass').select('Adult', {force:true});
    cy.get('#ageClass').contains('Adult');

    cy.get('#noGiRank').select('Elite',{force: true});
    cy.get('#noGiRank').contains('Elite');

    cy.get('#giRank').select('Black belt',{force: true});
    cy.get('#giRank').contains('Black belt');

    cy.get('#age').select('27',{force: true});
    cy.get('#age').contains('27');

    cy.get('#age').select('27',{force: true});
    cy.get('#age').contains('27');

    cy.get('button[id=create-button]').click({force:true});
    cy.wait(5000); //this wait seems essential to give the uid async call time to finish up. Don't know how to make less brittle
  });

  it('blocks protected routes', () =>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
      cy.contains("Rank").should('exist');
      cy.logout();
      cy.visit(cypressConstants.allVideosUrl);
      cy.wait(2000);
      cy.url().should('match',/login/);
      cy.contains("Rank").should('not.exist');
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

});
