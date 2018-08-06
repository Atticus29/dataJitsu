/// <reference types="cypress" />

import Chance from 'chance';
const chance = new Chance();

describe ('Firestarter', () =>{
  const email = chance.email();
  const name = chance.name();
  const pass = 'ValidPassword23';
  const age = '33';
  const weight = '149';
  const noGiRank = 'Advanced';
  const giRank = 'Brown';
  const ageClass = 'Adult';
  const gender = 'Male';
  const affiliation = 'Straight Blast Gym';

  beforeEach(()=>{
    cy.visit('http://localhost:4200');
  });

  it('has a title', () =>{
    cy.contains('Match Annotator');
  });

  it('signs up a new user', () =>{
    cy.get('button[id=new-account-button]').click();
    cy.get('input[id=affiliation]').type(affiliation);
    cy.get('input[id=password]').type(pass);
    cy.get('input[id=userName]').type(name);
    cy.get('input[id=email]').type(email);

    //Now the options
    cy.get('[name="chooseGender"]').click({force: true});
    cy.get('option').contains("Female").then(option =>{
      cy.wrap(option).contains("Female");
      console.log(option);
      // option[1].click();
    });

    cy.get('[name=chooseAgeClass]').click({force: true});
    cy.get('option').contains("Adult").then(option =>{
      cy.wrap(option).contains("Adult");
      option[0].click();
    });
    cy.get('input[id=weight]').type(weight);
    cy.get('[name=chooseNoGiRank]').click({force: true});
    cy.get('option').contains("Elite").then(option =>{
      cy.wrap(option).contains("Elite");
      option[0].click();
    });

    cy.get('[name=chooseGiRank]').click({force: true});
    cy.get('option').contains("Black belt").then(option =>{
      cy.wrap(option).contains("Black belt");
      option[0].click();
    })
    cy.get('[name="chooseAge"]').click({force: true});
    cy.get('option').contains("27").then(option =>{
      cy.wrap(option).contains("27");
      option[0].click();
    });
    cy.get('button[id=create-button]').click();
    // cy.contains('Rank'); //TODO make this something more permanent and inside the fixtures directory
  })

  it('blocks protected routes', () =>{

  });
});
