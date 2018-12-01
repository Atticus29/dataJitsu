import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DatabaseService } from '../database.service';

import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';

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
  // player: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute) { }

  ngOnDestroy(){

  }

  ngOnInit() {
    console.log("ngOnInit for match-display called");
    let player;
    let self = this;
    this.route.params.subscribe(params => {
      this.matchId = params['matchId'];
      this.db.getMatchFromNodeKey(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(match =>{
        console.log("got to getMatchFromNodeKey");
        this.match = match;
        this.matchUrl = "https://www.youtube.com/embed/" + this.parseVideoUrl(match.matchDeets.videoUrl) + "?enablejsapi=1&html5=1&";
        document.getElementById('videoIframe').setAttribute("src", this.matchUrl);
        window['onYouTubeIframeAPIReady'] = function() {
          player = new window['YT'].Player('videoIframe', {
            events: {
              'onReady': onPlayerReady,
              'onStateChange': onPlayerStateChange
            }
          });
        }

        function onPlayerReady(event) {
          document.getElementById("play").addEventListener("click", function() {
            player.playVideo();
          });
          let pause = document.getElementById("begin-move").addEventListener("click", function() {
            player.pauseVideo();
            console.log("pause beginning of move");
            let currentTime = player.getCurrentTime();
            self.pauseAndAnnotate(currentTime);
          });
          document.getElementById("end-move").addEventListener("click", function() {
            player.pauseVideo();
            let currentTime = player.getCurrentTime();
            self.resumeAndFinishAnnotation(currentTime);
            //TODO add 1 second delay
            player.playVideo();
          });
          document.getElementById("pause-vid").addEventListener("click", function() {
            player.pauseVideo();
            //TODO add 1 second delay
            // player.playVideo();
          });
        }

        function onPlayerStateChange(event){
          if (event.data == window['YT'].PlayerState.PAUSED) {
            // console.log(player.getCurrentTime());
            // this.currentTime = player.getCurrentTime();
            // this.pauseAndAnnotate(this.currentTime);
            //public moveID, moveName, actor, recipient(can be inferred), timeInitiated, timeCompleted, points, associatedMatchDetailsId, isASubmission
          };
          if(event.data==window['YT'].PlayerState.PLAYING){
            self.playCount = self.playCount + 1;
          }
          if (event.data == window['YT'].PlayerState.PLAYING && self.playCount >= 1) {
            // console.log(player.getCurrentTime());
            // this.currentTime = player.getCurrentTime();
            // this.resumeAndFinishAnnotation(this.currentTime);
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

  pauseAndAnnotate(currentTime: string){
    console.log("got into pauseAndAnnotate method");
    console.log(currentTime);
  }

  resumeAndFinishAnnotation(currentTime: string){
    console.log("resume end of move");
    console.log(currentTime);
  }

  onMoveSelected(moveSelected: MoveInVideo){
    console.log("got into onMoveSelected");
    console.log(moveSelected);
  }


}
