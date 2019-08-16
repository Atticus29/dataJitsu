import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { TextTransformationService } from './text-transformation.service';
import { User } from './user.model';
import { Match } from './match.model';
import { constants } from './constants';

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
  private ngUnsubscribe: Subject<void> = new Subject<void>();

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
      return this.db.object('/moves/Submissions or Submission Attempts/' + childNodeName).valueChanges();
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
    let ref = firebase.database().ref('/matches');
    let resultObservable = Observable.create(observer =>{
      ref.on('value', snapshot=>{
        observer.next(snapshot.val());
      });
    });
    return resultObservable;
  }

  getUserReputationPoints(userId: string){
    return this.db.object('users/' + userId + '/reputationPoints').valueChanges();
  }

  updateUserReputationPoints(userId: string, points: number){
    let updates = {};
    this.getUserReputationPoints(userId).pipe(first()).subscribe(result =>{
      // console.log("reputation points? in updateUserReputationPoints");
      // console.log(result);
      updates['/users/' + userId + '/reputationPoints'] = Number(result) + points;
      firebase.database().ref().update(updates);
    });
  }

  getMainAnnotatorOfMatch(matchId: string){
    let ref = firebase.database().ref('matches/' + matchId + '/moves');
    let queryObservable = Observable.create(function(observer){
      ref.orderByChild("annotatorUserId").on("child_added", snapshot =>{
        console.log("getMainAnnotatorOfMatch snapshot:");
        console.log(snapshot.val());
        console.log(snapshot.numChildren());
        //TODO flesh out
        observer.next(snapshot.val());
      });
    });
    return queryObservable;
  }

  getMatchCount(){ //TODO this is very inefficient. Some not-great leads here: https://stackoverflow.com/questions/15148803/in-firebase-is-there-a-way-to-get-the-number-of-children-of-a-node-without-load
    let ref = firebase.database().ref('matches/');
    let queryObservable = Observable.create(function(observer){
      ref.on('value', snapshot=>{
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
    let ref = firebase.database().ref('users/' + userId + '/paymentStatus');
    let resultObservable = Observable.create(observer =>{
      ref.on("value", snapshot => {
        // console.log(snapshot);
        status = snapshot.val();
        observer.next(status);
      });
    });
    return resultObservable;
  }

  getDateSinceAnnotated(userId: string){
    return this.db.object('/users/' + userId + '/dateLastAnnotated');  //TODO check that there is an annotation status and that this is the firebase path to it
  }

  hasBeenAnnotated(videoId: string){
    return this.db.object('/matches/'+ videoId + '/annotationStatus'); //TODO check that there is an annotation status and that this is the firebase path to it
  }

  getUserByUid(uid: string){
    let ref = firebase.database().ref('users/');
    let user: User = null;
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild('uid').equalTo(uid).limitToFirst(1).on("child_added", snapshot => {
        user = snapshot.val();
        observer.next(user);
      });
    });
    return resultObservable;
  }

  getMatchFromNodeKey(key: string){
    this.retrievedMatch = this.db.object('matches/' + key).valueChanges();
    return this.retrievedMatch;
  }

  //@TODO figure out how this is actually done, then replace the code in authorization.service (at least!)
  getNodeIdFromEmail(email: string){
    console.log("got to getNodeIdFromEmail in database service");
    let ref = firebase.database().ref('users/');
    let user: User = null;
    let resultObservable = Observable.create(observer =>{
      return ref.orderByChild('email').equalTo(email).limitToFirst(1).on("child_added", snapshot => {
        console.log("got to snapshot in getNodeIdFromEmail in database service");
        user = snapshot.val();
        observer.next(user);
      });
    });
    return resultObservable;
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
    // console.log("addMatchToDb entered");
    let ref = this.db.list<Match>('/matches');
    let matchId = ref.push(match).key;
    let updates = {};
    updates['/matches/' + matchId + '/id'] = matchId;
    updates['/matches/' + matchId + '/matchCreated'] = firebase.database.ServerValue.TIMESTAMP;
    firebase.database().ref().update(updates);
    return matchId;
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
    console.log("entered addMoveInVideoToUser");
    let now: string = new Date().toJSON();
    // let newMove = {move, dateAdded:now};
    let matchId = move.getMatchId();
    let ref = this.db.list('/users/' + currentUserId + '/movesAnnotated');
    let moveId = ref.push(move).key;
    let updates = {};
    updates['/users/' + currentUserId + '/movesAnnotated/' + moveId] = move;
    console.log(updates);
    firebase.database().ref().update(updates);
    //Now update dateLastAnnotated
    ref = this.db.list('/users/' + currentUserId + '/dateLastAnnotated');
    updates = {};
    updates['/users/' + currentUserId + '/dateLastAnnotated'] = now;
    firebase.database().ref().update(updates);
  }

  updateUserInDb(user: User){
    console.log("userId in updateUserInDb calll in database service: " + user.getId());
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
  addMatchRatingToMatch(userId: string, matchId: string, rating: number){
    let updates = {};
    updates['/matches/' + matchId + '/matchRatings/' + userId] = rating;
    firebase.database().ref().update(updates);
  }

  addMatchAnnotationRatingToMatch(userId: string, matchId: string, annotationRating: number){
    let updates = {};
    updates['/matches/' + matchId + '/annotationRatings/' + userId] = annotationRating;
    firebase.database().ref().update(updates);
  }

  average(list: any[]){
    return this.roundToDecimal(list.reduce((prev, curr) => prev + curr) / list.length, 2);
  }
  roundToDecimal(number,decimal) {
    var zeros = new String( 1.0.toFixed(decimal) );
    zeros = zeros.substr(2);
    var mul_div = parseInt( "1"+zeros );
    var increment = parseFloat( "."+zeros+"01" );
    if( ( (number * (mul_div * 10)) % 10) >= 5 )
      { number += increment; }
    return Math.round(number * mul_div) / mul_div;
  }

  getAverageMatchRating(matchId: string){
    let ref = firebase.database().ref('matches/' + matchId + '/matchRatings/');
    let resultObservable = Observable.create(observer =>{
      ref.on('value', snapshot =>{
        let results = snapshot.val();
        if(results){
          let arrayOfRatings = Object.values(results);
          let averageRating = this.average(arrayOfRatings);
          this.updateMatchRating(matchId, averageRating);
          observer.next(averageRating);
        } else{
          observer.next(0);
        }
      });
    });
    return resultObservable;
  }

  updateMatchRating(matchId: string, matchRating: number){
    let updates = {};
    updates['matches/' + matchId + '/matchDeets/matchRating'] = matchRating;
    firebase.database().ref().update(updates);
  }

  getAverageAnnotationRating(matchId:string){
    let ref = firebase.database().ref('matches/' + matchId + '/annotationRatings/');
    let resultObservable = Observable.create(observer =>{
      ref.on('value', snapshot =>{
        let results = snapshot.val();
        if(results){
          let arrayOfRatings = Object.values(results);
          let annotationAverage = this.average(arrayOfRatings);
          this.updateAnnotationRating(matchId, annotationAverage);
          observer.next(annotationAverage);
        } else{
          observer.next(0);
        }
      });
    });
    return resultObservable;
  }

  updateAnnotationRating(matchId: string, annotationRating: number){
    let updates = {};
    updates['matches/' + matchId + '/matchDeets/annotationRating'] = annotationRating;
    firebase.database().ref().update(updates);
  }

  doesMatchExist(videoUrl: string){
    let ref = firebase.database().ref('matches/');
    // let entranceDetector = 0;
    // console.log("doesMatchExist?: ");
    // console.log(result);
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild('/matchDeets/videoUrl').equalTo(videoUrl).limitToFirst(1).once("value", snapshot=>{
        // entranceDetector = 1;
        if(!snapshot.exists()){
          // console.log("snapshot doesn't exist");
          observer.next(false);
        }
        // console.log("value happens in doesMatchExist inside database service");
        // console.log(snapshot.val());
        if(snapshot.val()){
          observer.next(true);
        }
      });
      // if(entranceDetector < 1){
        // observer.next(false);
      // }
    });
    return resultObservable;
  }

  isAdmin(userId: string){
    let ref = firebase.database().ref('users/' + userId + '/privileges/isAdmin');
    let resultObservable = Observable.create(observer =>{
      ref.on("value", snapshot=>{
        if(snapshot.val()){
          observer.next(true);
        } else{
          observer.next(false);
        }
      });
    });
    return resultObservable;
  }

  deleteMatch(matchId: string){
    let ref = firebase.database().ref('matches/' + matchId);
    ref.remove();
  }

  getMatchInNeedOfAnnotation(){
    // console.log("got into getMatchInNeedOfAnnotation in database service");
    let ref = firebase.database().ref('matches/');
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild('matchDeets/annotationRating').limitToFirst(1).on("child_added", result =>{
        // console.log("child added to getMatchInNeedOfAnnotation query: ");
        // console.log(result.val());
        observer.next(result.val());
      });
    });
    return resultObservable;
  }

  addAdminStatus(userId: string){
    let updates = {};
    updates['/users/' + userId + '/privileges/isAdmin'] = true;
    firebase.database().ref().update(updates);
  }

  removeAdminStatus(userId: string){
    let updates = {};
    updates['/users/' + userId + '/isAdmin'] = false;
    firebase.database().ref().update(updates);
  }

  updatePrivileges(userId: string, reputationPoints: number){
    let updates = {};
    if(reputationPoints > constants.privilegeLevels[10]){
      updates['/users/' + userId + '/privileges/'] = true; //TODO
    } else{
      if(reputationPoints > constants.privilegeLevels[9]){
        //TODO
      }else{
        if(reputationPoints > constants.privilegeLevels[8]){
          //TODO
        }else{
          if(reputationPoints > constants.privilegeLevels[7]){
            //TODO
          }else{
            if(reputationPoints > constants.privilegeLevels[6]){
              //TODO
            } else{
              if(reputationPoints > constants.privilegeLevels[5]){
                //TODO
              } else{
                if(reputationPoints > constants.privilegeLevels[4]){
                  //TODO
                } else{
                  if(reputationPoints > constants.privilegeLevels[3]){
                    //TODO
                  } else{
                    if(reputationPoints > constants.privilegeLevels[2]){
                      //TODO
                    } else{
                      if(reputationPoints > constants.privilegeLevels[1]){
                        //TODO
                      } else{
                        if(reputationPoints <= constants.privilegeLevels[1]){
                          // console.log("You don't have a lot of reputation points")
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    firebase.database().ref().update(updates);
  }

  setUidFromNodeId(uid: string, nodeId: string){
    console.log("grr this is happening. I don't know what's going on!");
    console.log(nodeId);
    console.log(uid);
    let updates = {};
    updates['/users/' + nodeId + '/uid'] = uid;
    firebase.database().ref().update(updates);
  }

}
