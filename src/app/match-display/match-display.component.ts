import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {MatSnackBar} from '@angular/material';

import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';

import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';

import { BehaviorSubject } from 'rxjs';

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

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute, public snackBar: MatSnackBar, private trackerService:TrackerService) { }

  ngOnDestroy(){

  }

  ngOnInit() {
    console.log("ngOnInit for match-display called");
    let self = this;

    this.trackerService.annotationBegun.subscribe(status =>{
      if(status){
        this.annotationFinishButtonDisabled = false;
      }
      if(status == false){
        this.annotationFinishButtonDisabled = true;
      }
    });
    this.route.params.subscribe(params => {
      this.matchId = params['matchId'];
      this.trackerService.currentMatch.next(this.matchId);
      this.db.getMatchFromNodeKey(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
        this.match = match;
        this.matchUrl = "https://www.youtube.com/embed/" + this.parseVideoUrl(match.matchDeets.videoUrl) + "?enablejsapi=1&html5=1&";
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
            console.log("you clicked play");
          });
          let pause = document.getElementById("begin-move").addEventListener("click", function() {
            //TODO add 1 second rewind?
            player.pauseVideo();
            console.log("pause beginning of move");
            let currentTime = player.getCurrentTime();
            self.trackerService.startTimePoint.next(player.getCurrentTime());
          });
          document.getElementById("end-move").addEventListener("click", function() {
            player.pauseVideo();
            let currentTime = player.getCurrentTime();
            self.trackerService.endTimePoint.next(player.getCurrentTime());
            self.finishAnnotation(currentTime);
            self.openSnackBar("Move Recorded");
            self.trackerService.startTimePoint.pipe(take(1)).subscribe(startTime =>{
              self.trackerService.endTimePoint.pipe(take(1)).subscribe(endTime =>{
                self.trackerService.moveName.pipe(take(1)).subscribe(moveName =>{
                  self.trackerService.performer.pipe(take(1)).subscribe(performer =>{
                    self.trackerService.recipient.pipe(take(1)).subscribe(recipient =>{
                      self.trackerService.points.pipe(take(1)).subscribe(points =>{
                        self.trackerService.currentMatch.pipe(take(1)).subscribe(matchId =>{
                          self.trackerService.submission.pipe(take(1)).subscribe(submission =>{
                            let submissionStatus: boolean = false;
                            if(submission === "Yes"){
                              submissionStatus = true;
                            }
                            self.tempMove = new MoveInVideo(moveName, performer, recipient, startTime, endTime, points, matchId, submissionStatus); //TODO update this once you add performers
                            self.moveAssembledStatus.next(true);
                          });
                        });
                      })
                    });
                  });
                });
              });
            });
            //TODO add 1 second delay?
            player.playVideo();
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
      console.log("moveAssembledStatus changed to " + status);
      console.log(this.tempMove);
      console.log(this.moveCompletelyLegit());
      if(status && this.moveCompletelyLegit()){
        self.db.addMoveInVideoToMatch(this.tempMove);
        this.moveAssembledStatus.next(false);
        self.trackerService.moveName.next("No Annotation Currently Selected");
        self.trackerService.startTimePoint.next(0);
        self.trackerService.endTimePoint.next(0);
        self.trackerService.points.next(-1);
        self.trackerService.performer.next("Nobody");
        self.trackerService.recipient.next("Nobody");
        self.trackerService.videoResumeStatus.next(true);
        self.trackerService.submission.next("No");
        self.trackerService.annotationBegun.next(false);
        console.log("all of the resets supposedly have happened?");
      }
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
  finishAnnotation(currentTime: string){
    console.log(currentTime);
  }
  onMoveSelected(moveSelected: MoveInVideo){
    console.log(moveSelected);
    player.playVideo();
  }
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }


}
