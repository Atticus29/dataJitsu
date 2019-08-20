import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { FlatTreeControl } from '@angular/cdk/tree';

import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, take, last } from 'rxjs/operators';

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

export class MatchDisplayComponent implements OnInit {
  matchId : string;
  matchDetails: MatchDetails;
  match: Observable<Match>;
  matchUrl: string;
  currentTime: string;
  playCount: number = 0;
  private annotationFinishButtonDisabled: boolean = true;
  // player: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
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
  // private database: DynamicDatabase;

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute, public snackBar: MatSnackBar, private trackerService:TrackerService, private authService: AuthorizationService, private database: DynamicDatabase) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, this.db);
    this.dataSource.data = database.initialData();
  }

  ngOnDestroy(){
    console.log("ngOnDestroy in match-display entered");

  }

  ngOnInit() {
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
            let currentTime = player.getCurrentTime();
            self.trackerService.endTimePoint.next(player.getCurrentTime());
            // self.finishAnnotation(currentTime);
            self.openSnackBar("Move Recorded");
            self.trackerService.startTimePoint.pipe(take(1)).subscribe(startTime =>{
              self.trackerService.endTimePoint.pipe(take(1)).subscribe(endTime =>{
                self.trackerService.moveName.pipe(take(1)).subscribe(moveName =>{
                  self.trackerService.performer.pipe(take(1)).subscribe(performer =>{
                    self.trackerService.recipient.pipe(take(1)).subscribe(recipient =>{
                      self.trackerService.points.pipe(take(1)).subscribe(points =>{
                        self.trackerService.currentMatch.pipe(take(1)).subscribe(matchId =>{
                          self.trackerService.submission.pipe(take(1)).subscribe(submission =>{
                            self.trackerService.attemptStatus.pipe(take(1)).subscribe(attemptSuccessful =>{
                              self.trackerService.currentUserBehaviorSubject.pipe(take(1)).subscribe((user) =>{
                                self.db.getUserByUid(user.uid).pipe(take(1)).subscribe(usr => {
                                  if(usr){
                                    let userInDb: string = usr.id;
                                    let attemptStatus: boolean = true;
                                    if(attemptSuccessful === false){
                                      attemptStatus = false
                                    }
                                    let submissionStatus: boolean = false;
                                    if(submission === "Yes"){
                                      submissionStatus = true;
                                    }
                                    self.tempMove = new MoveInVideo(moveName, performer, recipient, startTime, endTime, points, matchId, submissionStatus, attemptStatus, userInDb); //TODO update this once you add performers
                                    self.moveAssembledStatus.next(true);
                                  }
                                });
                              });
                            });
                          });
                        });
                      })
                    });
                  });
                });
              });
            });
            console.log("playing and going back a little?");
            console.log(currentTime);
            console.log(Math.max(0.5,currentTime-5));
            //TODO add 1 second delay?
            // player.resumeVideo();
            player.playVideo();
            player.seekTo(Math.max(0.5,currentTime-5));
          });

          document.getElementById("pause-vid").addEventListener("click", function() {
            player.pauseVideo();
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
      if(status && this.moveCompletelyLegit()){
        self.db.addMoveInVideoToMatch(this.tempMove).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchUniqueEnough =>{
          if(!matchUniqueEnough){
            this.snackBar.open("Annotation has already been made by another user");
          } else{
            this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
              if(usr){
                this.db.getUserByUid(usr.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
                  let userInDb: string = usr.id;
                  self.db.addMoveInVideoToUser(self.tempMove, userInDb);
                  // self.db.addMoveInVideoToMatch(self.tempMove);
                });
              }
            });
          }
        })
        this.moveAssembledStatus.next(false);
        self.trackerService.resetAllExceptCurrentMatch();
        self.dataSource.dataChange.next(self.database.initialData());
        let flatNodeArray: DynamicFlatNode[] = new Array<DynamicFlatNode>();
        constants.rootNodes.forEach(rootNode =>{ //headers
          let newDynamicFlatNode = new DynamicFlatNode(rootNode, 0, true, false);
          flatNodeArray.push(newDynamicFlatNode);
        });
        self.dataSource.dataChange.next(flatNodeArray);
      } else{
        //Nothing
      }
    });
  }

  onRate($event:{oldValue:number, newValue:number, starRating:MatchDisplayComponent}) {
    let newRating = $event.newValue;
    this.trackerService.currentUserBehaviorSubject.subscribe(usr =>{
      this.db.getUserByUid(usr.uid).pipe(take(1)).subscribe(urs => {
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
        let userDbId: string = result.id;
        console.log("userDbId is: "+ userDbId);
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
      returnVal = (this.tempMove.actor !== "Nobody" && this.tempMove.recipient !== "Nobody" && this.tempMove.points > -1);
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


}
