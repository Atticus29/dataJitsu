/// <reference types="cypress" />
describe ('Match custom match tests: no gi rank', () =>{

  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });
  afterEach(() =>{
    cy.logout();
  });
  it('adds custom thing and submits new match', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.newVideoUrl);
      cy.fillInMatchCreationDetailsWithCustomNoGiRank(cypressConstants.customNoGiRankName);
      cy.get('button[id=new-match-submit-button]').click({force:true});
      cy.wait(2000);
      cy.get('h4').contains('Annotate your submission?').click({force:true});
      cy.get('button[id=add-to-queue-modal-button]').click({force:true});
      cy.contains(cypressConstants.testIndividualName, {timeout:50000}).should('exist');
      cy.get('div[class=mat-select-arrow]').click();
      cy.contains('500').click({timeout:5000});
      cy.wait(3000);
      cy.contains(cypressConstants.customNoGiRankName, {timeout:5000}).should('exist');
    });
  });

  it('approves name in admin and checks that it is on the dropdown list now', function(){
    cy.logout();
    cy.loginAsAdmin();
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.adminUrl);
      cy.wait(4000);
      cy.approveGeneric(cypressConstants.customNoGiRankName);
      cy.visit(cypressConstants.newVideoUrl, {timeout:5000});
      cy.wait(3000);
      cy.get(`mat-select[id="${cypressConstants.noGiRankSelectName}"`).click({force:true}).then(() => {
        cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text`).should('contain', cypressConstants.customNoGiRankName);
      });
  });
  });

  it('cannot create a custom thing that has already been created and approved, then deletes the thing from admin page and confirms that it is missing from dropdown list', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.newVideoUrl);
      cy.get('input[id=videoUrl]').clear().type(cypressConstants.testVideoUrl2, {timeout:5000});
      cy.selectCustomNoGiRank(cypressConstants.customNoGiRankName);
      cy.contains(cypressConstants.alreadyExistsNotification).should('exist');
    });
  });

  it('then deletes the thing from admin page and confirms that it is missing from dropdown list', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.log("deletes the thing from admin page and confirms that it is missing from dropdown list");
      cy.deleteGeneric(cypressConstants.customNoGiRankName);
      cy.visit(cypressConstants.newVideoUrl);
      cy.get('input[id=videoUrl]', {timeout:5000}).clear().type(cypressConstants.testVideoUrl2, {timeout:5000});
      cy.get(`mat-select[id="${cypressConstants.noGiRankSelectName}"`).click({force:true}).then(() => {
        cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text`).should('not.contain', cypressConstants.customNoGiRankName);
      });
    });
  });

  it('deletes match, creates new match with custom thing', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      //First delete the match that already exists
      cy.log("First delete the match that already exists");
      cy.deleteMatch(cypressConstants.testLocation4);

      //Now creates a new match with custom thing
      cy.log("Now creates a new match with custom thing");
      cy.visit(cypressConstants.newVideoUrl);
      cy.fillInMatchCreationDetailsWithCustomNoGiRank(cypressConstants.customNoGiRankName);
      cy.get('button[id=new-match-submit-button]').click({force:true});
      cy.wait(2000);
      cy.get('h4').contains('Annotate your submission?').click({force:true});
      cy.get('button[id=add-to-queue-modal-button]').click({force:true});
      cy.contains(cypressConstants.testIndividualName, {timeout:50000}).should('exist');
      cy.get('div[class=mat-select-arrow]').click({force:true});
      cy.contains('500').click({force:true});
      cy.contains(cypressConstants.customNoGiRankName).should('exist');
    });
  });

  it('disapproves the custom thing from the admin page, checks that the custom thing has been re-named, and removes the now-renamed match', function(){
    cy.logout();
    cy.loginAsAdmin();
    cy.log("disapprove custom thing");
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit(cypressConstants.adminUrl);
      cy.disapproveGeneric(cypressConstants.customNoGiRankName);
      cy.visit(cypressConstants.newVideoUrl, {timeout:5000});

      cy.log("check custom thing has been renamed");
      cy.get(`mat-select[id="${cypressConstants.noGiRankSelectName}"`).click({force:true}).then(() => {
        cy.get(`.cdk-overlay-container .mat-select-panel .mat-option-text`).should('not.contain', cypressConstants.customNoGiRankName);
      });
      cy.visit(cypressConstants.allVideosUrl, {timeout:5000});
      cy.wait(2000);
      cy.get('div[class=mat-select-arrow]', {timeout:5000}).click({force:true});
      cy.contains('span[class=mat-option-text]','500').click({force:true});
      cy.wait(2000);
      cy.contains(cypressConstants.noGiRankNameRemovedMessage).should('exist');
      cy.log("delete match")
      cy.deleteMatch(cypressConstants.testLocation4);
    });

  });

});
