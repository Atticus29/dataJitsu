import { Component, OnInit } from '@angular/core';
import { Match } from '../match.model';
import { MatchDetails } from '../matchDetails.model';
import { MoveInVideo } from '../moveInVideo.model';
import { User } from '../user.model';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css'],
  providers: [DatabaseService]
})
export class YoutubeComponent implements OnInit {

  constructor(private db:DatabaseService) { }

  ngOnInit() {
    console.log("YoutubeComponent initialized");
    var player;

    window['onYouTubeIframeAPIReady'] = function() {
      player = new window['YT'].Player('video', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    function onPlayerStateChange(event){
      if (event.data == window['YT'].PlayerState.PAUSED) {
        console.log(player.getCurrentTime());
      }
    }

    function onPlayerReady(event) {
      document.getElementById("pause").addEventListener("click", function() {
        player.pauseVideo();
      });
      document.getElementById("play").addEventListener("click", function() {
        player.playVideo();
      });
    }

    if (!window['YT']){
      var tag = document.createElement('script');
      tag.src = "//www.youtube.com/player_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }
}
