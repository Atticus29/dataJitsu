/// <reference types="jest" />
import { fun } from './test-config';
fun.cleanup;

import { db, stripe } from '../src/config';

test('foo', ()=>{
  expect(true).toBe(true);
});

test('Firestore is initialized', () => {
    expect(db).toBeDefined();
});

test('Stripe is initialized', () => {
    expect(stripe).toBeDefined();

});
