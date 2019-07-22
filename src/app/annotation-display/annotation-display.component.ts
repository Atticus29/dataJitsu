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
  private performerFormGroup: FormGroup;
  performers: any[];
  private localMatchDeets: any[];
  private disabledPerformer: boolean = false;
  private allValidSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private validStatus: boolean = false;

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
    this.performerFormGroup = this.fb.group({
      performerBound: ['', Validators.required],
      pointsBound: ['', Validators.required]
    });
    this.trackerService.currentMatch.subscribe(matchId =>{
      this.db.getMatchDetails(matchId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchDeets =>{
        let localMatchDeets: any = matchDeets;
        let thePerformers: string[] = [localMatchDeets.athlete1Name, localMatchDeets.athlete2Name];
        this.performers = thePerformers;
        this.trackerService.moveName.subscribe(moveNameResult =>{
          if(moveNameResult !== "tempMove"){
            console.log("move has been picked");
            this.allValidSubject.next(true);
          } else{
            this.allValidSubject.next(false);
          }
        });
      });
    });
    this.allValidSubject.subscribe(status =>{
      if(this.allValid() && status){
        this.validStatus = true;
      } else{
        this.validStatus = false;
      }
    });
  }

  selectItem(item: string){
    this.selectedAnnotation = item;
    this.trackerService.moveName.next(item);
  }

  getValues(){
    let result = this.performerFormGroup.value;
    return result;
  }

  processFormInputs(){
    let result = this.getValues();
    let {performerFromForm, pointsFromForm} = result;
    this.trackerService.performer.next(performerFromForm);
    this.trackerService.points.next(pointsFromForm);
    let remainder = this.performers.filter( function(item){return (item !== performerFromForm);} );
    this.trackerService.recipient.next(remainder[0]);

  }

  allValid(): boolean{
    console.log("allValid called");
    let values = this.performerFormGroup.value;
    console.log("values from allValid");
    console.log(values);
    if(values.performerBound && values.pointsBound >-1 && values.pointsBound < 100){
      console.log("performerBound true");
      return true;
    } else{
      return false;
    }
  }
}
