import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { Match } from './match.model';
import { User } from './user.model';
import { TextTransformationService } from './text-transformation.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MoveInVideo } from './moveInVideo.model';

@Injectable()
export class DatabaseService {
  matches:Observable<any>;
  weightClasses:Observable<any>;
  giRanks:Observable<any>;
  noGiRanks:Observable<any>;
  ageClasses:Observable<any>;
  users:Observable<any>;
  currentUser:Observable<any>;
  moves:Observable<any>;
  retrievedMatch:Observable<any>;
  movesAsObject: Observable<any>;
  matchDetails: Observable<any>;

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private textTransformationService: TextTransformationService) {
    this.matches = db.list<Match>('/matches').valueChanges();
    this.weightClasses = db.list<String>('/weightClasses').valueChanges();
    this.giRanks = db.list<String>('/giRanks').valueChanges();
    this.noGiRanks = db.list<String>('/noGiRanks').valueChanges();
    this.ageClasses = db.list<String>('/ageClasses').valueChanges();
    this.users = db.list<User>('/users').valueChanges();
    this.moves = db.list<String>('/moves').valueChanges(); //TODO maybe JSON?
    this.movesAsObject = db.object('/moves').valueChanges();
    // this.route.params.subscribe(params => {
    //   let matchId = params['matchId'];
    //   this.matchDetails = db.object('/matches/' + matchId + '/matchDeets').valueChanges()
    // });
  }

  getMovesInMatch(matchId: string): Observable<any>{
    return this.db.list('/matches/' + matchId + '/moves').valueChanges();
  }

  getMovesSubsetAsObject(childNodeName: string){
    //TODO SUUUPER HACKY fix this
    if (["Ankle Ligaments", "Back", "Choke Or Cervical Submissions", "Elbow", "Groin", "Knee Ligaments", "Shoulder", "Wrist"].indexOf(childNodeName)>-1){
      return this.db.object('/moves/Submissions or Submission Attempts That Scored Points/' + childNodeName).valueChanges();
    } else{
      return this.db.object('/moves/' + childNodeName).valueChanges();
    }
  }

  getMatchDetails(matchId: string){
    return this.db.object('/matches/' + matchId + '/matchDeets').valueChanges();
  }

  getMovesSubsetAsList(childNodeName: string){
    return this.db.list('/moves/' + childNodeName).valueChanges();
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

  getMovesAsObject(){
    return this.movesAsObject;
  }

  getMovesAsList(){
    return this.db.list('/moves').valueChanges();
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
    let ref = firebase.database().ref('users/');
    let user: User = null;
    // ref.orderByChild('uid').equalTo(uid).limitToFirst(1).on("child_added", snapshot => {
    //   return this.getUserById(snapshot.key);
    // });
    return ref.orderByChild('uid').equalTo(uid).limitToFirst(1);
  }

  getMatchFromNodeKey(key: string){
    this.retrievedMatch = this.db.object('matches/' + key).valueChanges();
    return this.retrievedMatch;
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
    let ref = this.db.list<Match>('/matches');
    let matchId = ref.push(match).key;
    let updates = {};
    updates['/matches/' + matchId + '/id'] = matchId;
    updates['/matches/' + matchId + '/matchCreated'] = firebase.database.ServerValue.TIMESTAMP;
    firebase.database().ref().update(updates);
  }

  addUserToDb(user: User){
    let ref = this.db.list<User>('/users');
    let userId = ref.push(user).key;
    let updates = {};
    updates['/users/'+userId + '/id'] = userId;
    firebase.database().ref().update(updates);
  }

  addUserToDbAndReturnUserId(user: User){
    let ref = this.db.list<User>('/users');
    let userId = ref.push(user).key;
    let updates = {};
    updates['/users/'+userId + '/id'] = userId;
    firebase.database().ref().update(updates);
    return userId;
  }

  addMoveInVideoToMatch(move: MoveInVideo){
    let matchId = move.getMatchId();
    let ref = this.db.list('/matches/' + matchId + '/moves');
    let moveId = ref.push(move).key;
    let updates = {};
    updates['/matches/' + matchId + '/moves/' + moveId] = move;
    firebase.database().ref().update(updates);
  }

  addMoveInVideoToUser(move: MoveInVideo, currentUserId: string){
    let now = new Date().toJSON();
    let newMove = {move, dateAdded:now};
    let matchId = move.getMatchId();
    let ref = this.db.list('/users/' + currentUserId + '/movesAnnotated');
    let moveId = ref.push(move).key;
    let updates = {};
    updates['/users/' + currentUserId + '/movesAnnotated/' + moveId] = newMove;
    firebase.database().ref().update(updates);
  }

  updateUserInDb(user: User){
    let updates = {};
    updates['/users/' + user.getId()] = user;
    firebase.database().ref().update(updates);
  }

  addWeightClassToDb(weightClass: string){
    let ref = this.db.list<String>('/weightClasses');
    ref.push(weightClass);
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
    let ref = this.db.list<String>('/giRanks');
    ref.push(rank);
  }

  addNoGiRankToDb(rank:string){
    let ref = this.db.list<String>('/noGiRanks');
    ref.push(rank);
  }

  addAgeClassToDb(ageClass: string){
    let ref = this.db.list<String>('/ageClasses');
    ref.push(ageClass);
  }

  addMatchRatingToUser(userId: string, matchId: string, rating: number){
    let updates = {};
    updates['/users/' + userId + '/matchesRated/' + matchId + '/matchRating/'] = rating;
    firebase.database().ref().update(updates);
  }

  addMatchAnnotationRatingToUser(userId: string, matchId: string, annotationRating: number){
    let updates = {};
    updates['/users/' + userId + '/matchesRated/' + matchId + '/annotationRating/'] = annotationRating;
    firebase.database().ref().update(updates);
  }
}
