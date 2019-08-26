import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';

import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, take, last } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { AuthorizationService } from '../authorization.service';

import { DynamicDataSource } from '../dynamicDataSource.model';
import { DynamicDatabase } from '../dynamicDatabase.model';
import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { User } from '../user.model';
import { MoveInVideo } from '../moveInVideo.model';
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
  matchDetails: MatchDetails;
  match: Observable<Match>;
  matchUrl: string;
  currentTime: string;
  playCount: number = 0;
  private moveName: string = null;
  private performer: string = null;
  private recipient: string = null;
  private startTime: number = null;
  private endTime: number = null;
  private points: number = null;
  private submissionStatus: boolean = null;
  private attemptStatus: boolean = null;
  // private userInDb: any = null; //TODO update for accuracy
  private trigger: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private userInDbId: string = null;

  private annotationFinishButtonDisabled: boolean = true;
  // player: any;
  // private ngUnsubscribe: Subject<void> = new Subject<void>();
  private shouldVideoResume: boolean = false;
  private selectedAnnotation: string = "No Annotation Currently Selected";
  private moveAssembledStatus: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private tempMove: MoveInVideo;
  private dataSource: DynamicDataSource;
  private treeControl: FlatTreeControl<DynamicFlatNode>;
  getLevel = (node: DynamicFlatNode) => node.level;
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  private matchAverageRating: number = 0;
  private annotationAverageRating: number = 0;
  private giStatus: string = "Fetching...";
  // private database: DynamicDatabase;

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute, public snackBar: MatSnackBar, private trackerService:TrackerService, private authService: AuthorizationService, private database: DynamicDatabase) {
    super();
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, this.db);
    this.dataSource.data = database.initialData();
  }

  // ngOnDestroy(){
  //   this.ngUnsubscribe.next();
  //   this.ngUnsubscribe.complete();
  // }

  ngOnInit() {
    this.trigger.pipe(takeUntil(this.ngUnsubscribe)).subscribe(triggerCheck => {
      console.log("trigger check called");
      if(this.asssembleCheck()){
        console.log("assemble check true in trigger observable");
        self.tempMove = new MoveInVideo(this.moveName, this.performer, this.recipient, this.startTime, this.endTime, this.points, this.matchId, this.submissionStatus, this.attemptStatus, this.userInDbId);
        self.moveAssembledStatus.next(true);
      } else{
        //Do nothing
      }
    });
    let self = this;
    this.trackerService.annotationBegun.subscribe(status =>{
      if(status){
        this.annotationFinishButtonDisabled = false;
      }
      if(status == false){
        this.annotationFinishButtonDisabled = true;
      }
    });
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.matchId = params['matchId'];
      if(this.matchId === "undefined"){
        this.router.navigate(['error']);
      }
      // console.log("matchID is: " + this.matchId);
      this.db.getAverageMatchRating(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(average =>{ //TODO place inside matchId params LEFT OFF HERE
        this.matchAverageRating = average;
      });
      this.db.getAverageAnnotationRating(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(average =>{ //TODO place inside matchId params LEFT OFF HERE
        this.annotationAverageRating = average;
      })
      this.trackerService.currentMatch.next(this.matchId);
      this.db.getMatchFromNodeKey(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
        // console.log("getMatchFromNodeKey called and returned: ");
        // console.log(match);
        this.match = match;
        // console.log(match.matchDeets.giStatus);
        if(match.matchDeets.giStatus){
          this.giStatus = "Gi";
        } else{
          this.giStatus = "Nogi";
        }
        this.matchUrl = "https://www.youtube.com/embed/" + this.parseVideoUrl(match.matchDeets.videoUrl) + "?enablejsapi=1&html5=1&";
        // console.log("matchUrl is: " + this.matchUrl);
        document.getElementById('videoIframe').setAttribute("src", this.matchUrl);
        window['onYouTubeIframeAPIReady'] = function() {
          player = new window['YT'].Player('videoIframe', {
            events: {
              'onReady': onPlayerReady,
              // 'onStateChange': onPlayerStateChange
            }
          });
        }

        this.trackerService.moveName.subscribe(moveName =>{
          this.selectedAnnotation = moveName;
        })

        this.trackerService.videoResumeStatus.subscribe(videoResumeStatus =>{
          if(videoResumeStatus){
            player.playVideo();
          }
        });

        let onPlayerReady = (event) => {
          document.getElementById("play").addEventListener("click", function() {
            player.playVideo();
            // console.log("you clicked play");
          });
          let pause = document.getElementById("begin-move").addEventListener("click", function() {
            //TODO add 1 second rewind?
            player.pauseVideo();
            // self.dataSource.data = self.database.initialData();
            // console.log("pause beginning of move");
            let currentTime = player.getCurrentTime();
            self.trackerService.startTimePoint.next(player.getCurrentTime());
            //TODO reset the tree and the submission status (and the annotation move just to be safe?)
          });
          document.getElementById("end-move").addEventListener("click", function() {
            player.pauseVideo();
            let endMoveClickCounter = 0;
            let currentTime = player.getCurrentTime();
            self.trackerService.endTimePoint.next(player.getCurrentTime());
            self.trackerService.startTimePoint.pipe(takeUntil(self.ngUnsubscribe)).subscribe(startTime =>{
              console.log("startTime in trackerService is " + startTime);
              self.startTime = startTime;
              self.trigger.next(true);
            });
            self.trackerService.endTimePoint.pipe(takeUntil(self.ngUnsubscribe)).subscribe(endTime =>{
              console.log("endTime in trackerService is " + endTime);
              self.endTime = endTime;
              self.trigger.next(true);
            });
            self.trackerService.moveName.pipe(takeUntil(self.ngUnsubscribe)).subscribe(moveName =>{
              console.log("moveName in trackerService is " + moveName);
              self.moveName = moveName;
              self.trigger.next(true);
            });
            self.trackerService.performer.pipe(takeUntil(self.ngUnsubscribe)).subscribe(performer =>{
              console.log("performer in trackerService is " + performer);
              self.performer = performer;
              self.trigger.next(true);
            });
            self.trackerService.recipient.pipe(takeUntil(self.ngUnsubscribe)).subscribe(recipient =>{
              console.log("recipient in trackerService is " + recipient);
              self.recipient = recipient;
              self.trigger.next(true);
            });
            self.trackerService.points.pipe(takeUntil(self.ngUnsubscribe)).subscribe(points =>{
              console.log("points in trackerService is " + points);
              self.points = points;
              self.trigger.next(true);
            });
            self.trackerService.currentMatch.pipe(takeUntil(self.ngUnsubscribe)).subscribe(matchId =>{
              console.log("matchId in trackerService is " + matchId);
              self.matchId = matchId;
              self.trigger.next(true);
            });
            self.trackerService.submission.pipe(takeUntil(self.ngUnsubscribe)).subscribe(submission =>{
              console.log("submission in trackerService is " + submission);
              submission === "Yes" ? self.submissionStatus = true: self.submissionStatus = false;
              self.trigger.next(true);
            });
            self.trackerService.attemptStatus.pipe(takeUntil(self.ngUnsubscribe)).subscribe(attemptSuccessful =>{
              console.log("attemptSuccessful in trackerService is " + attemptSuccessful);
              attemptSuccessful === "Yes" ? self.attemptStatus = true: self.attemptStatus = false;
              self.trigger.next(true);
            });
            self.trackerService.currentUserBehaviorSubject.pipe(take(1)).subscribe(user =>{
              console.log("user in trackerService is:");
              console.log(user);
              // console.log("this should happen just once?");
              self.db.getUserByUid(user.uid).pipe(take(1)).subscribe(usr => {
                usr ? self.userInDbId = usr.id : self.userInDbId = null;
                console.log("self.userInDbId in trackerService subsearch for getUserByUid is " + self.userInDbId);
                self.trigger.next(true);
              });
            });
            self.moveAssembledStatus.subscribe(status =>{
              if(status && self.moveCompletelyLegit()){
                player.playVideo();
                player.seekTo(Math.max(0.5,currentTime-7));
              }
            });
          });

          document.getElementById("pause-vid").addEventListener("click", function() {
            player.pauseVideo();
          });

          this.trackerService.desiredJumpStartTime.pipe(takeUntil(this.ngUnsubscribe)).subscribe(localDesiredJumpStartTime =>{
            // console.log("trackerService.desiredJumpStartTime in match display entered");
            // console.log(localDesiredJumpStartTime);
            if(localDesiredJumpStartTime){
              // console.log("trackerService.desiredJumpStartTime in match display entered");
              // console.log(Number(localDesiredJumpStartTime)); //-0.5
              // console.log(Number(localDesiredJumpStartTime)-0.5); //-0.5
              // console.log(Math.max(0.5,Number(localDesiredJumpStartTime)-0.5));
              player.playVideo();
              player.seekTo(Math.max(0.5,localDesiredJumpStartTime-0.5));
            }
          });
        }

        function onPlayerStateChange(event){
          if (event.data == window['YT'].PlayerState.PAUSED) {
            //public moveID, moveName, actor, recipient(can be inferred), timeInitiated, timeCompleted, points, associatedMatchDetailsId, isASubmission
          };
          if(event.data==window['YT'].PlayerState.PLAYING){
            self.playCount = self.playCount + 1;
          }
          if (event.data == window['YT'].PlayerState.PLAYING && self.playCount >= 1) {
            //public moveID, moveName, actor, recipient(can be inferred), timeInitiated, timeCompleted, points, associatedMatchDetailsId, isASubmission
          }
        }

        if (!window['YT']){
          var tag = document.createElement('script');
          tag.src = "//www.youtube.com/player_api";
          var firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      });
    });

    this.moveAssembledStatus.subscribe(status =>{
      console.log("entered moveAssembledStatus subscription");
      if(status && this.moveCompletelyLegit()){
        console.log("move assembled and completely legit");
        let annotationMadeCounter: number = 0;
        self.db.addMoveInVideoToMatchIfUniqueEnough(this.tempMove).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchUniqueEnough =>{
          if(!matchUniqueEnough){
            console.log("match not Unique Enough");
            if(annotationMadeCounter < 1){
              this.snackBar.open("Annotation has already been made by another user");
            }
            self.moveName = null;
            self.performer = null;
            self.recipient = null;
            self.startTime = null;
            self.endTime = null;
            self.points = null;
            self.submissionStatus = null;
            self.trackerService.resetAllExceptCurrentMatch();
            // self.tempMove = new MoveInVideo("No Annotation Currently Selected", "Nobody", "Nobody", -1, -1, -1, null, null, null, null);
            self.moveAssembledStatus.next(false);
            // self.ngUnsubscribe.next();
            // self.ngUnsubscribe.complete();
          } else{
            console.log("match IS Unique Enough in match");
            //------------------------------------------
            self.db.addMoveInVideoToUserIfUniqueEnough(self.tempMove, this.userInDbId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchUniqueEnoughInUser =>{
              if(matchUniqueEnoughInUser){
                console.log("match IS Unique Enough in user");
                console.log("annotationMadeCounter in match is unique enough in user " + annotationMadeCounter);
                annotationMadeCounter ++;
                self.moveName = null;
                self.performer = null;
                self.recipient = null;
                self.startTime = null;
                self.endTime = null;
                self.points = null;
                self.submissionStatus = null;
                self.trackerService.resetAllExceptCurrentMatch();
                // self.tempMove = new MoveInVideo("No Annotation Currently Selected", "Nobody", "Nobody", -1, -1, -1, null, null, null, null);
                self.moveAssembledStatus.next(false);
                // self.ngUnsubscribe.next();
                // self.ngUnsubscribe.complete();

                //-------------------------------------

                //-------------------------------------
              }else{
                console.log("matchUniqueEnoughInUser is false, but doing nothing about it...");
                self.moveName = null;
                self.performer = null;
                self.recipient = null;
                self.startTime = null;
                self.endTime = null;
                self.points = null;
                self.submissionStatus = null;
                self.trackerService.resetAllExceptCurrentMatch();
                // self.tempMove = new MoveInVideo("No Annotation Currently Selected", "Nobody", "Nobody", -1, -1, -1, null, null, null, null);
                self.moveAssembledStatus.next(false);
                // self.ngUnsubscribe.next();
                // self.ngUnsubscribe.complete();
              }
            });
            //----------------------------------------------

            // this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
            //   if(usr){
            //     if(!this.userInDbId){
            //       console.log("this.userInDbId did not yet exist"); //TODO I'm guessing this never happens
            //       this.db.getUserByUid(usr.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
            //         console.log("getUserByUid in tracker service; adding user id to this.userInDbId");
            //         this.userInDbId = usr.id;
            //         });
            //     } else{
            //       console.log("this.userInDbId exists and is " + this.userInDbId);
            //       // self.db.addMoveInVideoToUserIfUniqueEnough(self.tempMove, this.userInDbId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchUniqueEnoughInUser =>{
            //       //   if(matchUniqueEnoughInUser){
            //       //     self.openSnackBar("Annotation Recorded");
            //       //     self.trackerService.resetAllExceptCurrentMatch();
            //       //     // self.trigger.next(true);
            //       //     self.tempMove = null;
            //       //     self.moveAssembledStatus.next(false);
            //       //   }else{
            //       //     console.log("matchUniqueEnoughInUser is false, but doing nothing about it...");
            //       //   }
            //       // });
            //     }
            //   }
            // });
          }
        });
        this.moveAssembledStatus.next(false);
        // self.trackerService.resetAllExceptCurrentMatch();
        self.moveName = null;
        self.performer = null;
        self.recipient = null;
        self.startTime = null;
        self.endTime = null;
        self.points = null;
        self.submissionStatus = null;
        self.dataSource.dataChange.next(self.database.initialData());
        let flatNodeArray: DynamicFlatNode[] = new Array<DynamicFlatNode>();
        constants.rootNodes.forEach(rootNode =>{ //headers
          let newDynamicFlatNode = new DynamicFlatNode(rootNode, 0, true, false);
          flatNodeArray.push(newDynamicFlatNode);
        });
        self.dataSource.dataChange.next(flatNodeArray);
      } else{
        console.log("either status is false or moveCompletelyLegit is false");
        //Nothing
      }
    });
  }

  onRate($event:{oldValue:number, newValue:number, starRating:MatchDisplayComponent}) {
    let newRating = $event.newValue;
    this.trackerService.currentUserBehaviorSubject.subscribe(usr =>{
      this.db.getUserByUid(usr.uid).pipe(take(1)).subscribe(urs => {
        // usr = usr[Object.keys(usr)[0]];
        let userInDb: string = urs.id;
        this.db.addMatchRatingToUser(userInDb, this.matchId, $event.newValue);
        this.db.addMatchRatingToMatch(userInDb, this.matchId, $event.newValue);
        });
    });
  }

  onRateAnnotation($event:{oldValue:number, newValue:number, starRating:MatchDisplayComponent}) {
    let newRating = $event.newValue;
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
      this.db.getUserByUid(usr.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        // result = result[Object.keys(result)[0]];
        let userDbId: string = result.id;
        // console.log("userDbId is: "+ userDbId);
        this.db.addMatchAnnotationRatingToUser(userDbId, this.matchId, $event.newValue);
        this.db.addMatchAnnotationRatingToMatch(userDbId, this.matchId, $event.newValue);
        if($event.newValue > 4){
          this.db.getMainAnnotatorOfMatch(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(majorityAnnotator =>{
            if(majorityAnnotator.annotatorUserId !== userDbId){
              this.db.updateUserReputationPoints(majorityAnnotator.annotatorUserId, 5);
            }
            if(majorityAnnotator.annotatorUserId === userDbId){
              console.log("bish just upvoted their own shit");
            }
          });
        }
        });
    });
  }

  moveCompletelyLegit(): boolean{
    let returnVal = false;
    try {
      returnVal = ((this.tempMove.actor !== "Nobody") && (this.tempMove.recipient !== "Nobody") && (this.tempMove.points > -1) && (this.tempMove.moveName != null) && (this.tempMove.moveName !== "No Annotation Currently Selected") && (this.tempMove.actor != null) && (this.tempMove.recipient != null) && (this.tempMove.timeInitiated > -1) && (this.tempMove.timeInitiated != null) && (this.tempMove.timeCompleted > -1) && (this.tempMove.timeCompleted != null) && (this.tempMove.points != null) && (this.tempMove.points > -1) && (this.tempMove.associatedMatchId != null) && (this.tempMove.isASubmission != null) && (this.tempMove.isSuccessfulAttempt != null) && (this.tempMove.annotatorUserId != null));
    }
    catch(err) {
      returnVal = false;
    }
    return returnVal;
  }
  parseVideoUrl(url: string){ //@TODO seems hacky
    var re = /.*youtu.+?be\/(.+)/ig;
    var result = re.exec(url);
    return result[1];
  }

  onMoveSelected(moveSelected: MoveInVideo){
    // console.log(moveSelected);
    player.playVideo();
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }

  asssembleCheck(): Boolean{
   console.log("check made in asssembleCheck");
   // console.log(this.moveName);
   // console.log(this.performer);
   // console.log(this.recipient);
   // console.log(this.startTime);
   // console.log(this.endTime);
   // console.log(this.points);
   // console.log(this.matchId);
   // console.log(this.submissionStatus != null);
   // console.log(this.attemptStatus != null);
   // console.log(this.userInDbId);
    if(this.moveName && this.moveName !=="No Annotation Currently Selected" && this.performer && this.recipient && (this.startTime > -1) && (this.startTime != null) && (this.endTime > -1) && (this.endTime != null) && (this.points != null) && this.matchId && (this.submissionStatus != null) && (this.attemptStatus != null) && this.userInDbId){
      console.log("everything is true in asssembleCheck");
      return true;
    } else{
      console.log("asssembleCheck is false");
      return false;
    }
  }
}
