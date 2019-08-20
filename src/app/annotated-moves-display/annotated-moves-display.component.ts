import { Component, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-annotated-moves-display',
  templateUrl: './annotated-moves-display.component.html',
  styleUrls: ['./annotated-moves-display.component.scss']
})
export class AnnotatedMovesDisplayComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private trackerService: TrackerService, private databaseService: DatabaseService) { }

  ngOnInit() {
    this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchId =>{
      this.databaseService.getAnnotations(matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(annotations =>{
        console.log("annotations in AnnotatedMovesDisplayComponent");
        console.log(annotations);
      });
    });

  }

  ngOnDestroy(){
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }

}
