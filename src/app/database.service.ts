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
import { TextTransformationService } from './text-transformation.service';

@Injectable()
export class DatabaseService {
  matches: FirebaseListObservable<any>;
  weightClasses: FirebaseListObservable<any>;
  giRanks: FirebaseListObservable<any>;
  noGiRanks: FirebaseListObservable<any>;
  ageClasses: FirebaseListObservable<any>;
  users: FirebaseListObservable<any>;
  currentUser: FirebaseListObservable<any>;
  moves: FirebaseListObservable<any>;

  constructor(private db: AngularFireDatabase, private textTransformationService: TextTransformationService) {
    this.matches = db.list('/matches');
    this.weightClasses = db.list('/weightClasses');
    this.giRanks = db.list('/giRanks');
    this.noGiRanks = db.list('/noGiRanks');
    this.ageClasses = db.list('/ageClasses');
    this.users = db.list('/users');
    this.moves = db.list('/moves');
  }

  getLowRatedMatch(){
    let ref = firebase.database().ref('matches/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('/matchDeets/annotationRating').limitToFirst(1).on("child_added", snapshot=>{
        observer.next(snapshot.val());
      });
    });
    return obsRet;
  }

  updateUserPaymentStatus(userId: string, newStatus: boolean){
    let updates = {};
    updates['/users/' + userId + '/paidStatus'] = newStatus;
    firebase.database().ref().update(updates);
  }

  getKeyOfMovesEntry(){

  }

  getMoves(){
    let ref = firebase.database().ref('moves/');
    let obsRet = Observable.create(function(observer){
      ref.orderByKey().on("child_added", snapshot=>{
        observer.next(snapshot.val());
      });
    });
    return obsRet;
  }

  getMovesKeys(){
    let ref = firebase.database().ref('moves/');
    let textTransformationService: TextTransformationService = new TextTransformationService();
    // return ref;
    let obsRet = Observable.create(function(observer){
      ref.orderByKey().on("value", snapshot=>{
        let childKeys = [];
        snapshot.forEach(function(childSnapshot){
          let category = textTransformationService.convertCamelCaseToSentenceCase(childSnapshot.key);
          childKeys.push(category);
          return false;
        });
        observer.next(childKeys);
      });
    });
    return obsRet;
  }

  getMatches(){
    return this.db.object('/matches');
  }

  getMatchCount(){ //TODO this is very inefficient. Some not-great leads here: https://stackoverflow.com/questions/15148803/in-firebase-is-there-a-way-to-get-the-number-of-children-of-a-node-without-load
    let ref = firebase.database().ref('matches/');
    let queryObservable = Observable.create(function(observer){
      ref.once('value').then(function(snapshot){
        observer.next(snapshot.numChildren());
      });
    });
    return queryObservable;
  }

  getMatchesFilteredPaginator(keyToStartWith: string, pageSize:number){
    let ref = firebase.database().ref('matches/');
    let queryObservable = Observable.create(function(observer){
      ref.orderByKey().startAt(keyToStartWith).limitToFirst(pageSize).once("value", snapshot =>{
        observer.next(snapshot.val());
      });
    });
    return queryObservable;
  }

  getKeyOfMatchToStartWith(pageIndex: number, pageSize: number){
    let firstKeyToStartWith = null;
    let ref = firebase.database().ref('matches/');
    let startNumber = (pageIndex)*pageSize+1;
    let queryObservable = Observable.create(function(observer){
      ref.orderByKey().limitToFirst(startNumber).once('value', function(snapshot) {
        snapshot.forEach((childSnapshot) => {
          firstKeyToStartWith = childSnapshot.key;
          return false;
        });
        observer.next(firstKeyToStartWith);
      });
    });
    return queryObservable;
  }

  // getMatchesFiltered(matchId: string, filter: string, sortDirection: string, pageIndex: number, pageSize: number){ //TODO remove or fix
  // }

  hasUserPaid(userId: string){
    return this.db.object('/users/'+ userId + '/paidStatus'); //TODO check that there is an annotation status and that this is the firebase path to it
  }

  getDateSinceAnnotated(userId: string){
    return this.db.object('/users/' + userId + '/dateLastAnnotated');  //TODO check that there is an annotation status and that this is the firebase path to it
  }

  hasBeenAnnotated(videoId: string){
    return this.db.object('/matches/'+ videoId + '/annotationStatus'); //TODO check that there is an annotation status and that this is the firebase path to it
  }

  //@TODO fix getUserByUid below low priority 05/11/2018 only would get used in app.component
  getUserByUid(uid: string){
    // console.log("got to getUserByUid call");
    let ref = firebase.database().ref('users/');
    let user: User = null;
    // let temp = ref.orderByChild('uid').equalTo(uid).limitToFirst(1).once('value').then(function(snapshot){
    //   this.currentUser = snapshot.val();
    //   console.log(this.currentUser);
    // });
    ref.orderByChild('uid').equalTo(uid).limitToFirst(1).on("child_added", snapshot => {
      // console.log(snapshot.key);
      return this.getUserById(snapshot.key);
    });
    // return true;
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

  addMovesListToDb(moves: any){
    let updates = {};
    updates['/moves'] = moves;
    firebase.database().ref().update(updates);
      // this.moves.push(moves);
  }

  getUserById(userId: string){
    let retrievedUser = this.db.object('users/' + userId);
    return retrievedUser;
  }

  addMatchToDb(match: any){
    let matchId = this.matches.push(match).key;
    let updates = {};
    updates['/matches/' + matchId + '/id'] = matchId;
    updates['/matches/' + matchId + '/matchCreated'] = firebase.database.ServerValue.TIMESTAMP;
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
