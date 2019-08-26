import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TrackerService } from '../tracker.service';
import { AnnotationLegendDialogComponent } from '../annotation-legend-dialog/annotation-legend-dialog.component';
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

  constructor(private trackerService: TrackerService, private databaseService: DatabaseService, private dateCalculationsService: DateCalculationsService, public dialog: MatDialog) { }

  ngOnInit() {
    // let self = this;
    this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchId =>{
      this.matchId = matchId;
      // console.log("got into currentMatch: " + matchId);
      this.fetchAnnotations(this.matchId);
    });

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
      usr ? this.isAdmin = usr.privileges.isAdmin: this.isAdmin = false;
    });

    this.trackerService.fetchNewAnnotations.pipe(takeUntil(this.ngUnsubscribe)).subscribe(shouldFetch =>{
      if(shouldFetch){
        this.fetchAnnotations(this.matchId);
        this.trackerService.fetchNewAnnotations.next(false);
      }
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
        this.databaseService.removeAnnotationInMatchAndUserByStartTime(matchId, timeInitiated, annotatorUserId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          if(status){
              this.fetchAnnotations(this.matchId);
          }
        });
      });
    } else{
      // console.log("confirmation denied");
    }
  }

  // displayLegend(){
  //   alert("moused over!");
  //   //TODO
  // }

  openLegendDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = false;
    // dialogConfig.width = '250px';
    // dialogConfig.position = "left";
    // dialogConfig.data = {};
    const dialogRef = this.dialog.open(AnnotationLegendDialogComponent, dialogConfig);
  }

  fetchAnnotations(matchId: string){
    if(matchId){
      this.annotations = new Array();
      this.databaseService.getAnnotationsSortedByStartTime(matchId, 'matches/' + matchId + '/moves/').pipe(takeUntil(this.ngUnsubscribe)).subscribe(annotation =>{
        console.log("annotations in AnnotatedMovesDisplayComponent");
        console.log(annotation);
        if(annotation){
          if(this.annotations.includes(annotation)){
            this.annotations = new Array();
          }
          let currentMoveInVideo = new MoveInVideo(annotation.moveName, annotation.actor, annotation.recipient, annotation.timeInitiated, annotation.timeCompleted, annotation.points, annotation.associatedMatchId, annotation.isASubmission, annotation.isSuccessfulAttempt, annotation.annotatorUserId);
          currentMoveInVideo.updateDateAdded(annotation.dateAdded);
          this.annotations.push(annotation);
        }
      });
    }
  }

}
