describe ('Tests involving match creation', () =>{

  beforeEach(()=>{
    // cy.visit('http://localhost:4200/');
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw).then(()=>{
        // cy.wait(2000);
      });
    });
  });

  after(() =>{
    //And delete the match just for cleanup
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.adminEmailAddress,cypressConstants.adminPassword);
    });
    cy.visit('http://localhost:4200/matches');
    cy.wait(2000);
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    cy.get('mat-cell[id=APineappleUnderTheSea]>button').click();
    cy.logout();
  });

  afterEach(() =>{
    cy.logout();
  });

  it.only('creates a match', function(){
    cy.visit('http://localhost:4200/newmatch');
    cy.fillInMatchCreationDetails();
    cy.get('button[id=new-match-submit-button]').click();
    cy.wait(2000);
    cy.get('h4').contains('Annotate your submission?').click({force:true});
    cy.get('button[id=add-to-queue-modal-button]').click({force:true});
    cy.url().should('not.match',/newmatch/);
    cy.url().should('match',/matches/);
  });

  it('created match appears on table', function(){
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    cy.contains('APineappleUnderTheSea').should('exist');
  });

  it('cannot create duplicate match', function(){
    cy.visit('http://localhost:4200/newmatch');
    cy.fillInMatchCreationDetails();
      cy.get('button[id=new-match-submit-button]').click();
      cy.get('button[id=add-to-queue-modal-button]').click({force:true});
      cy.contains("Match Already Exists in the Database").should('exist');
  });

  it('creates match with two write-in names, votes one name up and one down, deletes the upvoted name, and checks that one of the two has been re-named in the table', function(){
    cy.visit('http://localhost:4200/newmatch');
    cy.fillInMatchCreationDetailsWithWriteInAthleteNames();
    cy.get('button[id=new-match-submit-button]').click();
    cy.wait(2000);
    cy.get('h4').contains('Annotate your submission?').click({force:true});
    cy.get('button[id=add-to-queue-modal-button]').click({force:true});

    //check it Exists
    cy.visit('http://localhost:4200/matches');
    cy.wait(2000);
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains(cypressConstants.athlete1FirstName);
      cy.contains(cypressConstants.athlete1LastName);
      cy.contains(cypressConstants.athlete2FirstName);
      cy.contains(cypressConstants.athlete2LastName);
    });

    //log out and log in as admin
    cy.logout();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.adminEmailAddress,cypressConstants.adminPassword);
    });

    //go to admin info and thumb down one athlete name, approve the other, than delete it
    cy.visit('http://localhost:4200/admin');
    cy.wait(2000);
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.get('li').contains(cypressConstants.athlete1FirstName).find('i[id=down]').click();
      cy.get('li').contains(cypressConstants.athlete1FirstName).should('not.exist');
      cy.get('li').contains(cypressConstants.athlete2FirstName).find('i[id=up]').click();
      cy.get('li').contains(cypressConstants.athlete2FirstName).should('exist');
      cy.get('li').contains(cypressConstants.athlete2FirstName).find('i[id=delete]').click();
      cy.get('li').contains(cypressConstants.athlete2FirstName).should('not.exist');;
    });

    //check that one is now unknown name and the other is still the same name
    cy.visit('http://localhost:4200/matches');
    cy.wait(2000);
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.contains('Un-named Athlete');
      cy.contains(cypressConstants.athlete2FirstName);
      cy.contains(cypressConstants.athlete2LastName);
    });
    //delete this match
    cy.logout();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.adminEmailAddress,cypressConstants.adminPassword);
    });
    cy.visit('http://localhost:4200/matches');
    cy.wait(2000);
    cy.get('div[class=mat-select-arrow]').click();
    cy.contains('500').click();
    cy.get('mat-cell[id=APineappleUnderTheSea]>button').click();
  });

});
