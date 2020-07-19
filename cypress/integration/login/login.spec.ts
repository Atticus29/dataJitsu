
/// <reference types="cypress" />
describe('Login tests with no beforeEach', ()=>{
  it.skip('logout works', () => {
    cy.logout();
  });
});

describe ('Login tests', () =>{
  beforeEach(()=>{
    // cy.logout();
    cy.visit('http://localhost:4200/');
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
    cy.visit('http://localhost:4200/createaccount');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
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
    });
    cy.contains("Rank").should('exist');
    cy.logout();
    cy.visit('localhost:4200/matches');
    cy.wait(2000);
    cy.url().should('match',/login/);
    cy.contains("Rank").should('not.exist');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  it.skip('logs out', ()=>{
    cy.logout();
  });

  it('logs back in and clicks on a match', ()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
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

  it('plays and pauses a match', ()=>{ //TODO needs work
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
      cy.contains('Match Rating');
      cy.contains('Video');
      cy.wait(15000);
      cy.contains(cypressConstants.testIndividualName, {timeout:60000});
      cy.get('a[name=videoClick]').first().click({force:true});
      cy.contains('vs.');
      cy.wait(2000);
      cy.get('a[id=play]').click({force:true});
      cy.wait(3000);
      cy.get('a[id=pause-vid]').click({force:true});
      cy.contains('Add an annotation to the match');
    });;
  });

  it('still sees the table upon reload of the all-matches page', ()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
      cy.contains('Match Rating');
      cy.contains('Video');
      cy.visit('http://localhost:4200/');
      cy.contains('Match Rating');
      cy.wait(15000);
      cy.contains(cypressConstants.testIndividualName, {timeout:60000});
    });
  });

  it('does not see delete match as an option because not logged in as admin', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
    cy.contains("Delete Match").should('not.exist');
  });
});
