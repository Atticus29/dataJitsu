describe ('Tests involving usage of a created collection', () =>{
  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      // cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  after(() =>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.get('button[id=settings-button]').click({force:true});
      cy.contains("User Info.").should('exist');
      cy.get('button[id=user-info-button]').click({force:true});
      // cy.contains('button','User Info.').click({force:true});
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionLabel).click({force:true});
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
      cy.logout();
    });
  });

  afterEach(() =>{
    // cy.logout();
  });

  it.only('can successfully submit an owner-created collection video', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
      cy.visit('http://localhost:4200/create-collection');
      cy.contains('button','Next').should('not.be.enabled');
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.contains('button','Next').click();
      cy.fillOutSimpleOwnerQuestion(cypressConstants.questionForOwner, cypressConstants.dropDownChoice, cypressConstants.dropDownElementId);
      cy.get('button[id=add-new-question-group-button]').last().click();
      cy.fillOutOwnerQuestionGeneric(cypressConstants.genericQuestionForOwner, cypressConstants.genericQuestionForOwnerId, cypressConstants.dropDownChoice, cypressConstants.nextDropDownElementId);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.contains('button','Submit').click();
      cy.get('button[id=settings-button]').click();
      cy.contains('button','User Info.').click();
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionLabel).click({force:true});
      cy.contains(cypressConstants.collectionName).click({force:true});
      cy.contains(cypressConstants.genericQuestionForOwner).should('exist');
      cy.contains(cypressConstants.newVideoButtonInCollection).click();
      cy.fillOutOwnerQuestionSetAsUserOfCollection(cypressConstants.ownerQuestion0ElementId, cypressConstants.ownerQuestion1ElementId, cypressConstants.ownerQuestion2ElementId, cypressConstants.ownerQuestion0Response, cypressConstants.ownerQuestion1Response, cypressConstants.ownerQuestion2Response);
      cy.contains(cypressConstants.newVideoSubmitButton).click();
      //TODO assert behavior of a correct submission
    });
  });

});
