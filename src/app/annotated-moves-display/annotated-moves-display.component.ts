import { Component, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';
import { DateCalculationsService } from '../date-calculations.service';
import { MoveInVideo } from '../moveInVideo.model';

@Component({
  selector: 'app-annotated-moves-display',
  templateUrl: './annotated-moves-display.component.html',
  styleUrls: ['./annotated-moves-display.component.scss']
})
export class AnnotatedMovesDisplayComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private annotations: Array<any> = new Array<any>();
  private isAdmin: boolean = false;
  private matchId: string = null;
  private test: boolean = false;

  constructor(private trackerService: TrackerService, private databaseService: DatabaseService, private dateCalculationsService: DateCalculationsService) { }

  ngOnInit() {
    this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchId =>{
      // console.log("got into currentMatch: " + matchId);
      this.databaseService.getAnnotationsSortedByStartTime(matchId, 'matches/' + matchId + '/moves/').pipe(takeUntil(this.ngUnsubscribe)).subscribe(annotations =>{
        // console.log("annotations in AnnotatedMovesDisplayComponent");
        // console.log(annotations);
        this.matchId = matchId;
        this.annotations = new Array();
        if(annotations){
          annotations.forEach(annotation =>{
            let currentMoveInVideo = new MoveInVideo(annotation.moveName, annotation.actor, annotation.recipient, annotation.timeInitiated, annotation.timeCompleted, annotation.points, annotation.associatedMatchId, annotation.isASubmission, annotation.isSuccessfulAttempt, annotation.annotatorUserId);
            currentMoveInVideo.updateDateAdded(annotation.dateAdded);
            this.annotations.push(currentMoveInVideo);//[Object.keys(annotation)[0]]
          });
        }
        // console.log(this.annotations);
        // Object.keys(annotations).forEach(key =>{
        //   console.log(annotations[key]);
        // });
        // [Object.keys(dbUser)[0]]
        // console.log(annotations);
      });
    });

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
      usr ? this.isAdmin = usr.privileges.isAdmin: this.isAdmin = false;
    });
  }

  ngOnDestroy(){
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }

  playStartingAt(time: number){
    // console.log("entered playStartingAt");
    // console.log(time);
    this.trackerService.desiredJumpStartTime.next(time);
  }

  removeAnnotation(timeInitiated: number, annotatorUserId: string){
    // console.log("clicked removeAnnotation");
    // console.log(timeInitiated);
    let confirmation = confirm("Are you sure you want to delete this annotation?");
    if(confirmation){
      this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchId =>{
        console.log("matchId from tracker service in annotated moves display about to call removeAnnotationInMatchAndUserByStartTime: " + matchId);
        this.databaseService.removeAnnotationInMatchAndUserByStartTime(matchId, timeInitiated, annotatorUserId);
      });
    } else{
      // console.log("confirmation denied");
    }
  }

}
