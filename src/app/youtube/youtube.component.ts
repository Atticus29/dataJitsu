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
    let matchDeets: MatchDetails = new MatchDetails("testId", "worlds", "california", new Date(), "athlete1", "athlete2", "rooster", "black", "https://www.youtube.com/watch?v=LPj368_plK0&index=183&list=WL", "male", false, "master 1");
    let move1: MoveInVideo = new MoveInVideo("move 123456", "mount", "athlete1", "athlete2", 361, 379, 4, "testId", false);
    let move2: MoveInVideo = new MoveInVideo("move 123456", "armbar", "athlete1", "athlete2", 361, 379, 0, "testId", true);
    let moveArray: Array<MoveInVideo> = [move1, move2];
    let user1: User = new User("testUser", "Bob the fake user", "bob@bob.com", "red", "sbg", 33, 155, "light", 100);
    let match1: Match = new Match(matchDeets, user1, moveArray);
    this.db.addMatchToDb(match1);

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
