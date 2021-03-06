describe ('Tests involving match creation', () =>{
  // beforeEach(()=>{
  //   cy.fixture('cypressConstants.json').then((cypressConstants)=>{
  //     cy.login(cypressConstants.usrnm,cypressConstants.passw);
  //   });
  // });

  // after(() =>{
  //   cy.fixture('cypressConstants.json').then((cypressConstants)=>{
  //     cy.get('button[id=settings-button]').click({force:true});
  //     cy.contains("User Info.").should('exist');
  //     cy.get('button[id=user-info-button]').click({force:true});
  //     // cy.contains('button','User Info.').click({force:true});
  //     cy.url().should('match',/user/);
  //     cy.contains(cypressConstants.collectionName);
  //     cy.deleteCollection(cypressConstants.collectionName);
  //     cy.contains(cypressConstants.collectionName).should('not.exist');
  //     cy.logout();
  //   });
  // });
  //
  // afterEach(() =>{
  //   // cy.logout();
  // });

  it('logs in',function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.login(cypressConstants.usrnm,cypressConstants.passw);
    });
  });

  it('can successfully submit a owner question set', function(){
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

  it('deletes collection and logs out', function(){
    cy.fixture('cypressConstants.json').then((cypressConstants)=>{
      cy.get('button[id=settings-button]').click({force:true});
      cy.contains("User Info.").should('exist');
      cy.get('button[id=user-info-button]').click({force:true});
      cy.url().should('match',/user/);
      cy.contains(cypressConstants.collectionName);
      cy.deleteCollection(cypressConstants.collectionName);
      cy.contains(cypressConstants.collectionName).should('not.exist');
      cy.logout();
    });
  });

});
