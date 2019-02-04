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
    cy.visit('/');
  });

  it('logs out intially might fails', ()=>{
    // cy.visit('http://localhost:4200');
    cy.get('a[id=logOutLink]').click();
    cy.contains('Log In');
  });

  it('has a title', () =>{
    cy.contains('Match Annotator').should('exist');
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


  it('logs back in and clicks on a match', ()=>{
    cy.visit('http://localhost:4200/login');
    cy.get('input[id=userEmail]').type(email);
    cy.get('input[id=password]').type(pass);
    cy.get('button[id=loginSubmit]').click();
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.get('a[name=videoClick]').first().click();
    cy.contains('vs.');
    cy.contains('Age Class');
    cy.contains('Location');
  });

  it('plays and pauses a match', ()=>{
    cy.visit('http://localhost:4200');
    cy.get('a[id=logOutLink]').click();
    cy.contains('Log In');
    cy.visit('http://localhost:4200/login');
    cy.get('input[id=userEmail]').type(email);
    cy.get('input[id=password]').type(pass);
    cy.get('button[id=loginSubmit]').click();
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.get('a[name=videoClick]').first().click();
    cy.contains('vs.');
    cy.get('a[id=play]').click({force:true});
    cy.wait(5000);
    cy.get('a[id=pause-vid]').click({force:true});
    cy.contains('Add an annotation to the match');
  });

  it('still sees the table upon reload of the all-matches page', ()=>{
    cy.visit('http://localhost:4200');
    cy.get('a[id=logOutLink]').click();
    cy.contains('Log In');
    cy.visit('http://localhost:4200/login');
    cy.get('input[id=userEmail]').type(email);
    cy.get('input[id=password]').type(pass);
    cy.get('button[id=loginSubmit]').click();
    cy.contains('Match Rating');
    cy.contains('Click');
    cy.visit('http://localhost:4200/');
    cy.contains('Match Rating');
    cy.contains('Adult'); //TODO improve
  });
});
