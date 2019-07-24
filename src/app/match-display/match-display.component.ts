import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import {MatSnackBar} from '@angular/material';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';

import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';
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

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute, public snackBar: MatSnackBar, private trackerService:TrackerService) { }

  ngOnDestroy(){

  }

  ngOnInit() {
    console.log("ngOnInit for match-display called");
    let self = this;
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
            self.beginAnnotation(currentTime);
          });
          document.getElementById("end-move").addEventListener("click", function() {
            player.pauseVideo();
            let currentTime = player.getCurrentTime();
            self.trackerService.endTimePoint.next(player.getCurrentTime());
            self.finishAnnotation(currentTime);
            self.openSnackBar("Move Recorded");
            self.annotationFinishButtonDisabled = true;
            self.trackerService.startTimePoint.pipe(takeUntil(self.ngUnsubscribe)).subscribe(startTime =>{
              self.trackerService.endTimePoint.pipe(takeUntil(self.ngUnsubscribe)).subscribe(endTime =>{
                self.trackerService.moveName.pipe(takeUntil(self.ngUnsubscribe)).subscribe(moveName =>{
                  self.trackerService.performer.pipe(takeUntil(self.ngUnsubscribe)).subscribe(performer =>{
                    self.trackerService.recipient.pipe(takeUntil(self.ngUnsubscribe)).subscribe(recipient =>{
                      self.trackerService.points.pipe(takeUntil(self.ngUnsubscribe)).subscribe(points =>{
                        //TODO LEFT OFF HERE
                        // let tempMove = new MoveInVideo(moveName, self.match.matchDeets., 'you', 1, 2, 0, '12345', true); //TODO update this once you add performers
                        //TODO after move is added to db somehow have to disable the form again (do I emit new stuff, reset to "Nobody" and "tmpMove" or whatever???)
                        //TODO add some way to resume the youtube player from here...??
                      })
                    });
                  });
                });
              });
            });
            self.trackerService.moveName.next("No Annotation Currently Selected");
            //TODO make record of video here
            //TODO add 1 second delay
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
      })
    });
  }


  parseVideoUrl(url: string){ //@TODO seems hacky
    var re = /.*youtu.+?be\/(.+)/ig;
    var result = re.exec(url);
    return result[1];
  }

  beginAnnotation(currentTime: string){
    console.log(currentTime);
    this.annotationFinishButtonDisabled = false;
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
