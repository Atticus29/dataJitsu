import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-youtube',
  templateUrl: './youtube.component.html',
  styleUrls: ['./youtube.component.css']
})
export class YoutubeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var player;

    (window as any).onYouTubeIframeAPIReady = function() {
      player = new YT.Player('video', {
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    function onPlayerStateChange(event){
      if (event.data == YT.PlayerState.PAUSED) {
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

    var tag = document.createElement('script');
    tag.src = "//www.youtube.com/player_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

  }

}
