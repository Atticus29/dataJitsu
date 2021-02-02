import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FlatTreeControl } from '@angular/cdk/tree';

import { Subject, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { takeUntil, take, last, withLatestFrom } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { FormQuestionBase } from '../formQuestionBase.model';
import { DatabaseService } from '../database.service';
import { QuestionControlService } from '../question-control.service';
import { TrackerService } from '../tracker.service';
import { FormProcessingService } from '../form-processing.service';
import { AuthorizationService } from '../authorization.service';
import { TextTransformationService } from '../text-transformation.service';
import { StarRatingColor } from '../star-rating/star-rating.component';
import { QuestionService } from '../question.service';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
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
  matchDetails: VideoDetails; //TODO rename
  match: Observable<Video>; //TODO rename
  videoUrl: string; //TODO rename
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
  private canEditVideo: boolean = false;
  private displayModeInd1: boolean = true;
  private displayModeInd2: boolean = true;
  private displayModeAgeClass: boolean = true;
  private displayModeWeightClass: boolean = true;
  private displayModeGiNogi: boolean = true;
  private displayModeTournamentName: boolean = true;
  private displayModeADate: boolean = true;
  private displayModeLocation: boolean = true;
  private displayModeRank: boolean = true;
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
  private localIndividualOneQuestion: FormQuestionBase<any>[] =  null;
  private localIndividualTwoQuestion: FormQuestionBase<any>[] = null;
  private localConfigOptionsInd1: DynamicFormConfiguration;
  private localConfigOptionsInd2: DynamicFormConfiguration;
  private localConfigOptionsAgeClass: DynamicFormConfiguration;
  private localConfigOptionsWeightClass: DynamicFormConfiguration;
  private localConfigOptionsGiNogi: DynamicFormConfiguration;
  private localConfigOptionsTournamentName: DynamicFormConfiguration;
  private localConfigOptionsDate: DynamicFormConfiguration;
  private localConfigOptionsLocation: DynamicFormConfiguration;
  private localConfigOptionsRank: DynamicFormConfiguration;
  private stopCounter: number = 0;

  // private originalPosterId: string = null;
  // private defaultUrl: string = "https://www.youtube.com/embed/"+constants.defaultVideoUrlCode +"?enablejsapi=1&html5=1&";
  // private shouldVideoResume: boolean = false;
  // private database: DynamicDatabase;

  constructor(private router: Router, private databaseService: DatabaseService, private route: ActivatedRoute, private trackerService:TrackerService, private authService: AuthorizationService, private database: DynamicDatabase, private textTransformationService: TextTransformationService, private questionService: QuestionService, public snackBar: MatSnackBar, private formProcessingService:FormProcessingService, private qcs:QuestionControlService) {
    super();
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, this.databaseService);
    this.dataSource.data = database.initialData();
  }

  ngOnInit() {
    this.handleFormUpdates();

    combineLatest([this.trackerService.youtubePlayerLoadedStatus, this.trackerService.currentUserBehaviorSubject]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(([videoLoadedStatus, user]) =>{
      if(videoLoadedStatus && this.player){
        this.player.loadVideoById({
          'videoId':this.ytId,
          'startSeconds': 0,
        });
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
        user.privileges.canEditVideo ? this.canEditVideo = true: this.canEditVideo = false;
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
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => { //this.route.params.pipe(take(1)).subscribe(params => {
      console.log("params changed");
      // debugger;
      this.trackerService.youtubePlayerLoadedStatus.next(false);
      this.videoId = params['videoId'];
      if(this.videoId === "undefined"){
        this.router.navigate(['error']);
      }
      if(this.videoId){
        console.log("videoId is: " + this.videoId);
        this.databaseService.getVideoRemovedFlagStatus(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          status ? this.handleFlaggedAsRemoved(true) : this.handleFlaggedAsRemoved(false);
        });
        this.databaseService.getInappropriateFlagStatus(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          status ? this.handleInappropriateFlagged(true) : this.handleInappropriateFlagged(false);
        });
        this.databaseService.getvideoUrlFromMatchId(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(videoUrl =>{
          this.videoUrl = videoUrl;
          this.ytId = this.parseVideoUrl(videoUrl);
          if(this.player){
            this.player.loadVideoById(this.ytId, 0); //TODO this must have broken something.... right?
          }
        });
      }
      this.databaseService.getAverageVideoRating(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(average =>{ //TODO place inside videoId params LEFT OFF HERE
        this.videoAverageRating = average;
      });
      this.databaseService.getAverageAnnotationRating(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(average =>{ //TODO place inside videoId params LEFT OFF HERE
        // console.log("got into getAverageAnnotationRating in match-display component. Average is:");
        // console.log (average);
        this.annotationAverageRating = average;
      });
      this.trackerService.currentMatch.next(this.videoId);
      this.databaseService.getMainAnnotatorOfMatch(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(mainAnnotator =>{
        if(mainAnnotator.annotatorUserId === this.userInDbId && !this.isAdmin){
          this.displayAnnotationRating = false;
        } else{
          this.displayAnnotationRating = true;
        }
      });
      this.databaseService.getMatchFromNodeKey(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
        // console.log("got here 0");
        // console.log("match is: ");
        // console.log(match);
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

          this.questionService.getIndividualOneEditQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((individualOneQuestion) =>{
            if(individualOneQuestion && match.videoDeets){
              if(match.videoDeets.athlete1Name){
                individualOneQuestion[0].value = match.videoDeets.athlete1Name;
              }
              // this.localIndividualOneQuestion = individualOneQuestion;
              this.localConfigOptionsInd1 = new DynamicFormConfiguration(individualOneQuestion, [], "Save");
              // this.formProcessingService.restartFormAndQuestions(individualOneQuestion);
            }

          });

          this.questionService.getIndividualTwoEditQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((individualTwoQuestion) =>{
            if(individualTwoQuestion && match.videoDeets){
              if(match.videoDeets.athlete2Name){
                individualTwoQuestion[0].value = match.videoDeets.athlete2Name;
              }
              // this.localIndividualOneQuestion = individualTwoQuestion;
              this.localConfigOptionsInd2 = new DynamicFormConfiguration(individualTwoQuestion, [], "Save");
              // this.formProcessingService.restartFormAndQuestions(individualTwoQuestion);
            }

          });

          this.questionService.getEditAgeClassQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((ageClassQuestion) =>{
            if(ageClassQuestion && match.videoDeets){
              if(match.videoDeets.ageClass){
                ageClassQuestion[0].value = match.videoDeets.ageClass;
              }
              this.localConfigOptionsAgeClass = new DynamicFormConfiguration(ageClassQuestion, [], "Save");
            }
          });

          this.questionService.getEditWeightQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((weightClassQuestion) =>{
            if(weightClassQuestion && match.videoDeets){
              if(match.videoDeets.weightClass){
                weightClassQuestion[0].value = match.videoDeets.weightClass;
              }
              this.localConfigOptionsWeightClass = new DynamicFormConfiguration(weightClassQuestion, [], "Save");
            }
          });

          this.questionService.getEditGiNogiQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((giNogiQuestion) =>{
            if(giNogiQuestion && match.videoDeets){
              console.log("typeof match.videoDeets.giStatus is: " + typeof match.videoDeets.giStatus);
              if(typeof match.videoDeets.giStatus === "boolean" && match.videoDeets.giStatus){
                giNogiQuestion[0].value = "Gi";
              }
              if(typeof match.videoDeets.giStatus === "boolean" && !match.videoDeets.giStatus){
                giNogiQuestion[0].value = "No Gi";
              }
              this.localConfigOptionsGiNogi = new DynamicFormConfiguration(giNogiQuestion, [], "Save");
            }
          });

          this.questionService.getEditTournamentNameQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((tournamentNameQuestion) =>{
            if(tournamentNameQuestion && match.videoDeets){
              if(match.videoDeets.tournamentName){
                tournamentNameQuestion[0].value = match.videoDeets.tournamentName;
              }
              this.localConfigOptionsTournamentName = new DynamicFormConfiguration(tournamentNameQuestion, [], "Save");
            }
          });

          this.questionService.getEditDateQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((dateQuestion) =>{
            if(dateQuestion && match.videoDeets){
              if(match.videoDeets.date){
                dateQuestion[0].value = match.videoDeets.date;
              }
              this.localConfigOptionsDate = new DynamicFormConfiguration(dateQuestion, [], "Save");
            }
          });

          this.questionService.getEditLocationQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((locationQuestion) =>{
            if(locationQuestion && match.videoDeets){
              if(match.videoDeets.location){
                locationQuestion[0].value = match.videoDeets.location;
              }
              this.localConfigOptionsLocation = new DynamicFormConfiguration(locationQuestion, [], "Save");
            }
          });

          this.questionService.getEditRankQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((rankQuestion) =>{
            if(rankQuestion && match.videoDeets){
              if(match.videoDeets.rank){
                rankQuestion[0].value = match.videoDeets.rank;
              }
              this.localConfigOptionsRank = new DynamicFormConfiguration(rankQuestion, [], "Save");
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
      this.databaseService.addMatchRatingToUser(this.userInDbId, this.videoId, newRating);
      this.databaseService.addMatchRatingToMatch(this.userInDbId, this.videoId, newRating);
    }else{
      this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
        this.databaseService.getUserByUid(usr.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(uzr => {
          let userInDb: string = uzr.id;
          this.databaseService.addMatchRatingToUser(userInDb, this.videoId, newRating);
          this.databaseService.addMatchRatingToMatch(userInDb, this.videoId, newRating);
        });
      });
    }
  }

  onRateAnnotation($event) {//:{oldValue:number, newValue:number, starRating:VideoDisplayComponent}
    let newRating = $event;
    if(this.userInDbId){
      this.databaseService.addMatchAnnotationRatingToUser(this.userInDbId, this.videoId, newRating);
      this.databaseService.addMatchAnnotationRatingToMatch(this.userInDbId, this.videoId, newRating);
      if($event.newValue > constants.numberOfStarsForAnAnnotationRatingToBeConsideredStrong){
        this.databaseService.getMainAnnotatorOfMatch(this.videoId).pipe(take(1)).subscribe(majorityAnnotator =>{
          if(majorityAnnotator.annotatorUserId !== this.userInDbId){
            this.databaseService.updateUserReputationPoints(majorityAnnotator.annotatorUserId, constants.numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating, "You annotated the majority of the moves in match " + this.videoId +".");
          }
          if(majorityAnnotator.annotatorUserId === this.userInDbId){
            console.log("bish just upvoted their own shit");
          }
        });
      }
    }else{
      this.trackerService.currentUserBehaviorSubject.pipe(take(1)).subscribe(usr =>{
        console.log(usr);
        this.databaseService.getUserByUid(usr.uid).pipe(take(1)).subscribe(result => {
          let userDbId: string = result.id;
          this.databaseService.addMatchAnnotationRatingToUser(userDbId, this.videoId, newRating);
          this.databaseService.addMatchAnnotationRatingToMatch(userDbId, this.videoId, newRating);
          if($event.newValue > constants.numberOfStarsForAnAnnotationRatingToBeConsideredStrong){
            this.databaseService.getMainAnnotatorOfMatch(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(majorityAnnotator =>{
              if(majorityAnnotator.annotatorUserId !== userDbId){
                this.databaseService.updateUserReputationPoints(majorityAnnotator.annotatorUserId, constants.numberOfPointsToAwardForBeingMajorityAnnotatorOfAGoodAnnotationRating, "You annotated the majority of the moves in match " + this.videoId +".");
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
    // console.log("results from parseVideoUrl:");
    // console.log(result);
    return result[1]; //+"?controls=0";
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
      this.databaseService.getVideoRemovedFlagStatus(this.videoId).pipe(take(1)).subscribe(status =>{
        status ? this.databaseService.flagVideoRemovedInMatch(this.videoId, false): this.databaseService.flagVideoRemovedInMatch(this.videoId, true);
      });
    } else{
      // console.log("video has been flagged as removed, but videoId could not be found");
    }
  }

  flagVideoInappropriate(){
    if(this.videoId){
      console.log("flagVideoInappropriate entered and videoId exists");
      this.databaseService.getInappropriateFlagStatus(this.videoId).pipe(take(1)).subscribe(status =>{
        console.log("status inside getInappropriateFlagStatus called and is " + status);
        status ? this.databaseService.flagVideoInappropriateInMatch(this.videoId, false): this.databaseService.flagVideoInappropriateInMatch(this.videoId, true);
      });
    } else{
      // console.log("video has been flagged as removed, but videoId could not be found");
    }
  }

  processMatchEntryInDatabase(){
    console.log("processMatchEntryInDatabase entered");
    let annotationMadeCounter: number = 0;
    this.databaseService.addEventInVideoToVideoIfUniqueEnough(this.tempMove).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveUniqueEnough =>{
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
        this.databaseService.addEventInVideoToUserIfUniqueEnough(this.tempMove, this.userInDbId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveUniqueEnoughInUser =>{
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
    console.log("player is:");
    console.log(player);
    // console.log("got here 1");
    // this.player = new window['YT'].Player('video', {
    //   height: '195',
    //   width: '320',
    //   playerVars: {
    //    playsinline: '1',
    //    controls: '0'
    //   }
    // });
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

  toggleEditInd1(){
    console.log("toggleEditInd1 entered");
    this.stopCounter = 0;
    this.questionService.getIndividualOneEditQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((individualOneQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(individualOneQuestion);
      // this.formProcessingService.actualForm.next(this.qcs.toFormGroup(individualOneQuestion));
      // this.databaseService.getMatchFromNodeKey(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
      //   if(individualOneQuestion && match.videoDeets){
      //     if(match.videoDeets.athlete1Name){
      //       individualOneQuestion[0].value = match.videoDeets.athlete1Name;
      //     }
      //     this.localIndividualOneQuestion = individualOneQuestion;
      //     this.localConfigOptions = new DynamicFormConfiguration(individualOneQuestion, [], "Save");
      //   }
      // });

    });
    this.displayModeInd1 = false;
  }

  toggleEditInd2(){
    this.stopCounter = 0;
    // console.log("toggleEditInd2 entered");
    this.questionService.getIndividualTwoEditQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((individualTwoQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(individualTwoQuestion);
    //   console.log("got here 1 and this.videoId is: " + this.videoId);
    //   this.databaseService.getMatchFromNodeKey(this.videoId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
    //     console.log("got here 2");
    //     if(individualTwoQuestion && match.videoDeets){
    //       this.localConfigOptions = new DynamicFormConfiguration(individualTwoQuestion, [], "Save");
    //       console.log("got here 3");
    //       if(match.videoDeets.athlete2Name){
    //         console.log("got here 4");
    //         individualTwoQuestion[0].value = match.videoDeets.athlete2Name;
    //         console.log("got here 5");
    //         // this.formProcessingService.restartFormAndQuestions(individualTwoQuestion);
    //       }
    //       this.localIndividualTwoQuestion = individualTwoQuestion;
    //       console.log("got here 6");
    //       this.localConfigOptions = new DynamicFormConfiguration(individualTwoQuestion, [], "Save");
    //       console.log("got here 7");
    //       // this.formProcessingService.restartFormAndQuestions(individualOneQuestion);
    //       console.log("got here 8");
    //     }
    //   });

    });
    this.displayModeInd2 = false;
  }

  toggleEditAgeClass(){
    this.stopCounter = 0;
    this.questionService.getEditAgeClassQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((ageClassQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(ageClassQuestion);
    });
    this.displayModeAgeClass = false;
  }

  toggleEditWeightClass(){
    this.stopCounter = 0;
    this.questionService.getEditWeightQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((weightClassQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(weightClassQuestion);
    });
    this.displayModeWeightClass = false;
  }

  toggleEditGiNogi(){
    this.stopCounter = 0;
    this.questionService.getEditGiNogiQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((giNogiQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(giNogiQuestion);
    });
    this.displayModeGiNogi = false;
  }

  toggleEditTournamentName(){
    this.stopCounter = 0;
    this.questionService.getEditTournamentNameQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((tournamentNameQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(tournamentNameQuestion);
    });
    this.displayModeTournamentName = false;
  }

  toggleEditDate(){
    this.stopCounter = 0;
    this.questionService.getEditDateQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((dateQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(dateQuestion);
    });
    this.displayModeADate = false;
  }

  toggleEditLocation(){
    this.stopCounter = 0;
    this.questionService.getEditLocationQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((locationQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(locationQuestion);
    });
    this.displayModeLocation = false;
  }

  toggleEditRank(){
    this.stopCounter = 0;
    this.questionService.getEditRankQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((rankQuestion) =>{
      this.formProcessingService.captureQuestionArrayOfCurrentForm(rankQuestion);
    });
    this.displayModeRank = false;
  }

  handleFormUpdates(){
    //when form is submitted --------------------
    let self = this;
        this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
          console.log("form submitted monitoring in video-display firing off");
          console.log("isFormSubmitted is: " + isFormSubmitted);
          if(isFormSubmitted && this.stopCounter<1){
                this.stopCounter ++;
                console.log("form is submitted and stop counter less than one");
                let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
                formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
                  let formResults = combinedResults[0];
                  console.log("formResults are:");
                  console.log(formResults);
                  let currentFormQuestions = combinedResults[1];
                  if(formResults){ //formSubmitted &&
                    if(formResults[0] !== "Stop"){
                      //begin custom stuff
                      console.log("formResults are: ");
                      console.log(formResults);
                        if(currentFormQuestions){
                          if(currentFormQuestions[0] !== "Stop"){
                                if(this.userInDbId && this.videoId){
                                  let path = null;
                                  let updateVal = null;
                                  if(formResults.individualOneUpdate){
                                    console.log("formResults.individualOneUpdate exists...");
                                    path = '/videoDeets/athlete1Name';
                                    updateVal = formResults.individualOneUpdate;
                                  }
                                  if(formResults.individualTwoUpdate){
                                    console.log("formResults.individualTwoUpdate exists...");
                                    path = '/videoDeets/athlete2Name';
                                    updateVal = formResults.individualTwoUpdate;
                                  }
                                  //TODO check if entry already exists in any lists!!
                                  if(path && updateVal){
                                    console.log("currentFormQuestions right before entering updateVideoDeet is:");
                                    console.log(currentFormQuestions);
                                    this.databaseService.updateVideoDeet(currentFormQuestions[0], '/videos/'+this.videoId+path, updateVal, this.videoId, this.videoUrl, this.userInDbId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(additionStatus =>{ //currentFormQuestions[0] assumes all of the update content on this page are single-question arrays
                                      console.log("additionStatus is: " + additionStatus);
                                      if(additionStatus){
                                        self.openSnackBar(constants.videoDeetUpdatedNotification);
                                        // self.formProcessingService.collectionId.next(null);
                                        self.formProcessingService.stopFormAndQuestions();
                                        self.formProcessingService.finalSubmitButtonClicked.next(true);
                                        self.formProcessingService.restartFormAndQuestions(self.questionService.getIndividualOneEditQuestionAsObj());
                                        self.stopCounter = 0;
                                        this.hideEditAndShowNewValue(formResults);
                                        // self.displayModeInd1 = !self.displayModeInd1;
                                      }else{
                                        self.openSnackBar(constants.videoDeetUpdateFailureNotification);
                                        this.hideEditAndShowNewValue(formResults);
                                        // self.displayModeInd1 = !self.displayModeInd1;
                                      }
                                    });
                                  }
                                }
                          }
                        }
                    }
                  }
                });
              }
        });
        //----end form submission doing things
  }

  hideEditAndShowNewValue(formResults:any){
    if(formResults && formResults.individualOneUpdate){
      this.displayModeInd1 = true;
    }
    if(formResults && formResults.individualTwoUpdate){
      this.displayModeInd2 = true;
    }

  }

}
