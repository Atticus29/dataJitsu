import { Component, OnInit } from "@angular/core";

import { Video } from "../video.model";
import { VideoDetails } from "../videoDetails.model";
import { EventInVideo } from "../eventInVideo.model";
import { User } from "../user.model";
import { DatabaseService } from "../database.service";
import { TrackerService } from "../tracker.service";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-youtube",
  templateUrl: "./youtube.component.html",
  styleUrls: ["./youtube.component.scss"],
  providers: [DatabaseService],
})
export class YoutubeComponent extends BaseComponent implements OnInit {
  constructor(
    public db: DatabaseService,
    public trackerService: TrackerService
  ) {
    super();
  }

  ngOnInit() {
    var player;
    // console.log("got here 1");
    // player = new window['YT'].Player('video', {
    //   height: '195',
    //   width: '320',
    //   playerVars: {
    //    playsinline: '1',
    //    controls: '0'
    //   },
    //   events: {
    //     'onReady': onPlayerReady,
    //     'onStateChange': onPlayerStateChange
    //   }
    // });

    window["onYouTubeIframeAPIReady"] = function () {
      console.log("onYouTubeIframeAPIReady entered");
      // player = new window['YT'].Player('video', {
      //   height: '195',
      //   width: '320',
      //   playerVars: {
      //    playsinline: '1',
      //    controls: '0'
      //   },
      //   events: {
      //     'onReady': onPlayerReady,
      //     'onStateChange': onPlayerStateChange
      //   }
      // });
    };

    function onPlayerStateChange(event) {
      if (event.data == window["YT"].PlayerState.PAUSED) {
        // console.log(player.getCurrentTime());
        this.trackerService.startTimePoint.next(player.getCurrentTime());
      }
    }

    function onPlayerReady(event) {
      document.getElementById("pause").addEventListener("click", function () {
        player.pauseVideo();
      });
      document.getElementById("play").addEventListener("click", function () {
        player.playVideo();
      });
    }

    if (!window["YT"]) {
      console.log("nothing is here!");
      var tag = document.createElement("script");
      tag.src = "httsp://www.youtube.com/player_api?controls=0";
      var firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }
}
