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
  // user: FirebaseListObservable<any>;

  constructor(private db: AngularFireDatabase) {
    this.matches = db.list('/matches');
    this.weightClasses = db.list('/weightClasses');
    this.giRanks = db.list('/giRanks');
    this.noGiRanks = db.list('/noGiRanks');
    this.ageClasses = db.list('/ageClasses');
    this.users = db.list('/users');
  }

  hasUserPaid(userId: string){
    return this.db.object('/users/'+ userId + '/paidStatus'); //TODO check that there is an annotation status and that this is the firebase path to it
  }

  getDaysSinceAnnotated(userId: string){
    return this.db.object('/users/' + userId + '/dateLastAnnotated');  //TODO check that there is an annotation status and that this is the firebase path to it
  }

  hasBeenAnnotated(videoId: string){
    return this.db.object('/matches/'+ videoId + '/annotationStatus'); //TODO check that there is an annotation status and that this is the firebase path to it
  }

  //@TODO add matchID key inside match node

  //@TODO fix getUserByUid below
  getUserByUid(uid: string){
    console.log("got to getUserByUid call");
    let ref = firebase.database().ref('users/');
    let user: User = null;
    return ref.orderByChild('uid').equalTo(uid).limitToFirst(1).once('value');
    // });
    // return Observable.of(ref.orderByChild('uid').equalTo(uid).limitToFirst(1));
    // .on("child_added", snapshot=>{
    //   console.log(snapshot.key);
    //   user = snapshot;
    //   return this.user;
    // });
    // if (user != null){
    //   return Observable.of(user);
    // } else{
    //   throw new TypeError("user was null in getUserByUid in database.service");
    // }
  }

  getMatchFromNodeKey(key: string){
    let retrievedMatch = this.db.object('matches/' + key);
    return retrievedMatch;

  }

  //@TODO figure out how this is actually done, then replace the code in authorization.service (at least!)
  getNodeIdFromEmail(email: string){
    let ref = firebase.database().ref('users/');
    return ref.orderByChild('email').equalTo(email).limitToFirst(1);
  }

  addUidToUser(uid: string, userKey: string){
    let updates = {};
    updates['/users/' + userKey + '/uid'] = uid;
    firebase.database().ref().update(updates);
  }

  getUserById(userId: string){
    let retrievedUser = this.db.object('users/' + userId);
    return retrievedUser;
  }

  addMatchToDb(match: any){
    let matchId = this.matches.push(match).key;
    let updates = {};
    updates['/matches/' + matchId + '/id'] = matchId;
    firebase.database().ref().update(updates);
  }

  addUserToDb(user: User){
    let userId = this.users.push(user).key;
    let updates = {};
    updates['/users/'+userId + '/id'] = userId;
    firebase.database().ref().update(updates);
  }

  addUserToDbAndReturnUserId(user: User){
    let userId = this.users.push(user).key;
    let updates = {};
    updates['/users/'+userId + '/id'] = userId;
    firebase.database().ref().update(updates);
    return userId;
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
