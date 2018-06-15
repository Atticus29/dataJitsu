import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-match-display',
  templateUrl: './match-display.component.html',
  styleUrls: ['./match-display.component.scss']
})
export class MatchDisplayComponent implements OnInit {
  matchId : string;
  matchDetails: MatchDetails;
  match: Match;
  matchUrl: string;
  // player: any;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router, private db: DatabaseService, private route: ActivatedRoute) { }

  ngOnInit() {
    let player;
    this.route.params.subscribe(params => {
      this.matchId = params['matchId'];
      console.log(this.matchId);
      this.db.getMatchFromNodeKey(this.matchId).takeUntil(this.ngUnsubscribe).subscribe(match =>{
        this.match = match;
        this.matchUrl = "https://www.youtube.com/embed/" + this.parseVideoUrl(match.matchDeets.videoUrl) + "?enablejsapi=1&html5=1&";
        console.log("Match Url is: " + this.matchUrl);
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
          let pause = document.getElementById("pause").addEventListener("click", function() {
            console.log("pause clicked")
            player.pauseVideo();
          });
          document.getElementById("play").addEventListener("click", function() {
            player.playVideo();
          });
        }

        function onPlayerStateChange(event){
          if (event.data == window['YT'].PlayerState.PAUSED) {
            console.log(player.getCurrentTime());
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
    // console.log("url entering parseVideoUrl is: " + url);
    var re = /.*youtu.+?be\/(.+)/ig;
    var result = re.exec(url);
    // console.log(result[1]);
    return result[1];
  }

  pauseAndAnnotate(){
    console.log("pause clicked method!");
  }


}
