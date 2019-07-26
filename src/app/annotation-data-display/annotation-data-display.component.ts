import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';

import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'app-annotation-data-display',
  templateUrl: './annotation-data-display.component.html',
  styleUrls: ['./annotation-data-display.component.scss']
})
export class AnnotationDataDisplayComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private matchId: string;

  constructor(private dbService: DatabaseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.matchId = params['matchId'];
      this.dbService.getMovesInMatch(this.matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moves =>{
        console.log("move from within AnnotationDataDisplayComponent:");
        console.log(moves);
      });
    });
    // this.trackerService.currentMatch.subscribe(matchId =>{
    // });
  }

}
