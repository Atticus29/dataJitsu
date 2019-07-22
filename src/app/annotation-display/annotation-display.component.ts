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

import { allCurrentMoves } from '../moves';

import { MoveInVideo } from '../moveInVideo.model';

declare var $:any;


/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(public item: string, public level = 1, public expandable = false,
              public isLoading = false) {}
}

/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable()
export class DynamicDatabase {
  constructor(private dbService: DatabaseService){
  }


  dataMap = new Map<string, string[]>([
  ]);

  rootLevelNodes: string[] = [];

  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true, false));
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
/**
 * File database, it can build a tree structured Json object from string.
 * Each node in Json object represents a file or a directory. For a file, it has filename and type.
 * For a directory, it has filename and children (a list of files or directories).
 * The input will be a json object string, and the output is a list of `FileNode` with nested
 * structure.
 */
@Injectable()
export class DynamicDataSource {

  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);
  flatNodeArray: DynamicFlatNode[] = new Array<DynamicFlatNode>();

  constructor(private treeControl: FlatTreeControl<DynamicFlatNode>,
    private database: DynamicDatabase, private dbService: DatabaseService) {
      this.dbService.getMovesAsObject().subscribe(results=>{
        let headers: string[] = Object.getOwnPropertyNames(results);
        headers.forEach(item =>{ //headers
          let newDynamicFlatNode = new DynamicFlatNode(item, 0, true, false);
          this.flatNodeArray.push(newDynamicFlatNode);
        });
        this.dataChange.next(this.flatNodeArray);
      });
    }

  get data(): DynamicFlatNode[] { return this.dataChange.value; }
  set data(value: DynamicFlatNode[]) {
    this.treeControl.dataNodes = value;
    this.dataChange.next(value);
  }


  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this.treeControl.expansionModel.onChange.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added ||
        (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */

   objToStrMap(obj) {
      let strMap = new Map();
      for (let k of Object.keys(obj)) {
          strMap.set(k, obj[k]);
      }
      return strMap;
    }

    jsonToStrMap(jsonStr) {
      return new Map(Object.entries(jsonStr));
    }

   jsonToMap(jsonStr) {
     return new Map(JSON.parse(jsonStr));
   }

  toggleNode(node: DynamicFlatNode, expand: boolean) {
    this.dbService.getMovesSubsetAsObject(node.item).subscribe(results=>{
      let children = null;
      if (Array.isArray(results)) { //results[0] === "string"
        children = results;
      } else{
        results = this.jsonToStrMap(results);
        children = results;
      }
      const index = this.data.indexOf(node);
      if (!children || index < 0) { // If no children, or cannot find the node, no op
        return;
      }
      if (expand) {
        if(Array.isArray(children)){
          const nodes = children.map(name =>
            new DynamicFlatNode(name.toString(), node.level + 1, this.database.isExpandable(name.toString())));
          this.data.splice(index + 1, 0, ...nodes);
        } else{
          const nodes = Array.from(children).map(name =>
            new DynamicFlatNode(name[0], node.level + 1, true));
            this.data.splice(index + 1, 0, ...nodes); //this.data.splice(index + 1, 0, ...nodes);
        }
      } else {
        let count = 0;
        for (let i = index + 1; i < this.data.length
          && this.data[i].level > node.level; i++, count++) {}
        this.data.splice(index + 1, count);
      }
      this.dataChange.next(this.data);
      node.isLoading = false;
    });
    node.isLoading = true;
  }
}

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
