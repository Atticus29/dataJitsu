describe ('Tests involving match creation', () =>{
  beforeEach(()=>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  after(() =>{
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.get('button[id=settings-button]').click({force:true});
      cy.contains("User Info.").should('exist');
      cy.get('button[id=user-info-button]').click({force:true});
      // cy.contains('button','User Info.').click({force:true});
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
      cy.logout();
    });
  });

  afterEach(() =>{
    // cy.logout();
  });


  it('fills out simple collection form, does not see submit button enabled until all three filled out, and can see collection in user section, and deletes collection with confirmation that it disappears', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit('http://localhost:4200/create-collection');
      // cy.contains('Submit').should('exist');
      cy.contains('button','Next').should('not.be.enabled');
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.contains('button','Next').click();
      cy.get('button[id=settings-button]').click();
      cy.contains('button','User Info.').click();
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
    });
  });

  it('can create collection form with 2 additional items', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit('http://localhost:4200/create-collection');
      cy.contains('button','Next').should('not.be.enabled');
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName);
      cy.get('button[id=add-new-item-button]').click();
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.get('input[id=itemName1]').type(cypressConstants.itemName2);
      cy.get('button[id=add-new-item-button]').first().click();
      cy.get('input[id=itemName2]').type(cypressConstants.itemName3);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.contains('button','Next').click();
      cy.get('button[id=settings-button]').click();
      cy.contains('button','User Info.').click();
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
    });
  });

  it('cannot create duplicate collection upon refresh/re-entry into the collection form page', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit('http://localhost:4200/create-collection');
      // cy.contains('Submit').should('exist');
      cy.contains('button','Next').should('not.be.enabled');
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.contains('button','Next').click();
      cy.get('button[id=settings-button]').click();
      cy.contains('button','User Info.').click();
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.visit('http://localhost:4200/create-collection');
      cy.contains('button','Next').should('not.be.enabled');
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.contains('button','Next').click();
      cy.contains(cypressConstants.collectionName).should('exist');
      cy.get('button[id=settings-button]').click();
      cy.contains('button','User Info.').click();
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
    });
  });

  it('can create collection form with 2 additional items and one additional category', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit('http://localhost:4200/create-collection');
      cy.contains('button','Next').should('not.be.enabled');
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName);
      cy.get('button[id=add-new-item-button]').click();
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.get('input[id=itemName1]').type(cypressConstants.itemName2);
      cy.get('button[id=add-new-item-button]').first().click();
      cy.get('input[id=itemName2]').type(cypressConstants.itemName3);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.get('button[id=add-new-question-group-button]').first().click();
      cy.get('button[id=new-collection-submit]').should('be.disabled');
      //categoryName, categoryElementId, itemName, itemNameElementId
      cy.fillOutSimpleCategoryWithItem(cypressConstants.secondCategoryName,'categoryName1', cypressConstants.secondItemName, 'itemName3');
      cy.contains('button','Next').click();
      cy.get('button[id=settings-button]').click();
      cy.contains('button','User Info.').click();
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
    });
  });

  it('can create collection form with 2 additional items and two additional categories and a goes back to add 2 more items from second category group, leaving a third blank', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit('http://localhost:4200/create-collection');
      cy.contains('button','Next').should('not.be.enabled');
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName);
      cy.get('button[id=add-new-item-button]').click();
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.get('input[id=itemName1]').type(cypressConstants.itemName2);
      cy.get('button[id=add-new-item-button]').first().click();
      cy.get('input[id=itemName2]').type(cypressConstants.itemName3);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.get('button[id=add-new-question-group-button]').first().click();
      cy.get('button[id=new-collection-submit]').should('be.disabled');
      //categoryName, categoryElementId, itemName, itemNameElementId
      cy.fillOutSimpleCategoryWithItem(cypressConstants.secondCategoryName,'categoryName1', cypressConstants.secondItemName, 'itemName3');
      cy.get('button[id=add-new-question-group-button]').first().click();
      cy.fillOutSimpleCategoryWithItem(cypressConstants.thirdCategoryName,'categoryName2', cypressConstants.thirdItemName, 'itemName4');
      //now go back and add two more items and click the add button one last time
      cy.get('button[id=add-new-item-button]').eq(1).click();
      cy.get('input[id=itemName5]').type(cypressConstants.fourthItemName);
      cy.get('button[id=add-new-item-button]').eq(1).click();
      cy.get('input[id=itemName6]').type(cypressConstants.fifthItemName);
      cy.get('button[id=add-new-item-button]').eq(1).click();
      cy.contains('button','Next').click();
      cy.get('button[id=settings-button]').click();
      cy.contains('button','User Info.').click();
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
    });
  });

  it('can get to second page in the stepper and add a second dropdown menu', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.visit('http://localhost:4200/create-collection');
      cy.contains('button','Next').should('not.be.enabled');
      cy.fillOutSimpleCollection(cypressConstants.collectionName, cypressConstants.categoryName, cypressConstants.itemName);
      cy.get('button[id=new-collection-submit]').should('be.enabled');
      cy.contains('button','Next').click();
      cy.fillOutSimpleOwnerQuestion(cypressConstants.questionForOwner, cypressConstants.dropDownChoice, cypressConstants.dropDownElementId);
      cy.get('button[id=add-new-question-group-button]').last().click();
      cy.fillOutOwnerQuestionGeneric(cypressConstants.genericQuestionForOwner, cypressConstants.genericQuestionForOwnerId, cypressConstants.dropDownChoice, cypressConstants.nextDropDownElementId);

      cy.get('button[id=settings-button]').click({force:true});
      cy.contains("User Info.").should('exist');
      cy.get('button[id=user-info-button]').click({force:true});
      // cy.contains('button','User Info.').click({force:true});
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
    });
  });

  it.only('can successfully submit a owner question set', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
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
      cy.contains(cypressConstants.collectionName).click({force:true});
      cy.contains(cypressConstants.genericQuestionForOwner).should('exist');
    });
  });

});
