import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { TimelineElement } from '../horizontal-timeline/timeline-element';

@Component({
  selector: 'app-annotation-data-display',
  templateUrl: './annotation-data-display.component.html',
  styleUrls: ['./annotation-data-display.component.scss']
})
export class AnnotationDataDisplayComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private matchId: string;
  private timeline: TimelineElement[] = [];
  content = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum praesentium officia, fugit recusandae
  ipsa, quia velit nulla adipisci? Consequuntur aspernatur at, eaque hic repellendus sit dicta consequatur quae,
  ut harum ipsam molestias maxime non nisi reiciendis eligendi! Doloremque quia pariatur harum ea amet quibusdam
  quisquam, quae, temporibus dolores porro doloribus.`;

  constructor(private dbService: DatabaseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.load();
    this.route.params.subscribe(params => {
      this.matchId = params['matchId'];
      this.dbService.getMovesInMatch(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moves =>{
        console.log("move from within AnnotationDataDisplayComponent:");
        console.log(moves);
      });
    });
  }

  load() {
    this.timeline = [];
    setTimeout(() => { // simulate delay
      this.timeline = [
    { caption: '16 Jan', date: new Date(2014, 1, 16), title: 'Horizontal Timeline', content: this.content },
    { caption: '28 Feb', date: new Date(2014, 2, 28), title: 'Status#1', content: this.content },
    { caption: '20 Mar', date: new Date(2014, 3, 20), selected: true, title: 'Status#2', content: this.content },
    { caption: '20 May', date: new Date(2014, 5, 20), title: 'Status#3', content: this.content },
    { caption: '09 Jul', date: new Date(2014, 7, 9), title: 'Status#4', content: this.content },
    { caption: '30 Aug', date: new Date(2014, 8, 30), title: 'Status#5', content: this.content },
    { caption: '15 Sep', date: new Date(2014, 9, 15), title: 'Status#6', content: this.content },
    { caption: '01 Nov', date: new Date(2014, 11, 1), title: 'Status#7', content: this.content },
    { caption: '10 Dec', date: new Date(2014, 12, 10), title: 'Status#8', content: this.content },
    { caption: '29 Jan', date: new Date(2015, 1, 19), title: 'Status#9', content: this.content },
    { caption: '3 Mar', date: new Date(2015, 3, 3), title: 'Status#9', content: this.content },
    ];
    }, 2000);
  }


}
