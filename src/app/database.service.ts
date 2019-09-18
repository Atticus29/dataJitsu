import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil, take, first } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { TextTransformationService } from './text-transformation.service';
import { DateCalculationsService } from './date-calculations.service';
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
  // private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private db: AngularFireDatabase, private textTransformationService: TextTransformationService, private dateService: DateCalculationsService) {
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

  getMoveIdByMatchIdAndStartTime(matchId: string, timeInitiated: number){
    let ref = firebase.database().ref('matches/' + matchId + '/moves');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild("timeInitiated").equalTo(timeInitiated).once("child_added", snapshot =>{
        if(snapshot){
          if(snapshot.key){
            console.log(snapshot.key); //TODO get key
            let annotationId = snapshot.key; //TODO key instead of val
            observer.next(annotationId);
          }
        }
      });
    });
    return obsRet;
  }

  getMovesInMatch(matchId: string): Observable<any>{
    return this.db.list('/matches/' + matchId + '/moves').valueChanges();
  }

  getMovesSubsetAsObject(childNodeName: string){
    //TODO SUUUPER HACKY fix this
    // console.log("childNodeName in getMovesSubsetAsObject database service");
    // console.log(childNodeName);
    let ref = firebase.database().ref('/moves/');
    let obsRet = Observable.create(function(observer){
    if (["Ankle Ligaments", "Back", "Choke Or Cervical Submissions", "Elbow", "Groin", "Knee Ligaments", "Shoulder", "Wrist"].indexOf(childNodeName)>-1){
      ref.orderByChild('/Submissions or Submission Attempts/' + childNodeName).on("value", snapshot =>{
        // console.log("getMovesSubsetAsObject special snapshot: ");
        // console.log(snapshot.val());
        // console.log(snapshot.val()["Submissions or Submission Attempts"][childNodeName]);
        observer.next(snapshot.val()["Submissions or Submission Attempts"][childNodeName]);
      });
    } else{
      ref.orderByChild('/moves/' + childNodeName).on("value", snapshot =>{
        // console.log("getMovesSubsetAsObject not special snapshot: ");
        // console.log(snapshot.val());
        // console.log(snapshot.val()[childNodeName]);
        observer.next(snapshot.val()[childNodeName]);
      });
    }
    });
    return obsRet;
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
    this.getUserReputationPoints(userId).pipe(take(1)).subscribe(result =>{ //used to be first()
      // console.log("reputation points? in updateUserReputationPoints");
      // console.log(result);
      updates['/users/' + userId + '/reputationPoints'] = Number(result) + points;
      firebase.database().ref().update(updates);
    });
  }

  // addFlagToAnnotationIfUnique(matchId: string, userId: string, timeInitiated: number){
  //   let updates = {};
  //   updates['/matches/' + matchId + '/moves'] = Number(result) + points;
  //   firebase.database().ref().update(updates);
  // }

  toggleAnnotationFlag(matchId: string, timeInitiated: number, userId: string){
    this.getMoveIdByMatchIdAndStartTime(matchId, timeInitiated).pipe(take(1)).subscribe(annotationId =>{
      if(annotationId){
        this.getAnnotationFlagStatus(matchId, annotationId, userId).pipe(take(1)).subscribe(flaggedStatus =>{
          if(flaggedStatus){
            this.removeAnnotationFlag(matchId, timeInitiated, userId);
          } else{
            this.addAnnotationFlag(matchId, timeInitiated, userId);
          }
        });
      }
    });
  }

  addAnnotationFlag(matchId: string, timeInitiated: number, userId: string){
    //record a flag if it's unique and update numFlags
    let updates = {};
    this.getMoveIdByMatchIdAndStartTime(matchId, timeInitiated).pipe(take(1)).subscribe(annotationId =>{
      if(annotationId){
        updates['/matches/' + matchId + '/moves/' + annotationId + '/flags/' + userId] = true;
        firebase.database().ref().update(updates);
        this.updateNumFlags(matchId, annotationId, 1);
      }
    });
  }

  removeAnnotationFlag(matchId: string, timeInitiated: number, userId: string){
    //record a flag if it's unique and update numFlags
    let updates = {};
    this.getMoveIdByMatchIdAndStartTime(matchId, timeInitiated).pipe(take(1)).subscribe(annotationId =>{
      if(annotationId){
        updates['/matches/' + matchId + '/moves/' + annotationId + '/flags/' + userId] = false; //TODO LEFT OFF HERE
        firebase.database().ref().update(updates);
        this.updateNumFlags(matchId, annotationId, -1);
      }
    });
  }

  updateNumFlags(matchId: string, annotationId: string, points: number){
    let updates = {};
    let ref = firebase.database().ref('matches/' + matchId + '/moves/' + annotationId + '/numFlags');
    ref.once("value", snapshot =>{
      console.log("updateNumFlags current points snapshot:");
      let currentVal: number = snapshot.val();
      console.log(currentVal);
      updates['/matches/' + matchId + '/moves/' + annotationId + '/numFlags'] = currentVal + points;
      firebase.database().ref().update(updates);
    });

  }

  getAnnotationFlagStatus(matchId: string, annotationId: string, userId: string){
    let queryObservable = Observable.create(function(observer){
      let ref = firebase.database().ref('matches/' + matchId + '/moves/' + annotationId + '/flags/' + userId);
      ref.once("value", snapshot =>{
        console.log("getAnnotationFlagStatus snapshot value: ");
        console.log(snapshot.val());
        observer.next(snapshot.val());
      });
    });
    return queryObservable;
  }

  getNumberOfUniqueAnnotationFlags(matchId: string, timeInitiated: number){
    let self = this;
    let queryObservable = Observable.create(function(observer){
      if(matchId && timeInitiated){
        self.getMoveIdByMatchIdAndStartTime(matchId, timeInitiated).pipe(take(1)).subscribe(annotationId =>{
          if(annotationId){
            let ref = firebase.database().ref('matches/' + matchId + '/moves/' + annotationId + '/numFlags');
            ref.on("value", snapshot =>{
              console.log("getNumberOfUniqueAnnotationFlags snapshot:");
              console.log(snapshot.val());
              // console.log(snapshot.numChildren());
              //TODO flesh out getMainAnnotatorOfMatch
              observer.next(snapshot.val());
            });
          }
        });
      }
    });
    return queryObservable;
  }

  getMainAnnotatorOfMatch(matchId: string){
    let ref = firebase.database().ref('matches/' + matchId + '/moves');
    let annotators: Array<string> = new Array<string>();
    ref.orderByChild("annotatorUserId").on("child_added", snapshot =>{
      let annotation: any = snapshot.val();
      console.log("all moves in getMainAnnotatorOfMatch");
      console.log(annotation.annotatorUserId);
      annotators.push(annotation.annotatorUserId);
      // majorityAnnotator.annotatorUserId
    });
    console.log("annotators accumulated:");
    console.log(annotators); //TODO LEFT OFF HERE
    let queryObservable = Observable.create(function(observer){
      ref.orderByChild("annotatorUserId").on("child_added", snapshot =>{
        // console.log("getMainAnnotatorOfMatch snapshot:");
        // console.log(snapshot.val());
        // console.log(snapshot.numChildren());
        //TODO flesh out getMainAnnotatorOfMatch
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

  hasUserPaid(userId: string): Observable<boolean>{
    let ref = firebase.database().ref('users/' + userId + '/paidStatus');
    let resultObservable = Observable.create(observer =>{
      ref.on("value", snapshot => { //TODO ???
        // console.log("result in hasUserPaid: ");
        // console.log(snapshot.val());
        let status: boolean = snapshot.val();
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

  getUserByUid(uid: string) : Observable<any>{
    let ref = firebase.database().ref('/users/');
    let user: User;
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild('uid').equalTo(uid).limitToFirst(1).on("value", snapshot => {
        // console.log("query result in getUserByUid in databaseService: ");
        // console.log(snapshot.val());
        user = snapshot.val();
        user = user[Object.keys(user)[0]];
        observer.next(user);
      });
    });
    return resultObservable;
  }

  getMatchFromNodeKey(key: string){
    this.retrievedMatch = this.db.object('matches/' + key).valueChanges();
    return this.retrievedMatch;
  }

  getNodeIdFromEmail(email: string){
    // console.log("got to getNodeIdFromEmail in database service");
    // console.log("email passed in is: " + email);
    let ref = firebase.database().ref('/users/');
    let nodeId: string = null;
    let resultObservable = Observable.create(observer =>{
      return ref.orderByChild('email').equalTo(email).limitToFirst(1).on("child_added", snapshot => {
        // console.log("got to snapshot in getNodeIdFromEmail in database service: ");
        // console.log(snapshot.val().id);
        nodeId = snapshot.val().id;
        observer.next(nodeId);
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
    let ref = firebase.database().ref('users/' + userId);
    let resultObservable = Observable.create(observer =>{
      return ref.on("value", snapshot => {
        // console.log("got to snapshot in getUserById in database service");
        let user = snapshot.val();
        observer.next(user);
      });
    });
    return resultObservable;
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

  addUserToDb(user: User): Observable<string>{
    let ref = this.db.list<User>('/users');
    let userId = ref.push(user).key;
    let updates = {};
    updates['/users/'+userId + '/id'] = userId;
    firebase.database().ref().update(updates);
    let resultObservable = Observable.create(observer =>{
      observer.next(userId);
    });
    return resultObservable;
  }

  addUserToDbAndReturnUserId(user: User){
    let ref = this.db.list<User>('/users');
    let userId = ref.push(user).key;
    let updates = {};
    updates['/users/'+userId + '/id'] = userId;
    firebase.database().ref().update(updates);
    return userId;
  }

  addMoveInVideoToMatchIfUniqueEnough(move: MoveInVideo): Observable<boolean>{
    let localUnsubscribeSubject: Subject<void> = new Subject<void>();
    let resultObservable = Observable.create(observer =>{
      let counter: number = 0;
      //TODO if(moveIsUniqueEnoughToAddToMatch){} else {add toast thing saying as much}
      this.moveIsUniqueEnough(move, 'matches/' + move.getMatchId() + '/moves/').pipe(takeUntil(localUnsubscribeSubject)).subscribe(uniqueEnough =>{
        // console.log("unique enough?");
        // console.log(uniqueEnough);
        // console.log("value of counter: ");
        // console.log(counter);
        if(uniqueEnough && counter < 1){
          let matchId = move.getMatchId();
          let ref = this.db.list('/matches/' + matchId + '/moves');
          let moveId = ref.push(move).key;
          let updates = {};
          updates['/matches/' + matchId + '/moves/' + moveId] = move;
          firebase.database().ref().update(updates);
          observer.next(true);
          counter += 1;
          localUnsubscribeSubject.next();
          localUnsubscribeSubject.complete();
          return resultObservable;
        } else {
          if(uniqueEnough == false){
            // TODO add toast thing saying as much
            // alert("this should only happen if move is not unique enough!");
            observer.next(false);
            localUnsubscribeSubject.next();
            localUnsubscribeSubject.complete();
            return resultObservable;
          } else{
            //just hasn't shown up yet, be patient
          }
        }
      });

    });
    localUnsubscribeSubject.next();
    localUnsubscribeSubject.complete();
    return resultObservable;

  }

  moveIsUniqueEnough(move: MoveInVideo, path: string): Observable<boolean>{
    let localUnsubscribeSubject: Subject<void> = new Subject<void>();
    let resultObservable = Observable.create(observer =>{
      console.log("move.getMatchId(): " + move.getMatchId());
      this.getAnnotations(move.getMatchId(), path).pipe(takeUntil(localUnsubscribeSubject)).subscribe(moves =>{
        console.log("got into getAnnotations in moveIsUniqueEnoughToAddToMatch:");
        console.log(moves);
        if(moves){
          for(let item in moves){
            // console.log(moves[item].dateAdded);
            if (moves[item].moveName === move.moveName && moves[item].actor === move.actor && this.annotationWithinTimeRange(moves[item], move)){ //TODO and start time is within 2 seconds of start time and same with end time
              observer.next(false);
              localUnsubscribeSubject.next();
              localUnsubscribeSubject.complete();
              return resultObservable;
            } else{
              // observer.next(true);
            }
          }
          observer.next(true);
          localUnsubscribeSubject.next();
          localUnsubscribeSubject.complete();
          return resultObservable;
        } else{
          observer.next(true);
          localUnsubscribeSubject.next();
          localUnsubscribeSubject.complete();
          return resultObservable;
        }
      });
    });
    return resultObservable;
  }

  annotationWithinTimeRange(oldMove: MoveInVideo, candidateNewMove: MoveInVideo): boolean{
    let candidateNewMoveDoesNotStartTooEarly = oldMove.timeInitiated - constants.numberOfSecondsToleratedToBeCalledSameAnnotation <= candidateNewMove.timeInitiated;
    let candidateNewMoveDoesNotStartTooLate = oldMove.timeInitiated + constants.numberOfSecondsToleratedToBeCalledSameAnnotation >= candidateNewMove.timeInitiated;
    let candidateNewMoveDoesNotEndTooEarly = oldMove.timeCompleted - constants.numberOfSecondsToleratedToBeCalledSameAnnotation <= candidateNewMove.timeCompleted;
    let candidateNewMoveDoesNotEndTooLate = oldMove.timeCompleted + constants.numberOfSecondsToleratedToBeCalledSameAnnotation >= candidateNewMove.timeCompleted;
    return (candidateNewMoveDoesNotStartTooEarly && candidateNewMoveDoesNotStartTooLate && candidateNewMoveDoesNotEndTooEarly && candidateNewMoveDoesNotEndTooLate);
  }

  getAnnotationsSortedByStartTimeV2(matchId: string, path: string){
    let annotations = new Array();
    let ref = firebase.database().ref(path); //'matches/' + matchId + '/moves/'
    let theObjects = new Array();
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild("timeInitiated").on("child_added", snapshot => { //
          console.log("child snapshot in getAnnotationsSortedByStartTime in database service");
          console.log(snapshot.val());
          if(snapshot){
            if(snapshot.val()){
              let snapshotVals = snapshot.val();
              if(annotations.includes(snapshotVals)){
                annotations = new Array();
              }
              let currentMoveInVideo = new MoveInVideo(snapshotVals.moveName, snapshotVals.moveCategory, snapshotVals.actor, snapshotVals.recipient, snapshotVals.timeInitiated, snapshotVals.timeCompleted, snapshotVals.points, snapshotVals.associatedMatchId, snapshotVals.isASubmission, snapshotVals.isSuccessfulAttempt, snapshotVals.annotatorUserId);
              currentMoveInVideo.updateDateAdded(snapshotVals.dateAdded);
              currentMoveInVideo.setIsWin(snapshotVals.isWin);
              currentMoveInVideo.setIsDraw(snapshotVals.isDraw);
              console.log("move in video being added to annotations array:");
              console.log(currentMoveInVideo)
              annotations.push(currentMoveInVideo);
            }
          }
      });
      observer.next(annotations);
    });
    return resultObservable;
  }

  getAnnotationsSortedByStartTime(matchId: string, path: string){
    let ref = firebase.database().ref(path); //'matches/' + matchId + '/moves/'
    let theObjects = new Array();
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild("timeInitiated").on("child_added", snapshot => { //
          // console.log("child snapshot in getAnnotationsSortedByStartTime in database service");
          // console.log(snapshot.val());
          if(snapshot){
            if(snapshot.val()){
              let snapshotVals = snapshot.val();
              observer.next(snapshotVals);
            }
          }
          // theObjects.push(snapshotVals);
          // console.log(theObjects);
          // let theObjects = new Array();
          // if(snapshotVals){
          //   Object.keys(snapshotVals).forEach(key =>{
          //     // console.log(snapshotVals[key]);
          //     let tmpObj = snapshotVals[key]
          //     // let newMove = new MoveInVideo(...snapshotVals[key]);
          //     // console.log(newMove);
          //     theObjects.push(tmpObj);
          //   });
          // }
      });
    // ref.orderByChild("timeInitiated").on("child_changed", snapshot =>{
    //   let snapshotVals = snapshot.val();
    //   observer.next(snapshotVals);
    // });
      // console.log(theObjects);
      // observer.next(theObjects);
    });
    return resultObservable;
  }

  getAnnotations(matchId: string, path: string){
    let ref = firebase.database().ref(path); //'matches/' + matchId + '/moves/'
    let resultObservable = Observable.create(observer =>{
      return ref.on("value", snapshot => { //.orderByChild("timeInitiated")
        let moves = snapshot.val();
        observer.next(moves);
      });
    });
    return resultObservable;
  }

  addMoveInVideoToUserIfUniqueEnough(move: MoveInVideo, currentUserId: string): Observable<boolean>{
    console.log("addMoveInVideoToUserIfUniqueEnough called in database service");
    let localUnsubscribeSubject: Subject<void> = new Subject<void>();
    let resultObservable = Observable.create(observer =>{
        let counter: number = 0;
        if(move.getMoveName() !== "No Annotation Currently Selected"){
          this.moveIsUniqueEnough(move, 'users/' + currentUserId + '/movesAnnotated/').pipe(takeUntil(localUnsubscribeSubject)).subscribe(uniqueEnough =>{
            if(uniqueEnough && counter < 1){
              // console.log("move is unique enough in addMoveInVideoToUserIfUniqueEnough");
              let now: string = new Date().toJSON();
              let matchId = move.getMatchId();
              let ref = this.db.list('/users/' + currentUserId + '/movesAnnotated');
              let moveId = ref.push(move).key;
              let updates = {};
              updates['/users/' + currentUserId + '/movesAnnotated/' + moveId] = move;
              // console.log(updates);
              firebase.database().ref().update(updates);
              //Now update dateLastAnnotated
              ref = this.db.list('/users/' + currentUserId + '/dateLastAnnotated');
              updates = {};
              updates['/users/' + currentUserId + '/dateLastAnnotated'] = now;
              firebase.database().ref().update(updates);
              counter += 1;
              observer.next(true);
              localUnsubscribeSubject.next();
              localUnsubscribeSubject.complete();
              return resultObservable;
            } else{
              observer.next(false);
              localUnsubscribeSubject.next();
              localUnsubscribeSubject.complete();
              return resultObservable;
            }
          });
        } else{
          observer.next(false);
          localUnsubscribeSubject.next();
          localUnsubscribeSubject.complete();
          return resultObservable;
        }
    });
    localUnsubscribeSubject.next();
    localUnsubscribeSubject.complete();
    return resultObservable;
  }

  updateUserInDb(user: User){
    // console.log("userId in updateUserInDb calll in database service: " + user.getId());
    let updates = {};
    updates['/users/' + user.getId()] = user;
    firebase.database().ref().update(updates);
  }

  userHasAnnotatedEnough(userId: string): Observable<boolean>{
    let skipTheActualCalculationBecauseOfOverride: boolean = false;
    let resultObservable = Observable.create(observer =>{
      let ref = firebase.database().ref('users/' + userId + '/annotatedEnoughOverride/');
      ref.on("value", status =>{
        // console.log("value of annotatedEnoughOverride: " + status.val());
        if(status.val() == true){
          skipTheActualCalculationBecauseOfOverride = true;
          observer.next(true);
          return resultObservable;
        }
        if(!skipTheActualCalculationBecauseOfOverride){
          ref = firebase.database().ref('users/' + userId + '/movesAnnotated/');
          let moveCount = 0;
          ref.on("child_added", childSnapshot =>{
            let move = childSnapshot.val();
            // console.log("move in userHasAnnotatedEnough");
            // console.log(move.dateAdded);
            if(this.dateService.calculateDaysSinceLastAnnotation(new Date(move.dateAdded)) <= constants.numDaysBeforeNewAnnotationNeeded){
              // console.log(move.dateAdded + " is recent enough to count. Adding it...");
              moveCount += 1;
            } else{
              //Don't increment
            }
          });
          if(moveCount < constants.numberOfCurrentAnnotationsNeeded){
            observer.next(false);
          } else{
            observer.next(true);
          }
        }
      });
    });
    return resultObservable;
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
    return this.dateService.roundToDecimal(list.reduce((prev, curr) => prev + curr) / list.length, 2);
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

  isAdmin(userId: string): Observable<boolean>{
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
    // console.log("grr this is happening. I don't know what's going on!");
    // console.log(nodeId);
    // console.log(uid);
    let updates = {};
    updates['/users/' + nodeId + '/uid'] = uid;
    firebase.database().ref().update(updates);
  }

  removeAnnotationInMatchAndUserByStartTime(matchId: string, timeInitiated: number, annotatorUserId: string): Observable<boolean>{ //TODO AndUser
    let resultObservable = Observable.create(observer =>{
      console.log("got into removeAnnotationInMatchByStartTime"); //TODO flesh out LEFT OFF HERE
      console.log(matchId);
      console.log(timeInitiated);
      let ref = firebase.database().ref('matches/' + matchId + '/moves/');
      ref.orderByChild("timeInitiated").equalTo(timeInitiated).on("child_added", snapshot =>{
        // console.log("found record in question: ");
        // console.log(snapshot.val());
        if(snapshot.val()){
          // console.log(snapshot.key);
          ref.child(snapshot.key).remove();
          // observer.next(true);
        }else{
          // observer.next(false);
        }
      });
      let newRef = firebase.database().ref('users/' + annotatorUserId + '/movesAnnotated/');
      newRef.orderByChild("timeInitiated").equalTo(timeInitiated).on("child_added", snapshot =>{
        // console.log("found record in question for user: ");
        // console.log(snapshot.val());
        // console.log(snapshot.key);
        if(snapshot.val()){
          newRef.child(snapshot.key).remove();
          observer.next(true);
        } else{
          observer.next(false);
        }
      });
    });
    return resultObservable;
  }

  flagVideoRemovedInMatch(matchId: string, status: boolean){
    let updates = {};
    updates['/matches/' + matchId + '/matchDeets/flaggedAsMissing'] = status;
    firebase.database().ref().update(updates);
  }

  getVideoRemovedFlagStatus(matchId: string){
    let resultObservable = Observable.create(observer =>{
      let ref = firebase.database().ref('/matches/' + matchId + '/matchDeets/flaggedAsMissing');
      ref.on("value", snapshot =>{
        if(snapshot.val()){
          // console.log("results in getVideoRemovedFlagStatus call:");
          // console.log(snapshot.val());
          observer.next(Boolean(snapshot.val()));
        }else{
          observer.next(false);
        }
      });
      });
    return resultObservable;
  }

  getInappropriateFlagStatus(matchId: string){
    let resultObservable = Observable.create(observer =>{
      let ref = firebase.database().ref('/matches/' + matchId + '/matchDeets/flaggedAsInappropriate');
      ref.on("value", snapshot =>{
        if(snapshot.val()){
          // console.log("results in getInappropriateFlagStatus call:");
          // console.log(snapshot.val());
          observer.next(Boolean(snapshot.val()));
        }else{
          observer.next(false);
        }
      });
      });
    return resultObservable;
  }

  flagVideoInappropriateInMatch(matchId: string, status: boolean){
    let updates = {};
    updates['/matches/' + matchId + '/matchDeets/flaggedAsInappropriate'] = status;
    firebase.database().ref().update(updates);
  }

  // getMoveCategoryFromMoveName(moveName: string){
  //   let resultObservable = Observable.create(observer =>{
  //     let ref = firebase.database().ref('/moves/');
  //     ref.on("value", snapshot =>{
  //       if(snapshot.val()){
  //         // console.log("results in getInappropriateFlagStatus call:");
  //         // console.log(snapshot.val());
  //         observer.next(Boolean(snapshot.val()));
  //       }else{
  //         observer.next(false);
  //       }
  //     });
  //     });
  //   return resultObservable;
  // }

}
