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
    cy.get('input[id=weight]').type(weight);
    //Now the options
    cy.get('#gender').select('Female', {force: true});
    cy.get('#gender').contains('Female');

    cy.get('#ageClass').select('Adult', {force:true});
    cy.get('#ageClass').contains('Adult');

    //TODO fix all of the below to be like the above
    cy.get('#noGiRank').select('Elite',{force: true});
    cy.get('#noGiRank').contains('Elite');

    cy.get('#giRank').select('Black belt',{force: true});
    cy.get('#giRank').contains('Black belt');

    cy.get('#age').select('27',{force: true});
    cy.get('#age').contains('27');

    cy.get('#age').select('27',{force: true});
    cy.get('#age').contains('27');

    cy.get('button[id=create-button]').click();
  })

  it('blocks protected routes', () =>{

  });

  it('logs in', ()=>{
    cy.visit('http://localhost:4200/login');
    cy.get('input[id=userEmail]').type(email);
    cy.get('input[id=password]').type(pass);
    cy.get('button[id=loginSubmit]').click();
    cy.contains('Match Rating');
  });

  it('logs out', ()=>{
    cy.visit('http://localhost:4200/login');
    cy.get('input[id=userEmail]').type(email);
    cy.get('input[id=password]').type(pass);
    cy.get('button[id=loginSubmit]').click();
    cy.contains('Match Rating');
    cy.get('a[id=logOutLink]').click();
    cy.contains('Log In');
  });
});
