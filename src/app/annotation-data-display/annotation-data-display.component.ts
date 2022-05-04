import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";

import { takeUntil } from "rxjs/operators";
import { Observable, Subject } from "rxjs";

import { DatabaseService } from "../database.service";
import { BaseComponent } from "../base/base.component";
import { TrackerService } from "../tracker.service";
import { TimelineElement } from "../horizontal-timeline/timeline-element";
import { EventInVideo } from "../eventInVideo.model";

@Component({
  selector: "app-annotation-data-display",
  templateUrl: "./annotation-data-display.component.html",
  styleUrls: ["./annotation-data-display.component.scss"],
})
export class AnnotationDataDisplayComponent
  extends BaseComponent
  implements OnInit
{
  public videoId: string;
  public timeline: TimelineElement[] = [];
  content = `Lorem ipsum dolor sit amet`;

  constructor(public dbService: DatabaseService, public route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.timeline = [
      { caption: "", startTime: 1, selected: true, title: "", content: "" },
      {
        caption: "16 Jan",
        startTime: 2,
        title: "Horizontal Timeline",
        content: this.content,
      },
      {
        caption: "28 Feb",
        startTime: 3,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "20 Mar",
        startTime: 4,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "20 May",
        startTime: 5,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "09 Jul",
        startTime: 6,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "30 Aug",
        startTime: 7,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "15 Sep",
        startTime: 8,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "01 Nov",
        startTime: 9,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "10 Dec",
        startTime: 10,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "29 Jan",
        startTime: 11,
        title: "Event title here",
        content: this.content,
      },
      {
        caption: "3 Mar",
        startTime: 12,
        title: "Event title here",
        content: this.content,
      },
    ];
    let tracker: number = 2;
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.videoId = params["videoId"];
        this.dbService
          .getEventsInVideo(this.videoId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((moves) => {
            // console.log("move from within AnnotationDataDisplayComponent:");
            // console.log(moves);
            // let theMoves = new EventInVideo(moves);
            moves.forEach((move) => {
              // console.log(move);
              if (move.timeInitiated <= 0) {
                move.timeInitiated = 1;
              }
              // this.timeline.push({caption: move.eventName, startTime: tracker, title: move.eventName, content: move.eventName + " performed by " + move.actor + " at " + move.timeInitiated + ". Scored " + move.points + " points."})
              tracker += 1;
              // console.log("tracker is " + tracker);
            });
          });
      });
  }
}
