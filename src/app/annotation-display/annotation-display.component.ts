import { Injectable, Component, OnInit, EventEmitter, Output } from '@angular/core';

import { MatIconModule } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {MatTreeNestedDataSource, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { Subject, of, BehaviorSubject, Observable, merge } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { NewMoveDialogComponent } from '../new-move-dialog/new-move-dialog.component';
import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';
import { TrackerService } from '../tracker.service';
import { ValidationService } from '../validation.service';
import { DynamicFlatNode } from '../dynamicFlatNode.model';
import { DynamicDatabase } from '../dynamicDatabase.model';
import { DynamicDataSource } from '../dynamicDataSource.model';
import { allCurrentMoves } from '../moves';
import { constants } from '../constants';

import { MoveInVideo } from '../moveInVideo.model';
import { MatchDetails} from '../matchDetails.model';

declare var $:any;

@Component({
  selector: 'app-annotation-display',
  templateUrl: './annotation-display.component.html',
  styleUrls: ['./annotation-display.component.scss']
  // providers: [DynamicDatabase]
})
export class AnnotationDisplayComponent extends BaseComponent implements OnInit {
  @Output() moveSelected = new EventEmitter<MoveInVideo>();

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;
  // private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moveCategories: string[];
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
  getLevel = (node: DynamicFlatNode) => node.level;
  private selectedAnnotation: string = "No Annotation Currently Selected";
  private disabledStatus: boolean = true;
  private performers: any[];
  private localMatchDeets: MatchDetails;
  private disabledPerformer: boolean = false;
  private moveValidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private moveValidStatus: boolean = false;
  private points = new FormControl('', [Validators.required, Validators.min(0)]);
  private performerFg = new FormControl('', [Validators.required]);
  private submissionStatus: string = "No";
  private attemptStatus: string = "Yes";
  private pointsEntered: number = -1;
  private localMoveName: string = null;
  private localUser: any = null;

  constructor(private vs: ValidationService, private fb: FormBuilder, private db: DatabaseService, private textTransformationService: TextTransformationService, private database: DynamicDatabase, private trackerService:TrackerService, private _snackBar: MatSnackBar, public dialog: MatDialog) {
    super();
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, this.database, this.db);
    this.dataSource.data = this.database.initialData();
  }

  ngOnInit() {
    $('.modal').appendTo('body').modal();
    // let categories = this.db.getMovesKeys().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results=>{
    //   this.moveCategories = results;
    // });
    // let results = this.db.getMoves().pipe(takeUntil(this.ngUnsubscribe)).subscribe(stuff=>{
    //   for(let index in stuff){
    //     //TODO ??
    //   }
    // });
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currentUser =>{
      if(currentUser && currentUser.uid){
        this.localUser = currentUser;
      }
    });
    this.trackerService.startTimePoint.next(1);
    this.trackerService.moveName.pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveName =>{
          if(moveName !== "No Annotation Currently Selected"){
            this.moveValidSubject.next(true);
          }
    });
    this.trackerService.currentMatch.pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchId =>{
      this.db.getMatchDetails(matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchDeets =>{
        // console.log("matchDeets in current match tracker service subscribe in annotation-display.component: ");
        // console.log(Array.of(matchDeets));
        this.localMatchDeets =  Array.of(matchDeets).map(MatchDetails.fromJson)[0];
        // console.log(this.localMatchDeets);
        //TODO maybe a try catch here?
        let thePerformers: string[] = [this.localMatchDeets.athlete1Name, this.localMatchDeets.athlete2Name];
        this.performers = thePerformers;
      });
    });
    this.moveValidSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
      if(status){
        this.moveValidStatus = true;
      } else{
        this.moveValidStatus = false;
      }
    });
    this.trackerService.moveName.pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveName =>{
      this.selectedAnnotation = moveName;
    });
  }

  getErrorMessage() {
    return this.points.hasError('required') ? 'You must enter a value' :
    this.points.hasError('min') ? 'Number must be zero or greater' :
    '';
    // return this.email.hasError('required') ? 'You must enter a value' :
    //     this.email.hasError('email') ? 'Not a valid email' :
    //         '';
  }

  selectItem(item: string){
    // console.log("selectItem entered");
    if(item.charAt(0)==="A" && item.charAt(1)==="d" && item.charAt(2)==="d"){
      // console.log("add a move reached");
      this.openAddNameDialog();
      //TODO eventually when you listen for it to come back, send moveName to tracker service
    }
    else{
      this.trackerService.moveName.next(item);
      // console.log("item selected: " + item);
    }
  }

  registerCategory(category: string){
    if(constants.rootNodes.includes(category)){
      // console.log(category + " from registerCategory function. Adding to moveCategory...");
      this.trackerService.moveCategory.next(category);
    }
  }

  getValues(){
    let performerValue = this.performerFg.value;
    let pointValue = this.points.value;
    let theSubmissionStatus = this.submissionStatus;
    let theAttemptStatus = this.attemptStatus;
    let results = {performerValue, pointValue, theSubmissionStatus, theAttemptStatus};
    // console.log("getValues call: ");
    // console.log(results);
    return results;
  }

  processFormInputs(){ //Kicks off some observables that have subscribers elsewhere. Has its little tendrils in everything
    let result = this.getValues();
    this.trackerService.performer.next(result.performerValue);
    this.trackerService.points.next(result.pointValue);
    this.trackerService.submission.next(result.theSubmissionStatus);
    // console.log("attempt successful?");
    // console.log(result.theAttemptStatus);
    this.trackerService.attemptStatus.next(result.theAttemptStatus);
    let remainder = this.performers.filter( function(item){return (item !== result.performerValue);} );
    this.trackerService.recipient.next(remainder[0]);
    this.trackerService.videoResumeStatus.next(true);
    this.trackerService.annotationBegun.next(true);
    this.performerFg.reset();
    this.points.reset();
    this.dataSource.dataChange.next(this.database.initialData());
  }

  allValid(): boolean{
    // console.log("allValid called");
    let submissionStatusValue = this.submissionStatus;
    // console.log("submissionStatusValue from allValid");
    // console.log(submissionStatusValue);
    let attemptStatusValue = this.attemptStatus;
    // console.log("attemptStatusValue from allValid");
    // console.log(attemptStatusValue);
    let performerValue = this.performerFg.value;
    let pointValue = this.points.value;
    if(performerValue && pointValue > -1){ //TODO && submissionStatusValue stuff && attemptStatusValue stuff
      // console.log("performerValue true");
      return true;
    } else{
      return false;
    }
  }

  respondToAnnotationCancel(){
    // console.log("Cancel was clicked TODO don't swap the buttons in match display");
  }

  openAddNameDialog(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    const dialogRef = this.dialog.open(NewMoveDialogComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
      // console.log("got dialog data to annotation-display component?:");
      // console.log(val);
      // TODO check that it already exists add maybe a forEach to take through each rootNode and see if it's in its child
      // this.openSnackBar("Name already exists in dropdown menu!", null);
      val.move = this.textTransformationService.capitalizeFirstLetter(val.move);

      this.trackerService.moveName.next(val.move);
      this.trackerService.moveCategory.next(val.moveCategory);
      this.trackerService.moveSubcategory.next(val.moveSubcategory);
      if(this.localUser.id){
        // console.log("user db id is: ");
        // console.log(this.localUser.id);
        // console.log(this.localMatchDeets);
        if(this.localMatchDeets){
          // console.log("YOOOOOO");
          // console.log(this.localMatchDeets);
          // console.log(this.localMatchDeets.videoUrl);
          this.db.addCandidateMoveInVideoToDb(val.move, val.moveCategory,val.moveSubcategory, this.localUser.id, this.localMatchDeets.videoUrl);
        }
      }
      //TODO add to an admin component
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
