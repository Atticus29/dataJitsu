import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(){}
  ngOnInit(){
    let tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var player;
    var video = 'xnFyujujf_8'
    video.h: string = '390' //video iframe height
    video.w = '640' //video iframe width

    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        height: video.h,
        width: video.w,
        videoId: video,
        events: {
          'onStateChange': onPlayerStateChange,
          'onError': onPlayerError
        }
      });
    };
  }

}
