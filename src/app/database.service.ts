import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/scan';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Match } from './match.model';
import { User } from './user.model';

@Injectable()
export class DatabaseService {
  matches: FirebaseListObservable<any>;
  weightClasses: FirebaseListObservable<any>;
  giRanks: FirebaseListObservable<any>;
  noGiRanks: FirebaseListObservable<any>;
  ageClasses: FirebaseListObservable<any>;
  users: FirebaseListObservable<any>;

  constructor(private db: AngularFireDatabase) {
    this.matches = db.list('/matches');
    this.weightClasses = db.list('/weightClasses');
    this.giRanks = db.list('/giRanks');
    this.noGiRanks = db.list('/noGiRanks');
    this.ageClasses = db.list('/ageClasses');
    this.users = db.list('/users');
  }

  //@TODO add matchID key inside match node

  getUserByUid(uid: string){
    let ref = firebase.database().ref('users/');
    ref.orderByChild('uid').equalTo(uid).limitToFirst(1).on("child_added", snapshot=>{
      console.log("got to snapshot in getUserByUid");
      console.log(snapshot);
    });
  }

  getNodeIdFromEmail(email: string){
    let ref = firebase.database().ref('users/');
    return ref.orderByChild('email').equalTo(email).limitToFirst(1);
  }

  getUserById(userId: string){
    let retrievedUser = this.db.object('users/' + userId);
    return retrievedUser;
  }

  addMatchToDb(match: Match){
    let matchId = this.matches.push(match).key;
  }

  addUserToDb(user: User){
    let userId = this.users.push(user).key;
    let updates = {};
    updates['/users/'+userId + '/id'] = userId;
    firebase.database().ref().update(updates);
  }

  updateUserInDb(user: User){
    console.log(user.getId());
    let updates = {};
    updates['/users/' + user.getId()] = user;
    firebase.database().ref().update(updates);
  }

  addWeightClassToDb(weightClass: string){
    this.weightClasses.push(weightClass);
  }

  getWeightClassById(id: string){
    return this.db.object('/weightClasses/' + id);
  }

  getWeightClasses(){
    return this.weightClasses;
  }

  getAgeClasses(){
    return this.ageClasses;
  }

  getGiRanks(){
    return this.giRanks;
  }

  getNoGiRanks(){
    return this.noGiRanks;
  }

  addGiRankToDb(rank: string){
    this.giRanks.push(rank);
  }

  addNoGiRankToDb(rank:string){
    this.noGiRanks.push(rank);
  }

  addAgeClassToDb(ageClass: string){
    this.ageClasses.push(ageClass);
  }
}
