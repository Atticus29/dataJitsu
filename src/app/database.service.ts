import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { takeUntil, take, first, merge } from 'rxjs/operators';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import * as firebase from 'firebase/app';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { TextTransformationService } from './text-transformation.service';
import { DateCalculationsService } from './date-calculations.service';

import { User } from './user.model';
import { Video } from './video.model';
import { ReputationLog } from './reputationLog.model';
import { constants } from './constants';
import { Collection } from './collection.model';
import { EventInVideo } from './eventInVideo.model';
import { FeedbackItem } from './feedbackItem.model';
import { OwnerQuestionSet } from './ownerQuestionSet.model';
import { FormQuestionBase } from './formQuestionBase.model';

@Injectable()
export class DatabaseService {
  videos:Observable<any>;
  weightClasses:Observable<any>;
  giRanks:Observable<any>;
  noGiRanks:Observable<any>;
  ageClasses:Observable<any>;
  users:Observable<any>;
  currentUser:Observable<any>;
  events:Observable<any>;
  retrievedMatch:Observable<any>;
  VideoDetails: Observable<any>;
  eventsAsObject: Observable<any>;
  // private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, public db: AngularFireDatabase, private textTransformationService: TextTransformationService, private dateCalculationsService: DateCalculationsService) {
    this.videos = db.list<Video>('/videos').valueChanges();
    this.weightClasses = db.list<String>('/weightClasses').valueChanges();
    this.giRanks = db.list<String>('/giRanks').valueChanges();
    this.noGiRanks = db.list<String>('/noGiRanks').valueChanges();
    this.ageClasses = db.list<String>('/ageClasses').valueChanges();
    this.users = db.list<User>('/users').valueChanges();
    this.events = db.list<String>('/events').valueChanges(); //TODO maybe JSON?
    this.eventsAsObject = db.object('/events').valueChanges();
  }

  getEventIdByVideoIdAndStartTime(videoId: string, timeInitiated: number){
    let ref = firebase.database().ref('videos/' + videoId + '/events');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild("timeInitiated").equalTo(timeInitiated).once("child_added", snapshot =>{
        if(snapshot){
          if(snapshot.key){
            // console.log(snapshot.key); //TODO get key
            let annotationId = snapshot.key; //TODO key instead of val
            observer.next(annotationId);
          }
        }
      });
    });
    return obsRet;
  }


  addIndividualNamesToDb(names: string[]){
    let updates = {};
    updates['/individualNames'] = names;
    firebase.database().ref().update(updates);
  }

  getEventsInVideo(videoId: string): Observable<any>{
    return this.getGeneric('/videos/' + videoId + '/events');
  }
  getIndividualNames(): any{
    return this.getGeneric('/individualNames/');
  }

  getTournamentNames(): any{
    return this.getGeneric('/tournamentNames/');
  }
  getGeneric(path:string): any{
    return this.db.list(path).valueChanges();
  }

  getCandidateTournamentNames(): any{
    let ref = firebase.database().ref('/candidateTournamentNames/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('name').on("value", snapshot =>{
        let resultObj = snapshot.val();
        if(resultObj){
          let names = Object.keys(resultObj).map(index => resultObj[index].name);
          observer.next(names);
        } else{
          observer.next([]);
        }
      });
    });
    return obsRet;
  }

  getCandidateWeightClassNames(): any{
    this.getGenericAndOrderBy('/candidateWeightClasses/', 'name');
  }

  getGenericAndOrderBy(path: string, orderByParameter: string): any{
    let ref = firebase.database().ref(path);
    let obsRet = Observable.create(function(observer){
      ref.orderByChild(orderByParameter).on("value", snapshot =>{
        let resultObj = snapshot.val();
        if(resultObj){
          let names = Object.keys(resultObj).map(index => resultObj[index].name);
          observer.next(names);
        } else{
          observer.next([]);
        }
      });
    });
    return obsRet;
  }

  getEventsSubsetAsObject(childNodeName: string){
    //TODO SUUUPER HACKY fix this
    // console.log("childNodeName in getEventsSubsetAsObject database service");
    // console.log(childNodeName);
    let ref = firebase.database().ref('/events/');
    let obsRet = Observable.create(function(observer){
    if(constants.subCategories.indexOf(childNodeName)>-1){
    // if (["Ankle Ligaments", "Back", "Choke Or Cervical Submissions", "Elbow", "Groin", "Knee Ligaments", "Shoulder", "Wrist"].indexOf(childNodeName)>-1){
      ref.orderByChild('/Submissions or Submission Attempts/' + childNodeName).on("value", snapshot =>{
        // console.log("getEventsSubsetAsObject special snapshot: ");
        // console.log(snapshot.val());
        // console.log(snapshot.val()["Submissions or Submission Attempts"][childNodeName]);
        observer.next(snapshot.val()["Submissions or Submission Attempts"][childNodeName]);
      });
    } else{
      ref.orderByChild('/events/' + childNodeName).on("value", snapshot =>{
        // console.log("getEventsSubsetAsObject not special snapshot: ");
        // console.log(snapshot.val());
        // console.log(snapshot.val()[childNodeName]);
        observer.next(snapshot.val()[childNodeName]);
      });
    }
    });
    return obsRet;
  }

  getVideoDetails(videoId: string){
    return this.db.object('/videos/' + videoId + '/videoDeets').valueChanges();
  }

  getEventsSubsetAsList(childNodeName: string){
    return this.db.list('/events/' + childNodeName).valueChanges();
  }

  getLowRatedVideo(){
    let ref = firebase.database().ref('videos/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('/videoDeets/annotationRating').limitToFirst(1).on("child_added", snapshot=>{
        observer.next(snapshot.val());
      });
    });
    return obsRet;
  }

  updateUserPaymentStatus(userId: string, newStatus: boolean){
    // console.log("updateUserPaymentStatus entered");
    let updates = {};
    updates['/users/' + userId + '/paidStatus'] = newStatus;
    firebase.database().ref().update(updates);
  }
  // updateUserSubscription(nodeId: string, paidStatus: boolean){
  //   let updates = {};
  //   updates['/users/' + nodeId + '/paidStatus'] = paidStatus;
  //   firebase.database().ref().update(updates);
  // }

  getKeyOfEventsEntry(){

  }

  getMoves(){
    let ref = firebase.database().ref('events/');
    let obsRet = Observable.create(function(observer){
      ref.orderByKey().on("value", snapshot=>{
        observer.next(snapshot.val());
      });
    });
    return obsRet;
  }

  getMovesAsObject(){
    return this.eventsAsObject;
  }

  getMovesAsList(){
    // console.log("getMovesAsList called");
    this.db.list('/events').valueChanges().subscribe(console.log);
    return this.db.list('/events').valueChanges();
  }

  getMovesKeys(){
    let ref = firebase.database().ref('events/');
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

  getVideos(){
    let ref = firebase.database().ref('/videos');
    let resultObservable = Observable.create(observer =>{
      ref.on('value', snapshot=>{
        observer.next(snapshot.val());
      });
    });
    return resultObservable;
  }

  async getVideosV2(){
  let result = this.db.list<Video>('/videos').valueChanges().pipe(first()).toPromise();
  return result;
}


  getUserReputationPoints(userId: string){
    return this.db.object('users/' + userId + '/reputationPoints').valueChanges();
  }

  updateUserReputationPoints(userId: string, points: number, reason: string){
    let updates = {};
    this.getUserReputationPoints(userId).pipe(take(1)).subscribe(result =>{ //used to be first()
      // console.log("reputation points? in updateUserReputationPoints");
      // console.log(result);
      // console.log(points);
      updates['/users/' + userId + '/reputationPoints'] = Number(result) + points;
      firebase.database().ref().update(updates);
    });
    updates = {};
    let ref = this.db.list('/users/' + userId + '/reputationLog');
    let reputationLogEntry = new ReputationLog(new Date().toJSON(), reason, points);
    let logEntryId = ref.push(reputationLogEntry).key;
  }

  getUserReputationLogs(userId: string){
    return this.db.object('users/' + userId + '/reputationLog').valueChanges();
  }

  // addFlagToAnnotationIfUnique(videoId: string, userId: string, timeInitiated: number){
  //   let updates = {};
  //   updates['/videos/' + videoId + '/events'] = Number(result) + points;
  //   firebase.database().ref().update(updates);
  // }

  toggleAnnotationFlag(videoId: string, timeInitiated: number, userId: string){
    this.getEventIdByVideoIdAndStartTime(videoId, timeInitiated).pipe(take(1)).subscribe(annotationId =>{
      if(annotationId){
        this.getAnnotationFlagStatus(videoId, annotationId, userId).pipe(take(1)).subscribe(flaggedStatus =>{
          if(flaggedStatus){
            this.removeAnnotationFlag(videoId, timeInitiated, userId);
          } else{
            this.addAnnotationFlag(videoId, timeInitiated, userId);
          }
        });
      }
    });
  }

  addAnnotationFlag(videoId: string, timeInitiated: number, userId: string){
    //record a flag if it's unique and update numFlags
    let updates = {};
    this.getEventIdByVideoIdAndStartTime(videoId, timeInitiated).pipe(take(1)).subscribe(annotationId =>{
      if(annotationId){
        updates['/videos/' + videoId + '/events/' + annotationId + '/flags/' + userId] = true;
        firebase.database().ref().update(updates);
        this.updateNumFlags(videoId, annotationId, 1);
      }
    });
  }

  removeAnnotationFlag(videoId: string, timeInitiated: number, userId: string){
    //record a flag if it's unique and update numFlags
    let updates = {};
    this.getEventIdByVideoIdAndStartTime(videoId, timeInitiated).pipe(take(1)).subscribe(annotationId =>{
      if(annotationId){
        updates['/videos/' + videoId + '/events/' + annotationId + '/flags/' + userId] = false; //TODO LEFT OFF HERE
        firebase.database().ref().update(updates);
        this.updateNumFlags(videoId, annotationId, -1);
      }
    });
  }

  updateNumFlags(videoId: string, annotationId: string, points: number){
    let updates = {};
    let ref = firebase.database().ref('videos/' + videoId + '/events/' + annotationId + '/numFlags');
    ref.once("value", snapshot =>{
      // console.log("updateNumFlags current points snapshot:");
      let currentVal: number = snapshot.val();
      // console.log(currentVal);
      updates['/videos/' + videoId + '/events/' + annotationId + '/numFlags'] = currentVal + points;
      firebase.database().ref().update(updates);
    });

  }

  getAnnotationFlagStatus(videoId: string, annotationId: string, userId: string){
    let queryObservable = Observable.create(function(observer){
      let ref = firebase.database().ref('videos/' + videoId + '/events/' + annotationId + '/flags/' + userId);
      ref.once("value", snapshot =>{
        // console.log("getAnnotationFlagStatus snapshot value: ");
        // console.log(snapshot.val());
        observer.next(snapshot.val());
      });
    });
    return queryObservable;
  }

  getNumberOfUniqueAnnotationFlags(videoId: string, timeInitiated: number){
    let self = this;
    let queryObservable = Observable.create(function(observer){
      if(videoId && timeInitiated){
        self.getEventIdByVideoIdAndStartTime(videoId, timeInitiated).pipe(take(1)).subscribe(annotationId =>{
          if(annotationId){
            let ref = firebase.database().ref('videos/' + videoId + '/events/' + annotationId + '/numFlags');
            ref.on("value", snapshot =>{
              // console.log("getNumberOfUniqueAnnotationFlags snapshot:");
              // console.log(snapshot.val());
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

  getMainAnnotatorOfMatch(videoId: string){
    let ref = firebase.database().ref('videos/' + videoId + '/events');
    let annotators: Array<string> = new Array<string>();
    ref.orderByChild("annotatorUserId").on("child_added", snapshot =>{
      let annotation: any = snapshot.val();
      // console.log("all events in getMainAnnotatorOfMatch");
      // console.log(annotation.annotatorUserId);
      annotators.push(annotation.annotatorUserId);
      // majorityAnnotator.annotatorUserId
    });
    // console.log("annotators accumulated:");
    // console.log(annotators); //TODO IS THIS GOOD YET?
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
    let ref = firebase.database().ref('videos/');
    let queryObservable = Observable.create(function(observer){
      ref.on('value', snapshot=>{
        observer.next(snapshot.numChildren());
      });
    });
    return queryObservable;
  }

  getVideosFilteredPaginator(keyToStartWith: string, pageSize:number){
    let ref = firebase.database().ref('videos/');
    let queryObservable = Observable.create(function(observer){
      ref.orderByKey().startAt(keyToStartWith).limitToFirst(pageSize).once("value", snapshot =>{
        observer.next(snapshot.val());
      });
    });
    return queryObservable;
  }

  getKeyOfMatchToStartWith(pageIndex: number, pageSize: number){
    let firstKeyToStartWith = null;
    let ref = firebase.database().ref('videos/');
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

  // getVideosFiltered(videoId: string, filter: string, sortDirection: string, pageIndex: number, pageSize: number){ //TODO remove or fix
  // }

  hasUserPaid(userId: string): Observable<boolean>{
    // console.log("hasUserPaid entered");
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
    return this.db.object('/videos/'+ videoId + '/annotationStatus'); //TODO check that there is an annotation status and that this is the firebase path to it
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
    this.retrievedMatch = this.db.object('videos/' + key).valueChanges();
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

  addMovesListToDb(events: any){
    let updates = {};
    updates['/events'] = events;
    firebase.database().ref().update(updates);
      // this.events.push(events);
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

  addVideoToDb(video: any){
    console.log("addVideoToDb entered");
    let ref = this.db.list<Video>('/videos');
    let videoId = ref.push(video).key;
    let updates = {};
    updates['/videos/' + videoId + '/id'] = videoId;
    updates['/videos/' + videoId + '/videoCreated'] = firebase.database.ServerValue.TIMESTAMP;
    firebase.database().ref().update(updates);
    return videoId;
  }

  addVideoToDbWithPath(video: any, path: string): Observable<string>{
    console.log("addVideoToDbWithPath entered");
    console.log("path is: " + path);
    let ref = this.db.list<Video>(path);
    let videoId = ref.push(video).key;
    let updates = {};
    updates[path + videoId + '/id'] = videoId;
    updates[path + videoId + '/videoCreated'] = firebase.database.ServerValue.TIMESTAMP;
    console.log("got here 1");
    console.log("updates is:");
    console.log(updates);
    updates['users/'+ video.videoDeets.genericArgs.originalPosterId +'/'+ path + videoId + '/' ] = video;
    // console.log("got here 2");
    console.log("updates is:");
    console.log(updates);
    // updates['users/'+ video.videoDeets.genericArgs.originalPosterId + '/collections/' + videoId + '/id'] = videoId;
    // updates['users/'+ video.videoDeets.genericArgs.originalPosterId + '/collections/' + videoId + '/videoCreated'] = firebase.database.ServerValue.TIMESTAMP;
    firebase.database().ref().update(updates);
    return of(videoId);
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

  addEventInVideoToVideoIfUniqueEnough(move: EventInVideo): Observable<boolean>{
    // console.log("move to add in addEventInVideoToVideoIfUniqueEnough:");
    // console.log(move);
    let localUnsubscribeSubject: Subject<void> = new Subject<void>();
    let resultObservable = Observable.create(observer =>{
      let counter: number = 0;
      //TODO if(eventIsUniqueEnoughToAddToMatch){} else {add toast thing saying as much}
      this.eventIsUniqueEnough(move, 'videos/' + move.getVideoId() + '/events/').pipe(takeUntil(localUnsubscribeSubject)).subscribe(uniqueEnough =>{
        // console.log("unique enough?");
        // console.log(uniqueEnough);
        // console.log("value of counter: ");
        // console.log(counter);
        if(uniqueEnough && counter < 1){
          let videoId = move.getVideoId();
          let ref = this.db.list('/videos/' + videoId + '/events');
          let moveId = ref.push(move).key; //().set
          let updates = {};
          updates['/videos/' + videoId + '/events/' + moveId] = move;
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

  eventIsUniqueEnough(move: EventInVideo, path: string): Observable<boolean>{
    let localUnsubscribeSubject: Subject<void> = new Subject<void>();
    let resultObservable = Observable.create(observer =>{
      // console.log("move.getVideoId(): " + move.getVideoId());
      this.getAnnotations(move.getVideoId(), path).pipe(takeUntil(localUnsubscribeSubject)).subscribe(events =>{
        // console.log("got into getAnnotations in eventIsUniqueEnoughToAddToMatch:");
        // console.log(events);
        if(events){
          for(let item in events){
            // console.log(events[item].dateAdded);
            if (events[item].eventName === move.eventName && events[item].actor === move.actor && this.annotationWithinTimeRange(events[item], move)){ //TODO and start time is within 2 seconds of start time and same with end time
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

  annotationWithinTimeRange(oldMove: EventInVideo, candidateNewMove: EventInVideo): boolean{
    let candidateNewMoveDoesNotStartTooEarly = oldMove.timeInitiated - constants.numberOfSecondsToleratedToBeCalledSameAnnotation <= candidateNewMove.timeInitiated;
    let candidateNewMoveDoesNotStartTooLate = oldMove.timeInitiated + constants.numberOfSecondsToleratedToBeCalledSameAnnotation >= candidateNewMove.timeInitiated;
    let candidateNewMoveDoesNotEndTooEarly = oldMove.timeCompleted - constants.numberOfSecondsToleratedToBeCalledSameAnnotation <= candidateNewMove.timeCompleted;
    let candidateNewMoveDoesNotEndTooLate = oldMove.timeCompleted + constants.numberOfSecondsToleratedToBeCalledSameAnnotation >= candidateNewMove.timeCompleted;
    return (candidateNewMoveDoesNotStartTooEarly && candidateNewMoveDoesNotStartTooLate && candidateNewMoveDoesNotEndTooEarly && candidateNewMoveDoesNotEndTooLate);
  }
  getSuccessfulAnnotationNamesSortedByStartTime(videoId: string, path: string){
    let annotationNames = new Array();
    let ref = firebase.database().ref(path); //'videos/' + videoId + '/events/'
    let theObjects = new Array();
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild("timeInitiated").on("child_added", snapshot => { //
          // console.log("child snapshot in getAnnotationNamesSortedByStartTime in database service");
          // console.log(snapshot.val());
          if(snapshot){
            if(snapshot.val()){
              let snapshotVals = snapshot.val();
              if(annotationNames.includes(snapshotVals.eventName)){
                annotationNames = new Array();
              }
              if(snapshotVals.isSuccessfulAttempt){
                annotationNames.push(snapshotVals.eventName);
              }
            }
          }
      });
      observer.next(annotationNames);
    });
    return resultObservable;
  }

  getAnnotationsSortedByStartTimeV2(videoId: string, path: string){
    let annotations = new Array();
    let ref = firebase.database().ref(path); //'videos/' + videoId + '/events/'
    let theObjects = new Array();
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild("timeInitiated").on("child_added", snapshot => { //
          // console.log("child snapshot in getAnnotationsSortedByStartTime in database service");
          // console.log(snapshot.val());
          if(snapshot){
            if(snapshot.val()){
              let snapshotVals = snapshot.val();
              if(annotations.includes(snapshotVals)){
                annotations = new Array();
              }
              let currentEventInVideo = new EventInVideo(snapshotVals.eventName, snapshotVals.eventCategory, snapshotVals.actor, snapshotVals.recipient, snapshotVals.timeInitiated, snapshotVals.timeCompleted, snapshotVals.points, snapshotVals.associatedVideoId, snapshotVals.isASubmission, snapshotVals.isSuccessfulAttempt, snapshotVals.annotatorUserId);
              currentEventInVideo.updateDateAdded(snapshotVals.dateAdded);
              currentEventInVideo.setIsWin(snapshotVals.isWin);
              currentEventInVideo.setIsDraw(snapshotVals.isDraw);
              currentEventInVideo.setIsVideoActionDelimiter(snapshotVals.isMatchActionDelimiter);
              currentEventInVideo.setNumFlag(snapshotVals.numFlags);
              // console.log("move in video being added to annotations array:");
              // console.log(currentEventInVideo)
              annotations.push(currentEventInVideo);
            }
          }
      });
      observer.next(annotations);
    });
    return resultObservable;
  }

  getAnnotationsSortedByStartTime(videoId: string, path: string){
    let ref = firebase.database().ref(path); //'videos/' + videoId + '/events/'
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
          //     // let newMove = new EventInVideo(...snapshotVals[key]);
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

  getAnnotations(videoId: string, path: string){
    let ref = firebase.database().ref(path); //'videos/' + videoId + '/events/'
    let resultObservable = Observable.create(observer =>{
      return ref.on("value", snapshot => { //.orderByChild("timeInitiated")
        let events = snapshot.val();
        observer.next(events);
      });
    });
    return resultObservable;
  }

  addEventInVideoToUserIfUniqueEnough(move: EventInVideo, currentUserId: string): Observable<boolean>{
    console.log("addEventInVideoToUserIfUniqueEnough called in database service");
    // debugger;
    let localUnsubscribeSubject: Subject<void> = new Subject<void>();
    let resultObservable = Observable.create(observer =>{
        let counter: number = 0;
        if(move.getMoveName() !== "No Annotation Currently Selected"){
          this.eventIsUniqueEnough(move, 'users/' + currentUserId + '/eventsAnnotated/').pipe(takeUntil(localUnsubscribeSubject)).subscribe(uniqueEnough =>{
            if(uniqueEnough && counter < 1){
              // console.log("move is unique enough in addEventInVideoToUserIfUniqueEnough");
              let now: string = new Date().toJSON();
              let videoId = move.getVideoId();
              let ref = this.db.list('/users/' + currentUserId + '/eventsAnnotated');
              let moveId = ref.push(move).key;
              let updates = {};
              updates['/users/' + currentUserId + '/eventsAnnotated/' + moveId] = move;
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
          ref = firebase.database().ref('users/' + userId + '/eventsAnnotated/');
          let moveCount = 0;
          ref.on("child_added", childSnapshot =>{
            let move = childSnapshot.val();
            // console.log("move in userHasAnnotatedEnough");
            // console.log(move.dateAdded);
            if(this.dateCalculationsService.calculateDaysSinceLastAnnotation(new Date(move.dateAdded)) <= constants.numDaysBeforeNewAnnotationNeeded){
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
    return this.getGenericApprovedList('/weightClasses');
  }

  getLocations(){
    return this.getGenericApprovedList('/locations');
  }

  getGenericApprovedList(path: string){
    return this.db.list<String>(path).valueChanges();
  }

  getAgeClasses(){
    return this.ageClasses;
  }

  getGiRanks(){
    // console.log("got into getGiRanks in database service");
    this.giRanks.subscribe(results =>{
      // console.log("got up in here");
      // console.log('results in getGiRanks subscription');
      // console.log(results);
    })
    // console.log(this.giRanks);
    return this.giRanks;
  }

  getNoGiRanks(){
    return this.noGiRanks;
  }

  getAllRanks(){
    return this.giRanks.pipe(merge(this.noGiRanks));
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

  addMatchRatingToUser(userId: string, videoId: string, rating: number){
    console.log("addMatchRatingToUser entered")
    let updates = {};
    updates['/users/' + userId + '/videosRated/' + videoId + '/videoRating/'] = rating;
    firebase.database().ref().update(updates);
  }

  addMatchAnnotationRatingToUser(userId: string, videoId: string, annotationRating: number){
    let updates = {};
    updates['/users/' + userId + '/videosRated/' + videoId + '/annotationRating/'] = annotationRating;
    firebase.database().ref().update(updates);
  }
  addMatchRatingToMatch(userId: string, videoId: string, rating: number){
    let updates = {};
    updates['/videos/' + videoId + '/videoRatings/' + userId] = rating;
    firebase.database().ref().update(updates);
  }

  addMatchAnnotationRatingToMatch(userId: string, videoId: string, annotationRating: number){
    let updates = {};
    updates['/videos/' + videoId + '/annotationRatings/' + userId] = annotationRating;
    firebase.database().ref().update(updates);
  }

  average(list: any[]){
    return this.dateCalculationsService.roundToDecimal(list.reduce((prev, curr) => prev + curr) / list.length, 2);
  }


  getAverageVideoRating(videoId: string){
    let ref = firebase.database().ref('videos/' + videoId + '/videoRatings/');
    let resultObservable = Observable.create(observer =>{
      ref.on('value', snapshot =>{
        let results = snapshot.val();
        if(results){
          let arrayOfRatings = Object.values(results);
          let averageRating = this.average(arrayOfRatings);
          this.updateMatchRating(videoId, averageRating);
          observer.next(averageRating);
        } else{
          observer.next(0);
        }
      });
    });
    return resultObservable;
  }

  updateMatchRating(videoId: string, videoRating: number){
    let updates = {};
    updates['videos/' + videoId + '/videoDeets/videoRating'] = videoRating;
    firebase.database().ref().update(updates);
  }

  getAverageAnnotationRating(videoId:string){
    let ref = firebase.database().ref('videos/' + videoId + '/annotationRatings/');
    let resultObservable = Observable.create(observer =>{
      ref.on('value', snapshot =>{
        let results = snapshot.val();
        if(results){
          let arrayOfRatings = Object.values(results);
          // console.log("arrayOfRatings is ");
          // console.log(arrayOfRatings);
          let annotationAverage = this.average(arrayOfRatings);
          this.updateAnnotationRating(videoId, annotationAverage);
          observer.next(annotationAverage);
        } else{
          observer.next(0);
        }
      });
    });
    return resultObservable;
  }

  updateAnnotationRating(videoId: string, annotationRating: number){
    let updates = {};
    updates['videos/' + videoId + '/videoDeets/annotationRating'] = annotationRating;
    firebase.database().ref().update(updates);
  }

  doesMatchExist(videoUrl: string){
    let ref = firebase.database().ref('videos/');
    // let entranceDetector = 0;
    // console.log("doesMatchExist?: ");
    // console.log(result);
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild('/videoDeets/videoUrl').equalTo(videoUrl).limitToFirst(1).once("value", snapshot=>{
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

  deleteMatch(videoId: string){
    console.log("videoId in deleteMatch is " + videoId);
    let ref = firebase.database().ref('videos/' + videoId);
    ref.remove();
  }

  getMatchInNeedOfAnnotation(){
    // console.log("got into getMatchInNeedOfAnnotation in database service");
    let ref = firebase.database().ref('videos/');
    let resultObservable = Observable.create(observer =>{
      ref.orderByChild('videoDeets/annotationRating').limitToFirst(1).on("child_added", result =>{
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

  removeAnnotationInMatchAndUserByStartTime(videoId: string, timeInitiated: number, annotatorUserId: string): Observable<boolean>{ //TODO AndUser
    let resultObservable = Observable.create(observer =>{
      // console.log("got into removeAnnotationInMatchByStartTime"); //TODO flesh out LEFT OFF HERE
      // console.log(videoId);
      // console.log(timeInitiated);
      let ref = firebase.database().ref('videos/' + videoId + '/events/');
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
      let newRef = firebase.database().ref('users/' + annotatorUserId + '/eventsAnnotated/');
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

  flagVideoRemovedInMatch(videoId: string, status: boolean){
    let updates = {};
    updates['/videos/' + videoId + '/videoDeets/flaggedAsMissing'] = status;
    firebase.database().ref().update(updates);
  }

  getVideoRemovedFlagStatus(videoId: string){
    let resultObservable = Observable.create(observer =>{
      let ref = firebase.database().ref('/videos/' + videoId + '/videoDeets/flaggedAsMissing');
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

  getInappropriateFlagStatus(videoId: string){
    let resultObservable = Observable.create(observer =>{
      let ref = firebase.database().ref('/videos/' + videoId + '/videoDeets/flaggedAsInappropriate');
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

  flagVideoInappropriateInMatch(videoId: string, status: boolean){
    let updates = {};
    updates['/videos/' + videoId + '/videoDeets/flaggedAsInappropriate'] = status;
    firebase.database().ref().update(updates);
  }

  // getMoveCategoryFromMoveName(eventName: string){
  //   let resultObservable = Observable.create(observer =>{
  //     let ref = firebase.database().ref('/events/');
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

  addCandidateNameToDb(name: string, associatedvideoUrl: string){
    // console.log("addCandidateNameToDb called");
    // console.log("name is " + name);
    let ref = firebase.database().ref('/candidateAthleteNames/');
    let keyId = ref.push({'name':name, 'associatedvideoUrl': associatedvideoUrl}); //.key;
  }

  addCandidateTournamentNameToDb(name: string, associatedvideoUrl: string){
    // console.log("addCandidateTournamentNameToDb called");
    // console.log("name is " + name);
    // let ref = firebase.database().ref('/candidateTournamentNames/');
    // let keyId = ref.push({'name':name, 'associatedvideoUrl': associatedvideoUrl}); //.key;
    this.addGenericCandidateNameToDb('/candidateTournamentNames/', name, associatedvideoUrl);
  }

  addGenericCandidateNameToDb(path: string, name: string, associatedvideoUrl: string){
    console.log("addGenericCandidateNameToDb called");
    console.log("name is " + name);
    console.log("path is: " + path);
    console.log("associatedvideoUrl is: " + associatedvideoUrl);
    let ref = firebase.database().ref(path);
    ref.push().set({'name':name, 'associatedvideoUrl': associatedvideoUrl}); //.key;
    // ref.transaction(current_value =>{
    //   return {'name':name, 'associatedvideoUrl': associatedvideoUrl};
    // });
    console.log("addGenericCandidateNameToDb done");
  }

  addAthleteNameToDb(name: string){
    //TODO check whether name already exists!
    let ref = firebase.database().ref('/individualNames/');
    ref.push(name);
  }

  getGenericStringNames(path: string){
    // console.log("getGenericStringNames entered");
    // console.log(this.db.list(path).valueChanges());
    return this.db.list(path).valueChanges();
  }

  removeAthleteNameFromCandidateList(name: string){
    // console.log("removeAthleteNameFromCandidateList called");
    let ref = firebase.database().ref('/candidateAthleteNames/');
    ref.orderByChild('name').equalTo(name).on("child_added", snapshot =>{
      // console.log("found entry in removeAthleteNameFromCandidateList:");
      // console.log(snapshot.val());
      ref.child(snapshot.key).remove();
    });
  }

  getCandidateAthleteNames(){
    let ref = firebase.database().ref('/candidateAthleteNames/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('name').on("value", snapshot =>{
        let resultObj = snapshot.val();
        if(resultObj){
          let names = Object.keys(resultObj).map(index => resultObj[index].name);
          observer.next(names);
        } else{
          observer.next([]);
        }
      });
    });
    return obsRet;
    // return 'hey';
    // return this.db.list('/candidateAthleteNames/').valueChanges();
  }

  getvideoUrlFromCandidateAthleteName(name: string){
    // console.log("getvideoUrlFromCandidateAthleteName called");
    let ref = firebase.database().ref('/candidateAthleteNames/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('name').equalTo(name).on("child_added", snapshot =>{
        // console.log("found entry in getvideoUrlFromCandidateAthleteName:");
        // console.log(snapshot.val().associatedvideoUrl);
        observer.next(snapshot.val().associatedvideoUrl);
      });
    });
    return obsRet;
  }

  getVideoIdFromVideohUrl(videoUrl: string){
    // console.log("getVideoIdFromVideohUrl called");
    let ref = firebase.database().ref('/videos/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('videoDeets/videoUrl').equalTo(videoUrl).on("child_added", snapshot =>{
        // console.log(snapshot.val().id);
        // let names = Object.keys(resultObj).map(index => resultObj[index].name);
        // let names = Object.keys(namesObjs).map(index => namesObjs[index]);
        // console.log(names);
        observer.next(snapshot.val().id);
        // console.log(snapshot.val());
      });
    });
    return obsRet;
  }

  updateAthleteNameInMatch(videoId: string, targetName: string, newName: string){
    // console.log("updateAthleteNameInMatch called");
    // console.log("videoId is " + videoId);
    // console.log("target name is " + targetName);
    let ref = firebase.database().ref('/videos/');
    ref.orderByChild('videoDeets/athlete1Name').equalTo(targetName).on('child_added', snapshot =>{
      // console.log("child added athlete1");
      // console.log(snapshot.val());
      if(snapshot.val().id == videoId){
        // console.log("matches athlete1 in known video!");
        let updates = {};
        updates['/videos/' + videoId + '/videoDeets/athlete1Name'] = newName;
        firebase.database().ref().update(updates);
      }
    });
    ref.orderByChild('videoDeets/athlete2Name').equalTo(targetName).on('child_added', snapshot =>{
      // console.log("child added athlete2");
      // console.log(snapshot.val());
      if(snapshot.val().id == videoId){
        // console.log("matches athlete2 in known video");
        let updates = {};
        updates['/videos/' + videoId + '/videoDeets/athlete2Name'] = newName;
        firebase.database().ref().update(updates);
      }
    });
  }

  deleteAthleteName(name: string){
    // console.log("entered deleteAthleteName");
    let ref = firebase.database().ref('individualNames/');
    ref.orderByValue().equalTo(name).on("child_added", snapshot =>{
      // console.log("child added in deleteAthleteName: ");
      // console.log(snapshot.val());
      ref.child(snapshot.key).remove();
    });
    // ref.remove();
  }

  addCandidateEventInVideoToDb(eventName: string, eventCategory: string,moveSubcategory: string, userSubmitting: string, associatedvideoUrl: string){ //TODO associatedvideoUrl
    this.addGenericItemToDb('/candidateMoveNames/', {'eventName':eventName, 'eventCategory': eventCategory,'moveSubcategory': moveSubcategory,'userSubmitting': userSubmitting, 'associatedvideoUrl': associatedvideoUrl});
    // let ref = firebase.database().ref('/candidateMoveNames/');
    // let keyId = ref.push({'eventName':eventName, 'eventCategory': eventCategory,'moveSubcategory': moveSubcategory,'userSubmitting': userSubmitting, 'associatedvideoUrl': associatedvideoUrl}); //.key;
  }

  addMoveNameToDb(eventName: string, categoryName: string, subcategoryName: string){
    //TODO check whether name already exists! (should be done elsehwere, but wouldn't hurt to check here)
    // let ref = firebase.database().ref();
    // ref.push(eventName);
    this.addGenericItemToDb('/events/' + categoryName + '/' + subcategoryName + '/', eventName);
  }

  addTournamentNameToDb(tournamentName: string){
    // let ref = firebase.database().ref();
    // ref.push(tournamentName);
    this.addGenericItemToDb('/tournamentNames/', tournamentName);
  }

  addGenericItemToDb(path: string, genericString: any){
    let ref = firebase.database().ref(path);
    ref.push(genericString);
  }

  doesMoveNameAlreadyExistInDb(eventName: string, categoryName: string, subcategoryName: string): Observable<boolean>{
    let ref = firebase.database().ref('/events/');
    let obsRet = Observable.create(function(observer){
      if(subcategoryName){
        ref.orderByKey().equalTo(categoryName).on("child_added", snapshot =>{ //.equalTo(eventName)
          if(Array.isArray(snapshot.val()[subcategoryName])){
            if(snapshot.val()[subcategoryName].includes(eventName)){
              observer.next(true);
            } else{
              observer.next(false);
            }
          } else{
            if(typeof snapshot.val()[subcategoryName] === 'object' && snapshot.val()[subcategoryName] !== null){
              if(Object.values(snapshot.val()[subcategoryName]).indexOf(eventName)>-1){
                observer.next(true);
              }else{
                observer.next(false);
              }
            } else{
              //it's not an object, it's not an array. I dunno
              console.log("Congrats you found a bug I never expected in my doesMoveNameAlreadyExistInDb. Please report exactly what kind of move you were trying to make!");
              alert("Congrats you found a bug I never expected. Please report!");
            }
          }
        });
      } else{
        ref.orderByKey().equalTo(categoryName).on("child_added", snapshot =>{
          if(Array.isArray(snapshot.val())){
            if(snapshot.val().includes(eventName)){
              observer.next(true);
            }else{
              observer.next(false);
            }
          } else{ //maybe it's an object instead of array?
            if(typeof snapshot.val() === 'object' && snapshot.val() !== null){
              if(Object.values(snapshot.val()).indexOf(eventName)>-1){
                observer.next(true);
              }else{
                observer.next(false);
              }
            } else{
              //it's not an object, it's not an array. I dunno TODO better error handling here?
              console.log("Congrats you found a bug I never expected. Please report!");
              alert("Congrats you found a bug I never expected. Please report!");
            }
          }
        });
      }
    });
    return obsRet;
  }

  removeMoveNameFromCandidateList(eventName: string){
    this.removeGenericStringWithOrderByFromDb('/candidateMoveNames/', 'eventName', eventName);
    // let ref = firebase.database().ref('/candidateMoveNames/');
    // ref.orderByChild('eventName').equalTo(eventName).on("child_added", snapshot =>{
    //   ref.child(snapshot.key).remove();
    // });
  }

  removeTournamentNameFromCandidateList(tournamentName: string){
    this.removeGenericStringWithOrderByFromDb('/candidateTournamentNames/', 'name', tournamentName);
    // let ref = firebase.database().ref('/candidateTournamentNames/');
    // ref.orderByChild('name').equalTo(tournamentName).on("child_added", snapshot =>{
    //   ref.child(snapshot.key).remove();
    // });
  }

  removeGenericStringWithOrderByFromDb(path: string, orderIndex: string, genericString: string){
    let ref = firebase.database().ref(path);
    ref.orderByChild(orderIndex).equalTo(genericString).on("child_added", snapshot =>{
      ref.child(snapshot.key).remove();
    });
  }

  getCandidateMoves(){
    let ref = firebase.database().ref('/candidateMoveNames/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('eventName').on("value", snapshot =>{
        let resultObj = snapshot.val();
        if(resultObj){
          observer.next(resultObj);
        } else{
          observer.next([]);
        }
      });
    });
    return obsRet;
  }

  getCandidateMoveNames(){
    let ref = firebase.database().ref('/candidateMoveNames/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('eventName').on("value", snapshot =>{
        let resultObj = snapshot.val();
        if(resultObj){
          let names = Object.keys(resultObj).map(index => resultObj[index].eventName);
          observer.next(names);
        } else{
          observer.next([]);
        }
      });
    });
    return obsRet;
  }

  getMoveNamesFromCategory(category: string){
    let ref = firebase.database().ref('/events/' + category + '/');
    let obsRet = Observable.create(function(observer){
      ref.on("value", snapshot =>{
        let resultObj = snapshot.val();
        if(resultObj){
          let names = Object.keys(resultObj).map(index => resultObj[index]);
          observer.next(names);
        } else{
          observer.next([]);
        }
      });
    });
    return obsRet;
  }

  getvideoUrlFromCandidateMoveName(eventName: string){
    let ref = firebase.database().ref('/candidateMoveNames/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('eventName').equalTo(eventName).on("child_added", snapshot =>{
        observer.next(snapshot.val().associatedvideoUrl);
      });
    });
    return obsRet;
  }

  getvideoUrlFromMatchId(videoId: string){
    let ref = firebase.database().ref('/videos/' + videoId + '/videoDeets/videoUrl');
    let obsRet = Observable.create(function(observer){
      ref.orderByKey().on("value", snapshot =>{
        // console.log("snapshot.val() from getvideoUrlFromMatchId is:");
        // console.log(snapshot.val());
        observer.next(snapshot.val());
      });
    });
    return obsRet;
  }

  getvideoUrlFromCandidateTournamentName(tournamentName: string){
    // let ref = firebase.database().ref('/candidateTournamentNames/');
    // let obsRet = Observable.create(function(observer){
    //   ref.orderByChild('name').equalTo(tournamentName).on("child_added", snapshot =>{
    //     observer.next(snapshot.val().associatedvideoUrl);
    //   });
    // });
    // return obsRet;
    return this.getvideoUrlFromGenericCandidateName('/candidateTournamentNames/', 'name', tournamentName);
  }

  getvideoUrlFromGenericCandidateName(candidatePath: string, orderByParameter:string, name: string){
    let ref = firebase.database().ref(candidatePath);
    let obsRet = Observable.create(function(observer){
      ref.orderByChild(orderByParameter).equalTo(name).on("child_added", snapshot =>{
        observer.next(snapshot.val().associatedvideoUrl);
      });
    });
    return obsRet;
  }

  updateMoveNameInMatch(videoId: string, moveId: string, targetName: string, newName: string){
    // let updates = {};
    // updates['/videos/' + videoId + '/events/' + moveId + '/eventName/'] = newName;
    // firebase.database().ref().update(updates);
    this.updateGenericNameIVideo('/events/' + moveId + '/eventName/', videoId, newName);
  }

  updateTournamentNameInMatch(videoId: string, newName: string){
    this.updateGenericNameIVideo('/videoDeets/tournamentName', videoId, newName);
    // let updates = {};
    // updates['/videos/' + videoId + '/videoDeets/tournamentName'] = newName;
    // firebase.database().ref().update(updates);
  }

  updateGenericNameIVideo(subPath: string, videoId: string, newName: string){
    console.log("entered updateGenericNameIVideo");
    console.log("subPath is " + subPath);
    console.log("videoId is " + videoId);
    console.log("newName is " + newName);
    let updates = {};
    updates['/videos/' + videoId + '/' + subPath] = newName;
    firebase.database().ref().update(updates);
  }

  deleteMoveName(eventName: string, categoryName: string, subcategory: string){ //just put '' if there is no subcategory
    subcategory = subcategory + '/';
    let ref = firebase.database().ref('events/' + categoryName + '/' + subcategory);
    ref.orderByValue().equalTo(eventName).on("child_added", snapshot =>{
      ref.child(snapshot.key).remove();
    });
  }

  deleteTournamentName(tournamentName: string){
    let ref = firebase.database().ref('tournamentNames/');
    ref.orderByValue().equalTo(tournamentName).on("child_added", snapshot =>{
      ref.child(snapshot.key).remove();
    });
  }

  deleteGenericString(path: string, name: string){
    let ref = firebase.database().ref(path);
    ref.orderByValue().equalTo(name).on("child_added", snapshot =>{
      ref.child(snapshot.key).remove();
    });
  }

  getMoveIdFromMatchId(videoId: string, eventName: string){
    let ref = firebase.database().ref('videos/' + videoId + '/events/');
    let obsRet = Observable.create(function(observer){
      ref.orderByChild('eventName').equalTo(eventName).on("child_added", snapshot =>{
        observer.next(snapshot.key);
      });
    });
    return obsRet;
  }

  getSubcategoryFromMoveAndCategory(category: string, move: string){
    let ref = firebase.database().ref('events/' + category + '/');
    let obsRet = Observable.create(function(observer){
      ref.orderByKey().on("value", snapshot =>{
        let categoryObj = snapshot.val();
        let arregateArray = Object.keys(categoryObj).map(subcat => categoryObj[subcat]);
        let allSubcatMoveNames = [];
        arregateArray.forEach(arrayElem =>{
          if(Array.isArray(arrayElem)){
            allSubcatMoveNames = allSubcatMoveNames.concat(arrayElem);
          } else{
            let objectVals = Object.values(arrayElem);
            allSubcatMoveNames = allSubcatMoveNames.concat(objectVals);
          }
        });
        if(allSubcatMoveNames.includes(move)){
          Object.keys(categoryObj).forEach(objKey =>{
            if(Array.isArray(categoryObj[objKey])){
              if(categoryObj[objKey].includes(move)){
                observer.next(objKey);
              }
            } else{
              let renderedArray = Object.values(categoryObj[objKey]);
              if(renderedArray.includes(move)){
                observer.next(objKey);
              }
            }
          });
        } else{
          observer.next('');
        }
      });
    });
    return obsRet;
  }

  getSubscriptionIdFromUser(userNodeId: string){
    let ref = firebase.database().ref('/users/' + userNodeId + '/subscriptionInfo/subscriptionId');
    let obsRet = Observable.create(function(observer){
      ref.orderByValue().on("value", snapshot =>{
        if(snapshot){
            // console.log(snapshot.val());
            observer.next(snapshot.val());
        }
      });
    });
    return obsRet;
  }

  doesGenricCandidateAlreadyExistInDb(path: string, name: string): Observable<boolean>{
    // console.log("doesGenricCandidateAlreadyExistInDb entered");
    // console.log("looking for: " + name + " in path: " +path);
    let counter: number = 0;
    let ref = firebase.database().ref(path);
    let obsRet = Observable.create(function(observer){
      if(name){
        ref.orderByKey().on("value", snapshot =>{
          if(snapshot.val()){
            let items: any = Object.values(snapshot.val());
            items.forEach(item =>{
              if(item === name){
                observer.next(true);
                counter += 1;
                return obsRet;
              }
            });
            if(counter<1){
              // console.log("seems like we went through the whole collection of items and found no match. Returning false...");
              observer.next(false);
              return obsRet;
            }
          }else{
            //snapshot doesn't exist
            observer.next(false);
            return obsRet;
          }
        });
      } else{
        observer.next(false);
        return obsRet;
      }
    });
    return obsRet;
  }

  doesCollectionAlreadyExistInDb(collection: Collection): Observable<boolean>{
    // console.log("doesCollectionAlreadyExistInDb entered");
    // console.log(collection);
    let counter: number = 0;
    let ref = firebase.database().ref('/collections/');
    let obsRet = Observable.create(function(observer){
      if(collection){
        ref.orderByKey().on("value", snapshot =>{
          if(snapshot.val()){
            let collections = Object.values(snapshot.val());
            collections.forEach(dbCollection =>{
              let currentDbCollection: Collection = Collection.fromDataBase(dbCollection);
              if(Collection.isEqual(collection, currentDbCollection)){
                observer.next(true);
                counter += 1;
                return obsRet;
              }
            });
            if(counter<1){
              // went through the whole collection of collections and found no match. Returning false..."
              observer.next(false);
              return obsRet;
            }
          }else{
            //snapshot doesn't exist
            observer.next(false);
            return obsRet;
          }
        });
      } else{
        // collection DNE
        observer.next(false);
        return obsRet;
      }
    });
    return obsRet;
  }

  addCollectionToDatabase(collection: Collection, userId: string): Observable<any>{
    console.log("addCollectionToDatabase called");
    let self = this;
    let obsRet = Observable.create(function(observer){
      self.doesCollectionAlreadyExistInDb(collection).pipe(take(1)).subscribe(alreadyExists =>{
        if(alreadyExists){
          observer.next({collectionId: null, status: false});
          return obsRet;
        }else{
          // console.log("looks like entry doesn't already exist from addCollectionToDatabase function call to doesCollectionAlreadyExistInDb. Adding entry...");
          // console.log(collection);
          let ref = self.db.list('/collections');
          let collectionId = ref.push(collection).key;
          collection.setId(collectionId);
          let updates = {};
          updates['/users/' + userId + '/collections/' + collectionId] = collection;
          updates['/collections/' + collectionId + '/id/'] = collectionId;
          firebase.database().ref().update(updates);
          // console.log("done writing to database");
          observer.next({collectionId: collectionId, status: true});
          return obsRet;
        }
      });
    });
    return obsRet;
  }

  addOwnerQuestionSetToDatabase(ownerQuestionSet: OwnerQuestionSet, userId: string): Observable<boolean>{
    console.log("addOwnerQuestionSetToDatabase called");
    let self = this;
    let obsRet = Observable.create(function(observer){
          let collectionId = ownerQuestionSet.getCollectionId();
          let updates = {};
          updates['/users/' + userId + '/collections/' + collectionId + '/ownerQuestions/'] = ownerQuestionSet.getOwnerQuestions();
          updates['/collections/' + collectionId + '/ownerQuestions/'] = ownerQuestionSet.getOwnerQuestions();
          firebase.database().ref().update(updates);
          observer.next(true);
          return obsRet;
    });
    return obsRet;
  }

  updateVideoDeet(questionAssociatedWithUpdateVal:any, path: string, updateVal: string, videoId: string, videoUrl: string, userId: string, oldVal: string): Observable<boolean>{
    console.log("oldVal is: " + oldVal);
    console.log("updateVideoDeet called");
    console.log("questionAssociatedWithUpdateVal is: ");
    console.log(questionAssociatedWithUpdateVal);
    let self = this;
    let obsRet = Observable.create(function(observer){
          let updates = {};
          if(path.indexOf(constants.nameOfIndividual1InDb)>-1 || path.indexOf(constants.nameOfIndividual2InDb)>-1){
            let subpath = path.substring(0,path.indexOf(constants.nameOfVideoDetailsInDb));
            // console.log("subpath is: " + subpath);
            let eventsPath = subpath + constants.nameOfEventsInDb;
            // console.log("eventsPath is " + eventsPath);
            let events = firebase.database().ref(eventsPath);
            events.once('value', (snapshot) =>{
              snapshot.forEach((childSnapshot) =>{
                let childKey = childSnapshot.key;
                let childData = childSnapshot.val();
                // console.log("childKey is: " + childKey);
                console.log("childData is: ");
                console.log(childData);
                let actorOrRecipient = null;
                if(childData.actor===oldVal){
                  console.log("got here 1");
                  actorOrRecipient = "actor";
                  updates[eventsPath+'/'+childKey+'/'+ actorOrRecipient] = updateVal;
                }
                if(childData.actor===constants.noneEntered && path.indexOf(constants.nameOfIndividual1InDb)>-1){
                  console.log("got here 2");
                  actorOrRecipient = "actor";
                  updates[eventsPath+'/'+childKey+'/'+ actorOrRecipient] = updateVal;
                }
                if(childData.actor===constants.noneEntered2 && path.indexOf(constants.nameOfIndividual2InDb)>-1){
                  console.log("got here 3");
                  actorOrRecipient = "actor";
                  updates[eventsPath+'/'+childKey+'/'+ actorOrRecipient] = updateVal;
                }
                if(childData.recipient===oldVal){
                  console.log("got here 4");
                  actorOrRecipient = "recipient";
                  updates[eventsPath+'/'+childKey+'/'+ actorOrRecipient] = updateVal;
                }
                if(childData.recipient===constants.noneEntered && path.indexOf(constants.nameOfIndividual1InDb)>-1){
                  console.log("got here 5");
                  actorOrRecipient = "recipient";
                  updates[eventsPath+'/'+childKey+'/'+ actorOrRecipient] = updateVal;
                }
                if(childData.recipient===constants.noneEntered2 && path.indexOf(constants.nameOfIndividual2InDb)>-1){
                  console.log("got here 6");
                  actorOrRecipient = "recipient";
                  updates[eventsPath+'/'+childKey+'/'+ actorOrRecipient] = updateVal;
                }

                // can't do updates[eventsPath+'/'+childKey+'/'+ actorOrRecipient] = updateVal here, because the more than one update path may need to be updated from the above logic
              });
            });
            //TODO loop through and change all athlete 1s where there was an old athelete 1 value
          } else{
            console.log("path is not for an individual");
          }
          updates[path] = updateVal; //'/videos/' + videoId +
          console.log("questionAssociatedWithUpdateVal.enableAddNew is: " + questionAssociatedWithUpdateVal.enableAddNew);
          // console.log(questionAssociatedWithUpdateVal.enableAddNew);
          if(questionAssociatedWithUpdateVal.enableAddNew){
            self.doesGenricCandidateAlreadyExistInDb(questionAssociatedWithUpdateVal.pathToConfirmedValues, updateVal).pipe(take(1)).subscribe(alreadyExists =>{
              console.log("alreadyExists in updateVideoDeet is: " + alreadyExists);
              if(!alreadyExists){
                self.addGenericCandidateNameToDb(questionAssociatedWithUpdateVal.pathToCandidateValues, self.textTransformationService.capitalizeFirstLetter(updateVal), videoUrl);
              }
            });
          }
          firebase.database().ref().update(updates);
          observer.next(true);
          return obsRet;
    });
    return obsRet;
  }

  getCollection(collectionId: string){
    let ref = firebase.database().ref('collections/' + collectionId);
    let obsRet = Observable.create(function(observer){
      ref.once("value").then(snapshot =>{
        // console.log("snapshot in getCollection:");
        // console.log(snapshot);
        observer.next(snapshot.val());
      });
    });
    return obsRet;
  }

  getCollections(userId: string){
    let ref = firebase.database().ref('users/' + userId + '/collections');
    let obsRet = Observable.create(function(observer){
      ref.once("value").then(snapshot =>{
        console.log("snapshot.val() in getCollections:");
        console.log(snapshot.val());
        if(snapshot.val()){
          let collectionObjArray = Object.values(snapshot.val());
          let collectionArray = collectionObjArray.map(Collection.fromDataBase)
          observer.next(collectionArray);
        }else{
          observer.next(null);
        }
      });
    });
    return obsRet;
  }

  deleteCollectionAndConfirm(collection: Collection, user: any){
    let obsRet = Observable.create(function(observer){
      console.log("deleteCollection entered");
      let ref = firebase.database().ref('collections/' + collection.getId());
      ref.remove();
      if(user){
        if(user.id){
          console.log(user.id);
          ref = firebase.database().ref('users/' + user.id + '/collections/' + collection.getId());
          ref.remove();
          observer.next(true);
        }
      }
    });
    return obsRet;
  }

  addFeedbackToDatabase(feedback: any, userId: string){
    console.log("addFeedbackToDatabase called");
    console.log(feedback);
    console.log(userId);
    let ref = this.db.list('/feedback');
    let feedbackId = ref.push(feedback).key;
    let updates = {};
    updates['/feedback/' + feedbackId + '/userWhoSubmitted/'] = userId;
    firebase.database().ref().update(updates);
  }

  getFeedback(){
    let ref = firebase.database().ref('/feedback');
    let obsRet = Observable.create(function(observer){
      ref.once("value").then(snapshot =>{
        console.log("snapshot.val() in getFeedback:");
        console.log(snapshot.val());
        if(snapshot.val()){
          let feedbackObjArray = Object.values(snapshot.val());
          let feedbackItemArray = feedbackObjArray.map(FeedbackItem.fromDataBase)
          observer.next(feedbackItemArray);
        }else{
          observer.next(null);
        }
      });
    });
    return obsRet;
  }
}
