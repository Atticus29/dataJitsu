import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FlatTreeControl } from '@angular/cdk/tree';

import { Subject, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, take, last } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { AuthorizationService } from '../authorization.service';
import { TextTransformationService } from '../text-transformation.service';
import { StarRatingColor } from '../star-rating/star-rating.component';

import { DynamicDataSource } from '../dynamicDataSource.model';
import { DynamicDatabase } from '../dynamicDatabase.model';
import { VideoDetails } from '../videoDetails.model';
import { Video } from '../video.model';
import { User } from '../user.model';
import { EventInVideo } from '../eventInVideo.model';
import { DynamicFlatNode } from '../dynamicFlatNode.model';
import { constants } from '../constants';

var player;

@Component({
  selector: 'app-video-display',
  templateUrl: './video-display.component.html',
  styleUrls: ['./video-display.component.scss']
})

export class VideoDisplayComponent extends BaseComponent implements OnInit {
  private rating:number = 3;
  private starCount:number = 5;
  private starColor:StarRatingColor = StarRatingColor.accent;
  private starColorP:StarRatingColor = StarRatingColor.primary;
  private starColorW:StarRatingColor = StarRatingColor.warn;
  videoId : string;
  matchDetails: VideoDetails;
  match: Observable<Video>;
  matchUrl: string;
  currentTime: string;
  playCount: number = 0;
  private loading: boolean = true;
  private eventName: string = null;
  private eventCategory: string = null;
  private performer: string = null;
  private recipient: string = null;
  private startTime: number = null;
  private endTime: number = null;
  private points: number = null;
  private submissionStatus: boolean = null;
  private attemptStatus: boolean = null;
  private trigger: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userInDbId: string = null;
  private moveAssembledStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tempMove: EventInVideo;
  private dataSource: DynamicDataSource;
  private treeControl: FlatTreeControl<DynamicFlatNode>;
  getLevel = (node: DynamicFlatNode) => node.level;
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  private showInappropriateFlagChip = false;
  private showRemovedFlagChip = false;
  private isAdmin: boolean = false;
  private player: any;
  private ytId: string = constants.defaultVideoUrlCode;
  private displayAnnotationRating: boolean = true;
  private annotationFinishButtonDisabled: boolean = true;
  private selectedAnnotation: string = "No Annotation Currently Selected";
  private videoAverageRating: number = 0;
  private annotationAverageRating: number = 0;
  private flaggedRemovedStatus: string = "Fetching...";
  private flaggedInappropriateStatus: string = "Fetching...";
  private showFlagChips: boolean = false;
  private giStatus: string = "Fetching...";

  // private originalPosterId: string = null;
  // private defaultUrl: string = "https://www.youtube.com/embed/"+constants.defaultVideoUrlCode +"?enablejsapi=1&html5=1&";
  // private shouldVideoResume: boolean = false;
  // private database: DynamicDatabase;

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute, public snackBar: MatSnackBar, private trackerService:TrackerService, private authService: AuthorizationService, private database: DynamicDatabase, private textTransformationService: TextTransformationService) {
    super();
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, this.db);
    this.dataSource.data = database.initialData();
  }

  ngOnInit() {
    combineLatest([this.trackerService.youtubePlayerLoadedStatus, this.trackerService.currentUserBehaviorSubject]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(([videoLoadedStatus, user]) =>{
      if(videoLoadedStatus && this.player){
        this.player.loadVideoById(this.ytId, 0);
        if(this.player.getCurrentTime()==0 || this.player.getCurrentTime()==undefined){
          this.stopVideo();
        }
      }
      if(!videoLoadedStatus){
        console.log("video not loaded");
        console.log(videoLoadedStatus);
      }
      if(!this.player){
        console.log("player dead");
      }
      if(user){
        user.id ? this.userInDbId = user.id: this.userInDbId = null;
        user.privileges.isAdmin ? this.isAdmin = true : this.isAdmin = false;
      }
    });

    this.trackerService.desiredJumpStartTime.pipe(takeUntil(this.ngUnsubscribe)).subscribe(localDesiredJumpStartTime =>{
      console.log("desiredJumpStartTime changed to " + localDesiredJumpStartTime);
      if(localDesiredJumpStartTime  && this.player){
        this.player.playVideo();
        this.player.seekTo(Math.max(0.5,localDesiredJumpStartTime-0.5));
      }
    });

    this.trigger.pipe(takeUntil(this.ngUnsubscribe)).subscribe(triggerCheck => {
      // debugger;
      if(this.asssembleCheck()){
        self.tempMove = new EventInVideo(this.eventName, this.eventCategory, this.performer, this.recipient, this.startTime, this.endTime, this.points, this.videoId, this.submissionStatus, this.attemptStatus, this.userInDbId);
        this.handleSettingMoveNameStatuses(self.tempMove, this.eventName);
        self.moveAssembledStatus.next(true);
      } else{
        //Do nothing
      }
    });
    let self = this;
    this.trackerService.annotationBegun.pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
      if(status){
        this.annotationFinishButtonDisabled = false;
      }
      if(status == false){
        this.annotationFinishButtonDisabled = true;
      }
    });
    this.route.params.pipe(take(1)).subscribe(params => {
      console.log("params changed");
      // debugger;
      this.trackerService.youtubePlayerLoadedStatus.next(false);
      this.videoId = params['videoId'];
      if(this.videoId === "undefined"){
        this.router.navigate(['error']);
      }
      if(this.videoId){
        this.db.getVideoRemovedFlagStatus(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          status ? this.handleFlaggedAsRemoved(true) : this.handleFlaggedAsRemoved(false);
        });
        this.db.getInappropriateFlagStatus(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          status ? this.handleInappropriateFlagged(true) : this.handleInappropriateFlagged(false);
        });
        this.db.getMatchUrlFromMatchId(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchUrl =>{
          this.ytId = this.parseVideoUrl(matchUrl);
          if(this.player){
            // this.player.loadVideoById(this.ytId, 0); //TODO this must have broken something.... right?
          }
        });
      }
      this.db.getAverageVideoRating(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(average =>{ //TODO place inside videoId params LEFT OFF HERE
        this.videoAverageRating = average;
      });
      this.db.getAverageAnnotationRating(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(average =>{ //TODO place inside videoId params LEFT OFF HERE
        console.log("got into getAverageAnnotationRating in match-display component. Average is:");
        console.log (average);
        this.annotationAverageRating = average;
      });
      this.trackerService.currentMatch.next(this.videoId);
      this.db.getMainAnnotatorOfMatch(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(mainAnnotator =>{
        if(mainAnnotator.annotatorUserId === this.userInDbId && !this.isAdmin){
          this.displayAnnotationRating = false;
        } else{
          this.displayAnnotationRating = true;
        }
      });
      this.db.getMatchFromNodeKey(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
        if(match){
          this.match = match;
          match.videoDeets.giStatus ? this.giStatus = "Gi" : this.giStatus = "Nogi";
          this.ytId = this.parseVideoUrl(match.videoDeets.videoUrl);

          this.trackerService.eventName.pipe(takeUntil(this.ngUnsubscribe)).subscribe(eventName =>{
            this.selectedAnnotation = eventName;
          })

          this.trackerService.videoResumeStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(videoResumeStatus =>{
            if(videoResumeStatus){
              this.player.playVideo();
            }
          });
        }
      });
    });

    this.moveAssembledStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
      if(status && this.moveCompletelyLegit()){
      try {
        this.processMatchEntryInDatabase();
      }
      catch(error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
      }
        self.dataSource.dataChange.next(self.database.initialData());
        let flatNodeArray: DynamicFlatNode[] = new Array<DynamicFlatNode>();
        constants.rootNodes.forEach(rootNode =>{ //headers
          let newDynamicFlatNode = new DynamicFlatNode(rootNode, 0, true, false);
          flatNodeArray.push(newDynamicFlatNode);
        });
        self.dataSource.dataChange.next(flatNodeArray);
      } else{
        // console.log("either status is false or moveCompletelyLegit is false");
        //Nothing
      }
    });
  }

  onRateVideo($event) { //:{oldValue:number, newValue:number, starRating:VideoDisplayComponent}
    let newRating = $event;
    if(this.userInDbId && newRating!=null){
      this.db.addMatchRatingToUser(this.userInDbId, this.videoId, newRating);
      this.db.addMatchRatingToMatch(this.userInDbId, this.videoId, newRating);
    }else{
      this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
        this.db.getUserByUid(usr.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(uzr => {
          let userInDb: string = uzr.id;
          this.db.addMatchRatingToUser(userInDb, this.videoId, newRating);
          this.db.addMatchRatingToMatch(userInDb, this.videoId, newRating);
        });
      });
    }
  }

  onRateAnnotation($event) {//:{oldValue:number, newValue:number, starRating:VideoDisplayComponent}
    let newRating = $event;
    if(this.userInDbId){
      this.db.addMatchAnnotationRatingToUser(this.userInDbId, this.videoId, newRating);
      this.db.addMatchAnnotationRatingToMatch(this.userInDbId, this.videoId, newRating);
      if($event.newValue > constants.numberOfStarsForAnAnnotationRatingToBeConsideredStrong){
        this.db.getMainAnnotatorOfMatch(this.videoId).pipe(take(1)).subscribe(majorityAnnotator =>{
          if(majorityAnnotator.annotatorUserId !== this.userInDbId){
            this.db.updateUserReputationPoints(majorityAnnotator.annotatorUserId, constants.numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating, "You annotated the majority of the moves in match " + this.videoId +".");
          }
          if(majorityAnnotator.annotatorUserId === this.userInDbId){
            console.log("bish just upvoted their own shit");
          }
        });
      }
    }else{
      this.trackerService.currentUserBehaviorSubject.pipe(take(1)).subscribe(usr =>{
        console.log(usr);
        this.db.getUserByUid(usr.uid).pipe(take(1)).subscribe(result => {
          let userDbId: string = result.id;
          this.db.addMatchAnnotationRatingToUser(userDbId, this.videoId, newRating);
          this.db.addMatchAnnotationRatingToMatch(userDbId, this.videoId, newRating);
          if($event.newValue > constants.numberOfStarsForAnAnnotationRatingToBeConsideredStrong){
            this.db.getMainAnnotatorOfMatch(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(majorityAnnotator =>{
              if(majorityAnnotator.annotatorUserId !== userDbId){
                this.db.updateUserReputationPoints(majorityAnnotator.annotatorUserId, constants.numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating, "You annotated the majority of the moves in match " + this.videoId +".");
              }
              if(majorityAnnotator.annotatorUserId === userDbId){
                console.log("bish just upvoted their own shit");
              }
            });
          }
        });
      });
    }
  }

  moveCompletelyLegit(): boolean{
    let returnVal = false;
    try {
      returnVal = ((this.tempMove.actor !== "Nobody") && (this.tempMove.recipient !== "Nobody") && (this.tempMove.points > -1) && (this.tempMove.eventName != null) && (this.tempMove.eventName !== "No Annotation Currently Selected") && (this.tempMove.eventCategory != null) && (this.tempMove.eventCategory != "No Category Currently Selected") && (this.tempMove.actor != null) && (this.tempMove.recipient != null) && (this.tempMove.timeInitiated > -1) && (this.tempMove.timeInitiated != null) && (this.tempMove.timeCompleted > -1) && (this.tempMove.timeCompleted != null) && (this.tempMove.points != null) && (this.tempMove.points > -1) && (this.tempMove.associatedVideoId != null) && (this.tempMove.isASubmission != null) && (this.tempMove.isSuccessfulAttempt != null) && (this.tempMove.annotatorUserId != null));
    }
    catch(err) {
      returnVal = false;
    }
    return returnVal;
  }
  parseVideoUrl(url: string){ //@TODO seems hacky
    var re = /.*youtu.+?be\/(.+)/ig;
    var result = re.exec(url);
    console.log("results from parseVideoUrl:");
    console.log(result);
    return result[1];
  }

  onMoveSelected(moveSelected: EventInVideo){
    player.playVideo();
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }

  asssembleCheck(): Boolean{ //TODO necessary in addition to moveCompletelyLegit ??
    console.log("asssembleCheck entered");
    // console.log(this.eventName);
    // console.log(this.eventCategory);
    // console.log(this.performer);
    // console.log(this.recipient);
    // console.log(this.startTime);
    // console.log(this.endTime);
    // console.log(this.points);
    // console.log(this.videoId);
    // console.log(this.submissionStatus);
    // console.log(this.attemptStatus);
    // console.log(this.userInDbId);
    if(this.eventName && this.eventName !=="No Annotation Currently Selected" && this.eventCategory && this.eventCategory !== "No Category Currently Selected" && this.performer && this.recipient && (this.startTime > -1) && (this.startTime != null) && (this.endTime > -1) && (this.endTime != null) && (this.points != null) && this.videoId && (this.submissionStatus != null) && (this.attemptStatus != null) && this.userInDbId){
      console.log("everything is true in asssembleCheck");
      return true;
    } else{
      console.log("asssembleCheck is false");
      return false;
    }
  }

  triggerNewAnnotationFetch(){
    this.trackerService.fetchNewAnnotations.next(true);
  }

  flagVideo(){
    if(this.videoId){
      this.db.getVideoRemovedFlagStatus(this.videoId).pipe(take(1)).subscribe(status =>{
        status ? this.db.flagVideoRemovedInMatch(this.videoId, false): this.db.flagVideoRemovedInMatch(this.videoId, true);
      });
    } else{
      // console.log("video has been flagged as removed, but videoId could not be found");
    }
  }

  flagVideoInappropriate(){
    if(this.videoId){
      console.log("flagVideoInappropriate entered and videoId exists");
      this.db.getInappropriateFlagStatus(this.videoId).pipe(take(1)).subscribe(status =>{
        console.log("status inside getInappropriateFlagStatus called and is " + status);
        status ? this.db.flagVideoInappropriateInMatch(this.videoId, false): this.db.flagVideoInappropriateInMatch(this.videoId, true);
      });
    } else{
      // console.log("video has been flagged as removed, but videoId could not be found");
    }
  }

  processMatchEntryInDatabase(){
    console.log("processMatchEntryInDatabase entered");
    let annotationMadeCounter: number = 0;
    this.db.addEventInVideoToVideoIfUniqueEnough(this.tempMove).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveUniqueEnough =>{
      console.log("addEventInVideoToVideoIfUniqueEnough entered");
      if(!moveUniqueEnough){
        if(annotationMadeCounter < 1){
          this.openSnackBar("Annotation has already been made by another user");
          annotationMadeCounter ++ ;
        }
        this.eventName = null;
        this.eventCategory = null;
        this.performer = null;
        this.recipient = null;
        this.startTime = null;
        this.endTime = null;
        this.points = null;
        this.submissionStatus = null;
        this.attemptStatus = null;
        this.trackerService.resetAllExceptCurrentMatch();
        this.moveAssembledStatus.next(false);
      } else{
        this.db.addEventInVideoToUserIfUniqueEnough(this.tempMove, this.userInDbId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveUniqueEnoughInUser =>{
          if(moveUniqueEnoughInUser){
            this.openSnackBar(constants.annotationRecordedMessage);
            annotationMadeCounter ++;
            this.handleNullingAndResettingLocalAndTrackedVariables();
          }else{
            this.handleNullingAndResettingLocalAndTrackedVariables();
          }
        });
      }
    });
  }

  savePlayer(player) {
    this.player = player;
    this.trackerService.youtubePlayerLoadedStatus.next(true);
    // this.player.loadVideoById(this.ytId, 0); //TODO possibly breaking broken maybe?
    this.loading = false;
  }
  onStateChange(event) {
    // console.log('player state', event.data);
  }

  changeId(newId: string){
    // console.log("changeId entered: " + newId)
    this.ytId = newId;
    this.player.loadVideoById(newId, 0);
  }

  handleSettingMoveNameStatuses(move: EventInVideo, eventName: string){
    if(eventName === "Win"){
      move.setIsWin(true);
    }
    if(eventName == "Tie; Draw"){
      move.setIsDraw(true);
    }
  }

  handleFlaggedAsRemoved(flaggedStatus: boolean){
    if(flaggedStatus){
      this.showFlagChips = true;
      this.showRemovedFlagChip = true;
      this.flaggedRemovedStatus = "This video has been flagged as missing";
    } else{
      if(!this.showInappropriateFlagChip){
        this.showFlagChips = false;
      }
      this.showRemovedFlagChip = false;
      this.flaggedRemovedStatus = "";
    }
  }

  handleInappropriateFlagged(flaggedStatus: boolean){
    if(status){
      this.showFlagChips = true;
      this.showInappropriateFlagChip = true;
      this.flaggedInappropriateStatus = "This video has been flagged as inappropriate";
    }else{
      if(!this.showRemovedFlagChip){
        this.showFlagChips = false;
      }
      this.showInappropriateFlagChip = false;
      this.flaggedInappropriateStatus = "";
    }
  }

  playVideo(){
    this.player.playVideo();
  }

  stopVideo(){
    this.player.stopVideo();
  }

  pauseVideo(){
    this.player.pauseVideo();
  }

  rewindVideo(duration: number){
    let currentTime = this.player.getCurrentTime();
    this.player.seekTo(Math.max(0.5, currentTime - duration));
  }

  fastForwardVideo(duration: number){
    let currentTime = this.player.getCurrentTime();
    this.player.seekTo(Math.max(0.5, currentTime + duration));
  }

  beginMove(){
    this.player.pauseVideo();
    let currentTime = this.player.getCurrentTime();
    this.trackerService.startTimePoint.next(this.player.getCurrentTime());
    this.trackerService.endTimePoint.next(-1);
  }

  endMove(){
    console.log("end move clicked");
    this.player.pauseVideo();
    let endMoveClickCounter: number = 0;
    let currentTime: number = this.player.getCurrentTime();
    this.trackerService.endTimePoint.next(currentTime);
    combineLatest([this.trackerService.startTimePoint, this.trackerService.endTimePoint, this.trackerService.points]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      this.startTime = results[0];
      this.endTime = results[1];
      this.points = results[2];
      this.trigger.next(true);
    });
    combineLatest([this.trackerService.eventName, this.trackerService.eventCategory, this.trackerService.performer, this.trackerService.recipient, this.trackerService.currentMatch, this.trackerService.submission, this.trackerService.attemptStatus]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      this.eventName = results[0];
      this.eventCategory = results[1];
      this.performer = results[2];
      this.recipient = results[3];
      this.videoId = results[4];
      results[5] === "Yes" ? this.submissionStatus = true: this.submissionStatus = false;
      results[6] === "Yes" ? this.attemptStatus = true: this.attemptStatus = false;
      this.trigger.next(true);
    });
    this.userInDbId ? this.fetchAndEmitUserIdInTrigger(false): this.fetchAndEmitUserIdInTrigger(true);
    this.moveAssembledStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
      if(status && this.moveCompletelyLegit()){
        console.log(this.tempMove);
        this.player.seekTo(Math.max(0.5,currentTime-3));
        this.player.playVideo();
      }
    });
  }

  fetchAndEmitUserIdInTrigger(doIt: boolean){
    if(doIt){
      this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user =>{
        user ? this.userInDbId = user.id : this.userInDbId = null;
        this.trigger.next(true);
      });
    } else{
      //Do nothing
    }
  }

  handleNullingAndResettingLocalAndTrackedVariables(){
    this.eventName = null;
    this.eventCategory = null;
    this.performer = null;
    this.recipient = null;
    this.startTime = null;
    this.endTime = null;
    this.points = null;
    this.submissionStatus = null;
    this.attemptStatus = null;
    this.trackerService.resetAllExceptCurrentMatch();
    this.moveAssembledStatus.next(false);
    this.triggerNewAnnotationFetch();
  }
}
