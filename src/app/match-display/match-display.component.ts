import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';

import { Subject, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, take, last } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { AuthorizationService } from '../authorization.service';
import { TextTransformationService } from '../text-transformation.service';

import { DynamicDataSource } from '../dynamicDataSource.model';
import { DynamicDatabase } from '../dynamicDatabase.model';
import { VideoDetails } from '../VideoDetails.model';
import { Match } from '../match.model';
import { User } from '../user.model';
import { EventInVideo } from '../EventInVideo.model';
import { DynamicFlatNode } from '../dynamicFlatNode.model';
import { constants } from '../constants';

var player;

@Component({
  selector: 'app-match-display',
  templateUrl: './match-display.component.html',
  styleUrls: ['./match-display.component.scss']
})

export class MatchDisplayComponent extends BaseComponent implements OnInit {
  matchId : string;
  VideoDetails: VideoDetails;
  match: Observable<Match>;
  matchUrl: string;
  currentTime: string;
  playCount: number = 0;
  private loading: boolean = true;
  private moveName: string = null;
  private moveCategory: string = null;
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
  private matchAverageRating: number = 0;
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
      if(this.asssembleCheck()){
        self.tempMove = new EventInVideo(this.moveName, this.moveCategory, this.performer, this.recipient, this.startTime, this.endTime, this.points, this.matchId, this.submissionStatus, this.attemptStatus, this.userInDbId);
        this.handleSettingMoveNameStatuses(self.tempMove, this.moveName);
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
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      console.log("params changed");
      this.trackerService.youtubePlayerLoadedStatus.next(false);
      this.matchId = params['matchId'];
      if(this.matchId === "undefined"){
        this.router.navigate(['error']);
      }
      if(this.matchId){
        this.db.getVideoRemovedFlagStatus(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          status ? this.handleFlaggedAsRemoved(true) : this.handleFlaggedAsRemoved(false);
        });
        this.db.getInappropriateFlagStatus(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          status ? this.handleInappropriateFlagged(true) : this.handleInappropriateFlagged(false);
        });
        this.db.getMatchUrlFromMatchId(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchUrl =>{
          this.ytId = this.parseVideoUrl(matchUrl);
          if(this.player){
            this.player.loadVideoById(this.ytId, 0);
          }
        });
      }
      this.db.getAverageMatchRating(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(average =>{ //TODO place inside matchId params LEFT OFF HERE
        this.matchAverageRating = average;
      });
      this.db.getAverageAnnotationRating(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(average =>{ //TODO place inside matchId params LEFT OFF HERE
        this.annotationAverageRating = average;
      });
      this.trackerService.currentMatch.next(this.matchId);
      this.db.getMainAnnotatorOfMatch(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(mainAnnotator =>{
        if(mainAnnotator.annotatorUserId === this.userInDbId && !this.isAdmin){
          this.displayAnnotationRating = false;
        } else{
          this.displayAnnotationRating = true;
        }
      });
      this.db.getMatchFromNodeKey(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
        if(match){
          this.match = match;
          match.matchDeets.giStatus ? this.giStatus = "Gi" : this.giStatus = "Nogi";
          this.ytId = this.parseVideoUrl(match.matchDeets.videoUrl);

          this.trackerService.moveName.pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveName =>{
            this.selectedAnnotation = moveName;
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

  onRate($event:{oldValue:number, newValue:number, starRating:MatchDisplayComponent}) {
    let newRating = $event.newValue;
    if(this.userInDbId){
      this.db.addMatchRatingToUser(this.userInDbId, this.matchId, $event.newValue);
      this.db.addMatchRatingToMatch(this.userInDbId, this.matchId, $event.newValue);
    }else{
      this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
        this.db.getUserByUid(usr.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(uzr => {
          let userInDb: string = uzr.id;
          this.db.addMatchRatingToUser(userInDb, this.matchId, $event.newValue);
          this.db.addMatchRatingToMatch(userInDb, this.matchId, $event.newValue);
        });
      });
    }
  }

  onRateAnnotation($event:{oldValue:number, newValue:number, starRating:MatchDisplayComponent}) {
    let newRating = $event.newValue;
    if(this.userInDbId){
      console.log("userInDb already");
      this.db.addMatchAnnotationRatingToUser(this.userInDbId, this.matchId, $event.newValue);
      this.db.addMatchAnnotationRatingToMatch(this.userInDbId, this.matchId, $event.newValue);
      if($event.newValue > constants.numberOfStarsForAnAnnotationRatingToBeConsideredStrong){
        this.db.getMainAnnotatorOfMatch(this.matchId).pipe(take(1)).subscribe(majorityAnnotator =>{
          if(majorityAnnotator.annotatorUserId !== this.userInDbId){
            this.db.updateUserReputationPoints(majorityAnnotator.annotatorUserId, constants.numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating, "You annotated the majority of the moves in match " + this.matchId +".");
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
          this.db.addMatchAnnotationRatingToUser(userDbId, this.matchId, $event.newValue);
          this.db.addMatchAnnotationRatingToMatch(userDbId, this.matchId, $event.newValue);
          if($event.newValue > constants.numberOfStarsForAnAnnotationRatingToBeConsideredStrong){
            this.db.getMainAnnotatorOfMatch(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(majorityAnnotator =>{
              if(majorityAnnotator.annotatorUserId !== userDbId){
                this.db.updateUserReputationPoints(majorityAnnotator.annotatorUserId, constants.numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating, "You annotated the majority of the moves in match " + this.matchId +".");
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
      returnVal = ((this.tempMove.actor !== "Nobody") && (this.tempMove.recipient !== "Nobody") && (this.tempMove.points > -1) && (this.tempMove.moveName != null) && (this.tempMove.moveName !== "No Annotation Currently Selected") && (this.tempMove.moveCategory != null) && (this.tempMove.moveCategory != "No Category Currently Selected") && (this.tempMove.actor != null) && (this.tempMove.recipient != null) && (this.tempMove.timeInitiated > -1) && (this.tempMove.timeInitiated != null) && (this.tempMove.timeCompleted > -1) && (this.tempMove.timeCompleted != null) && (this.tempMove.points != null) && (this.tempMove.points > -1) && (this.tempMove.associatedMatchId != null) && (this.tempMove.isASubmission != null) && (this.tempMove.isSuccessfulAttempt != null) && (this.tempMove.annotatorUserId != null));
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
    if(this.moveName && this.moveName !=="No Annotation Currently Selected" && this.moveCategory && this.moveCategory !== "No Category Currently Selected" && this.performer && this.recipient && (this.startTime > -1) && (this.startTime != null) && (this.endTime > -1) && (this.endTime != null) && (this.points != null) && this.matchId && (this.submissionStatus != null) && (this.attemptStatus != null) && this.userInDbId){
      // console.log("everything is true in asssembleCheck");
      return true;
    } else{
      // console.log("asssembleCheck is false");
      return false;
    }
  }

  triggerNewAnnotationFetch(){
    this.trackerService.fetchNewAnnotations.next(true);
  }

  flagVideo(){
    if(this.matchId){
      this.db.getVideoRemovedFlagStatus(this.matchId).pipe(take(1)).subscribe(status =>{
        status ? this.db.flagVideoRemovedInMatch(this.matchId, false): this.db.flagVideoRemovedInMatch(this.matchId, true);
      });
    } else{
      // console.log("video has been flagged as removed, but matchId could not be found");
    }
  }

  flagVideoInappropriate(){
    if(this.matchId){
      console.log("flagVideoInappropriate entered and matchId exists");
      this.db.getInappropriateFlagStatus(this.matchId).pipe(take(1)).subscribe(status =>{
        console.log("status inside getInappropriateFlagStatus called and is " + status);
        status ? this.db.flagVideoInappropriateInMatch(this.matchId, false): this.db.flagVideoInappropriateInMatch(this.matchId, true);
      });
    } else{
      // console.log("video has been flagged as removed, but matchId could not be found");
    }
  }

  processMatchEntryInDatabase(){
    console.log("processMatchEntryInDatabase entered");
    let annotationMadeCounter: number = 0;
    this.db.addEventInVideoToMatchIfUniqueEnough(this.tempMove).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveUniqueEnough =>{
      console.log("addEventInVideoToMatchIfUniqueEnough entered");
      if(!moveUniqueEnough){
        if(annotationMadeCounter < 1){
          this.openSnackBar("Annotation has already been made by another user");
          annotationMadeCounter ++ ;
        }
        this.moveName = null;
        this.moveCategory = null;
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
            this.openSnackBar("Annotation Recorded");
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
    console.log("savePlayer entered");
    this.player = player;
    this.trackerService.youtubePlayerLoadedStatus.next(true);
    this.player.loadVideoById(this.ytId, 0);
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

  handleSettingMoveNameStatuses(move: EventInVideo, moveName: string){
    if(moveName === "Win"){
      move.setIsWin(true);
    }
    if(moveName == "Tie; Draw"){
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
    combineLatest([this.trackerService.moveName, this.trackerService.moveCategory, this.trackerService.performer, this.trackerService.recipient, this.trackerService.currentMatch, this.trackerService.submission, this.trackerService.attemptStatus]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      this.moveName = results[0];
      this.moveCategory = results[1];
      this.performer = results[2];
      this.recipient = results[3];
      this.matchId = results[4];
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
    this.moveName = null;
    this.moveCategory = null;
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
