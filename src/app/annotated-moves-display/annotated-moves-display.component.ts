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

  constructor(private trackerService: TrackerService, private databaseService: DatabaseService, private dateCalculationsService: DateCalculationsService) { }

  ngOnInit() {
    this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchId =>{
      this.databaseService.getAnnotationsSortedByStartTime(matchId, 'matches/' + matchId + '/moves/').pipe(takeUntil(this.ngUnsubscribe)).subscribe(annotation =>{
        // console.log("annotations in AnnotatedMovesDisplayComponent");
        console.log(annotation);
        let currentMoveInVideo = new MoveInVideo(annotation.moveName, annotation.actor, annotation.recipient, this.dateCalculationsService.roundToDecimal(annotation.timeInitiated, 2), annotation.timeCompleted, annotation.points, annotation.associatedMatchId, annotation.isASubmission, annotation.isSuccessfulAttempt, annotation.annotatorUserId);
        currentMoveInVideo.updateDateAdded(annotation.dateAdded);
        this.annotations.push(currentMoveInVideo);//[Object.keys(annotation)[0]]
        console.log(this.annotations);
        // Object.keys(annotations).forEach(key =>{
        //   console.log(annotations[key]);
        // });
        // [Object.keys(dbUser)[0]]
        // console.log(annotations);
      });
    });

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
      console.log("usr in annotated-moves-display:");
      usr ? this.isAdmin = usr.privileges.isAdmin: this.isAdmin = false;
      // if(usr){
      //   console.log(usr.privileges.isAdmin);
      //   this.isAdmin = usr.privileges.isAdmin;
      // } else{
      //   this.isAdmin = false;
      // }
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

  removeAnnotation(timeInitiated: number){
    console.log("clicked removeAnnotation");
    console.log(timeInitiated);
    let confirmation = confirm("Are you sure you want to delete this annotation?");
    if(confirmation){
      this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchId =>{
        this.databaseService.removeAnnotationInMatchByStartTime(matchId, timeInitiated);
      });
    } else{
      // console.log("confirmation denied");
    }
  }

}
