import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { TrackerService } from '../tracker.service';
import { AnnotationLegendDialogComponent } from '../annotation-legend-dialog/annotation-legend-dialog.component';
import { DatabaseService } from '../database.service';
import { DateCalculationsService } from '../date-calculations.service';
import { EventInVideo } from '../eventInVideo.model';
import { BaseComponent } from '../base/base.component';
import { constants } from '../constants';

@Component({
  selector: 'app-annotated-moves-display',
  templateUrl: './annotated-moves-display.component.html',
  styleUrls: ['./annotated-moves-display.component.scss']
})
export class AnnotatedMovesDisplayComponent extends BaseComponent implements OnInit {
  // private ngUnsubscribe: Subject<void> = new Subject<void>();
  private annotations: Array<any> = new Array<any>();
  private localFlagMin: number = 1000;
  private isAdmin: boolean = false;
  private videoId: string = null;
  private test: boolean = false;
  private localUserId: string = null;
  // private isFlaggedDirective: boolean = false;
  private isAdvantage: boolean = false;

  constructor(private trackerService: TrackerService, private databaseService: DatabaseService, private dateCalculationsService: DateCalculationsService, public dialog: MatDialog, private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    console.log("ngOnInit in annotated-moved-display entered");
    this.localFlagMin = constants.numberOfFlagsAnAnnotationNeedsBeforeItIsDisplayedToDrawAttention;
    let self = this;
    this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(videoId =>{ //takeUntil(this.ngUnsubscribe)
      this.videoId = videoId;
      console.log("got into currentMatch: " + this.videoId);
      this.fetchAnnotations(this.videoId);
    });

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usr =>{
      usr ? this.isAdmin = usr.privileges.isAdmin: this.isAdmin = false;
      usr ? this.localUserId = usr.id: this.localUserId = null;
    });

    this.trackerService.fetchNewAnnotations.pipe(takeUntil(this.ngUnsubscribe)).subscribe(shouldFetch =>{
      if(shouldFetch){
        // console.log("error starts in fetchAnnotations which is true listening for fetchNewAnnotations in trackerService?");
        this.fetchAnnotations(this.videoId);
        this.trackerService.fetchNewAnnotations.next(false);
      } else{
        // console.log("fetchAnnotations is false");
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
      this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(videoId =>{
        // console.log("videoId from tracker service in annotated moves display about to call removeAnnotationInMatchAndUserByStartTime: " + videoId);
        this.databaseService.removeAnnotationInMatchAndUserByStartTime(videoId, timeInitiated, annotatorUserId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          if(status){
              this.fetchAnnotations(this.videoId);
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
    const dialogRef = this.dialog.open(AnnotationLegendDialogComponent, dialogConfig);
  }

  // testing(){
  //   console.log("clicked hi")!
  //   this.isFlaggedDirective = true;
  // }

  fetchAnnotations(videoId: string){
    if(videoId){
      this.annotations = new Array();
      this.databaseService.getAnnotationsSortedByStartTimeV2(videoId, 'videos/' + videoId + '/events/').pipe(takeUntil(this.ngUnsubscribe)).subscribe(annotationResults =>{ //TODO ?
        if(annotationResults){
          console.log("annotationResults in fetchAnnotations call of AnnotatedMovesDisplayComponent:");
          console.log(annotationResults);
          this.annotations = annotationResults;
        }else{
          console.log("no videoId in fetchAnnotations call");
        }
      });
    }
  }


  flagAnnotationForImprovement(videoId: string, timeInitiated: number, annotatorUserId: string){
    // this.isFlaggedDirective = true;
    // this.cdr.detectChanges();
    let self = this;
    if(this.localUserId){
      // console.log("got here");
      this.databaseService.toggleAnnotationFlag(videoId, timeInitiated, this.localUserId);
      //if this hits the flag threshold, deduct from annotator's reputation
      //numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction
      //numberOfPointsToDeductForBadAnnotation
      this.databaseService.getNumberOfUniqueAnnotationFlags(videoId, timeInitiated).pipe(take(1)).subscribe(numberOfFlags =>{
        // console.log("got close");
        this.fetchAnnotations(videoId);
        if(numberOfFlags >= constants.numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction){
          // console.log("got closest!");
          this.databaseService.updateUserReputationPoints(annotatorUserId, (constants.numberOfPointsToDeductForBadAnnotation*-1), "Your annotation on match " + videoId + " was flagged too many times.");
        }
      });
    } else{
      // console.log("this flagAnnotationForImprovement branch should never happen");
    }
  }

}
