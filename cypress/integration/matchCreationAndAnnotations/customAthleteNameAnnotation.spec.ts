/// <reference types="cypress" />
describe ('Match custom athlete name annotation tests', () =>{

  beforeEach(()=>{
    // cy.visit('http://localhost:4200/');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  afterEach(() =>{
    cy.logout();
  });

  it.only('creates match with two write-in names', function(){
    cy.visit('http://localhost:4200/newmatch');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.fillInMatchCreationDetailsWithWriteInAthleteNames(cypressConstants.athlete1FirstName, cypressConstants.athlete1LastName, cypressConstants.athlete2FirstName, cypressConstants.athlete2LastName);
      cy.get('button[id=new-match-submit-button]').click({force:true});
      cy.wait(2000);
      cy.get('h4').contains('Annotate your submission?').click({force:true});
      cy.get('button[id=add-to-queue-modal-button]').click({force:true});

      //check it Exists
      cy.visit('http://localhost:4200/matches');
      cy.wait(2000);
      cy.get('div[class=mat-select-arrow]').click({force:true});
      cy.contains('500').click({force:true});
      cy.contains(cypressConstants.athlete1FirstName);
      cy.contains(cypressConstants.athlete1LastName);
      cy.contains(cypressConstants.athlete2FirstName);
      cy.contains(cypressConstants.athlete2LastName);
    });
  });

  it('votes one name up and one down, deletes the upvoted name, and checks that one of the two has been re-named in the table', function(){
    //log out and log in as admin
    cy.logout();
    cy.loginAsAdmin();

    //go to admin info and thumb down one athlete name, approve the other, than delete it
    cy.log("go to admin info and thumb down one athlete name, approve the other, than delete it");
    cy.visit('http://localhost:4200/admin');
    cy.wait(2000);
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.get('li').contains(cypressConstants.athlete1FirstName, {timeout: 5000}).find('i[id=down]').click({force:true});
      cy.get('li').contains(cypressConstants.athlete1FirstName, {timeout: 5000}).should('not.exist');
      cy.get('li').contains(cypressConstants.athlete2FirstName, {timeout: 5000}).find('i[id=up]').click({force:true});
      cy.get('li').contains(cypressConstants.athlete2FirstName, {timeout: 5000}).should('exist');
      cy.get('li').contains(cypressConstants.athlete2FirstName, {timeout: 5000}).find('i[id=delete]').click({force:true});
      cy.get('li').contains(cypressConstants.athlete2FirstName, {timeout: 5000}).should('not.exist');;
    });

    //check that one is now unknown name and the other is still the same name
    cy.log("check that one is now unknown name and the other is still the same name");
    cy.visit('http://localhost:4200/matches');
    cy.wait(2000);
    cy.get('div[class=mat-select-arrow]').click({force:true});
    cy.contains('500').click({force:true});
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains('Un-named Athlete');
      cy.contains(cypressConstants.athlete2FirstName, {timeout: 5000});
      cy.contains(cypressConstants.athlete2LastName, {timeout: 5000});
    });
  });

  it('deletes match', function(){
    //delete this match
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.log("delete this match");
      cy.deleteMatch(cypressConstants.testLocation);
    });
    // cy.logout();
    // cy.loginAsAdmin();
    // cy.visit('http://localhost:4200/matches');
    // // cy.wait(2000);
    // cy.get('div[class=mat-select-arrow]').click({timeout:5000});
    // cy.contains('500').click({force:true});
    // cy.fixture('cypressConstants.json').then((cypressConstants)=>{
    //   cy.get('mat-cell[id=APineappleUnderTheSea]>button').last().click({timeout:5000});
    //   // cy.contains(cypressConstants.athlete2FirstName).find('button').click({force:true});
    //   // cy.get('mat-cell>button').contains(cypressConstants.athlete2FirstName).click({force:true});
    // });
  })

});
