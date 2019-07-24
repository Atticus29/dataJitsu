import { Injectable, Component, OnInit, EventEmitter, Output } from '@angular/core';

import {MatTreeNestedDataSource, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

import { MatIconModule } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

import { Subject, of, BehaviorSubject, Observable, merge } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';
import { TrackerService } from '../tracker.service';
import { ValidationService } from '../validation.service';

import { DynamicFlatNode } from '../dynamicFlatNode.model';
import { DynamicDatabase } from '../dynamicDatabase.model';
import { DynamicDataSource } from '../dynamicDataSource.model';

import { allCurrentMoves } from '../moves';

import { MoveInVideo } from '../moveInVideo.model';

declare var $:any;

@Component({
  selector: 'app-annotation-display',
  templateUrl: './annotation-display.component.html',
  styleUrls: ['./annotation-display.component.scss'],
  providers: [DynamicDatabase]
})
export class AnnotationDisplayComponent implements OnInit {
  @Output() moveSelected = new EventEmitter<MoveInVideo>();

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moveCategories: string[];
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
  getLevel = (node: DynamicFlatNode) => node.level;
  private selectedAnnotation: string = "No Annotation Currently Selected";
  private disabledStatus: boolean = true;
  private performers: any[];
  private localMatchDeets: any[];
  private disabledPerformer: boolean = false;
  private moveValidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private moveValidStatus: boolean = false;
  private points = new FormControl('', [Validators.required, Validators.min(0)]);
  private performerFg = new FormControl('', [Validators.required]);
  private submissionStatus: string = "No";
  private pointsEntered: number = -1;

  constructor(private vs: ValidationService, private fb: FormBuilder, private db: DatabaseService, textTransformationService: TextTransformationService, database: DynamicDatabase, private trackerService:TrackerService) {
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, this.db);
    this.dataSource.data = database.initialData();
  }

  ngOnInit() {
    $('.modal').modal();
    let categories = this.db.getMovesKeys().subscribe(results=>{
      this.moveCategories = results;
    });
    let results = this.db.getMoves().subscribe(stuff=>{
      for(let index in stuff){
        //TODO ??
      }
    });
    this.trackerService.startTimePoint.next(1);
    this.trackerService.moveName.subscribe(moveName =>{
          if(moveName !== "No Annotation Currently Selected"){
            this.moveValidSubject.next(true);
          }
    });
    this.trackerService.currentMatch.subscribe(matchId =>{
      this.db.getMatchDetails(matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchDeets =>{
        let localMatchDeets: any = matchDeets;
        let thePerformers: string[] = [localMatchDeets.athlete1Name, localMatchDeets.athlete2Name];
        this.performers = thePerformers;
      });
    });
    this.moveValidSubject.subscribe(status =>{
      if(status){
        this.moveValidStatus = true;
      } else{
        this.moveValidStatus = false;
      }
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
    this.selectedAnnotation = item;
    this.trackerService.moveName.next(item);
  }

  getValues(){
    let performerValue = this.performerFg.value;
    let pointValue = this.points.value;
    let theSubmissionStatus = this.submissionStatus;
    let results = {performerValue, pointValue, theSubmissionStatus};
    console.log("getValues call: ");
    console.log(results);
    return results;
  }

  processFormInputs(){
    let result = this.getValues();
    this.trackerService.performer.next(result.performerValue);
    this.trackerService.points.next(result.pointValue);
    this.trackerService.submission.next(result.theSubmissionStatus);
    let remainder = this.performers.filter( function(item){return (item !== result.performerValue);} );
    this.trackerService.recipient.next(remainder[0]);
    this.trackerService.videoResumeStatus.next(true);

  }

  allValid(): boolean{
    console.log("allValid called");
    let submissionStatusValue = this.submissionStatus;
    console.log("submissionStatusValue from allValid");
    console.log(submissionStatusValue);
    let performerValue = this.performerFg.value;
    let pointValue = this.points.value;
    if(performerValue && pointValue > -1){ //TODO && submissionStatusValue stuff
      console.log("performerValue true");
      return true;
    } else{
      return false;
    }
  }
}
