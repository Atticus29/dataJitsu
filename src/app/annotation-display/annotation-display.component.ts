import { Injectable, Component, OnInit, EventEmitter, Output } from '@angular/core';

import {MatTreeNestedDataSource, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { MatIconModule } from '@angular/material';
import {NestedTreeControl, FlatTreeControl} from '@angular/cdk/tree';
import {CollectionViewer, SelectionChange} from '@angular/cdk/collections';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from 'angularfire2/database';

import { Subject, of, BehaviorSubject, Observable, merge } from 'rxjs';
import {map} from 'rxjs/operators';

import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';

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
    // this.dbService.getMoves().subscribe(results=>{
    //   console.log("this happens");
    //   let jsonStuff = JSON.stringify(results);
    //   this.dataChange.next(jsonStuff);
    //   console.log(jsonStuff);
    // });
  }
  // let testService: DatabaseService = new DatabaseService(new AngularFireDatabase(), new TextTransformationService());


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
        console.log("this happens");
        console.log(results);
        // let newTreeResults = this.jsonToMap(results);
        // this.dataChange.next(newTreeResults);
        let headers: string[] = Object.getOwnPropertyNames(results);
        headers.forEach(item =>{ //headers
          let newDynamicFlatNode = new DynamicFlatNode(item, 0, true, false);
          this.flatNodeArray.push(newDynamicFlatNode);
        });
        console.log(this.flatNodeArray);
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
      console.log("handleTreeControl hits change added");
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      console.log("handleTreeControl hits change removed");
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
      // return Array.from(jsonStr).map(entry => {});
      // return this.objToStrMap(JSON.parse(jsonStr));
    }

   jsonToMap(jsonStr) {
     return new Map(JSON.parse(jsonStr));
   }

  toggleNode(node: DynamicFlatNode, expand: boolean) {
    console.log("toggleNode hit");
    console.log("toggleNode node is " + node.item);
    // if(node.level === 1){
    //
    // }
    this.dbService.getMovesSubsetAsObject(node.item).subscribe(results=>{
      // console.log("look here");
      console.log("before");
      console.log(results);
      // console.log(JSON.stringify(results));
      let children = null;
      if (Array.isArray(results)) { //results[0] === "string"
        console.log("Got an Array");
        children = results;
        console.log("after");
        console.log(children);
      } else{
        results = this.jsonToStrMap(results);
        console.log("after");
        children = results;
        console.log(children);
        // console.log("this should no longer happen");
        // let objHeaders: string[] = Object.getOwnPropertyNames(results);
        // children = objHeaders;
        // // let flatNodeArray: DynamicFlatNode[] = new Array<DynamicFlatNode>();
        // results.forEach(item =>{
        //   let newDynamicFlatNode = new DynamicFlatNode(item, 2, true, false);
        //   this.flatNodeArray.push(newDynamicFlatNode);
        // });
      }
      // this.dataChange.next(children); //this.flatNodeArray
      console.log(children);
      console.log("node is ");
      console.log(node);
      const index = this.data.indexOf(node);
      if (!children || index < 0) { // If no children, or cannot find the node, no op
        return;
      }
      if (expand) {
        console.log("expand is true!");
        console.log("children before the map function: ");
        console.log(children);
        if(Array.isArray(children)){
          console.log("children is array");
          const nodes = children.map(name =>
            new DynamicFlatNode(name.toString(), node.level + 1, this.database.isExpandable(name.toString())));
          console.log(...nodes);
          this.data.splice(index + 1, 0, ...nodes);
        } else{
          //TODO if it's already a map, what do I do? LEFT OFF HERE
          console.log("children is not array");
          // let objHeaders: string[] = children.keys();
          // console.log("headers");
          // console.log(objHeaders);
          // console.log("nodes before map function");
          // console.log(nodes);
          console.log("here");
          console.log(Array.from(children));
          const nodes = Array.from(children).map(name =>
            new DynamicFlatNode(name[0], node.level + 1, true));
          // const nodes = Array.from(children).map(child => {
          //   console.log(child[0]);
          //   console.log(node.level);
          //   new DynamicFlatNode(child[0].toString(), 1, true); //.toString() //this.database.isExpandable(name)
          //   // child[1].forEach(entry =>{
          //   //   new DynamicFlatNode(entry, 2, false);
          //   // });
          // });
          // const moreNodes = Array.from(children).map(child =>{
          //   child[1].forEach(entry =>{
          //     new DynamicFlatNode(entry, node.level + 2, false);
          //   });
          // });
          // nodes.push(moreNodes);
          //Array.from(children)
            console.log("nodes after map function");
            console.log(nodes);
            console.log("nodes collapsed");
            console.log(...nodes);
            console.log("data before");
            console.log(this.data);
            this.data.splice(index + 1, 0, ...nodes); //this.data.splice(index + 1, 0, ...nodes);
            // this.data.splice(index + 1, 0, Array.from(children));
            console.log("data after");
            console.log(this.data);
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

    // setTimeout(() => {
    //   if (expand) {
    //     const nodes = children.map(name =>
    //       new DynamicFlatNode(name, node.level + 1, this.database.isExpandable(name)));
    //     this.data.splice(index + 1, 0, ...nodes);
    //   } else {
    //     let count = 0;
    //     for (let i = index + 1; i < this.data.length
    //       && this.data[i].level > node.level; i++, count++) {}
    //     this.data.splice(index + 1, count);
    //   }
    //
    //   // notify the change
    //   this.dataChange.next(this.data);
    //   node.isLoading = false;
    // }, 1000);
  }
}

@Component({
  selector: 'app-annotation-display',
  templateUrl: './annotation-display.component.html',
  styleUrls: ['./annotation-display.component.scss'],
  providers: [DynamicDatabase]
})
export class AnnotationDisplayComponent implements OnInit {
  // private treeData = JSON.stringify(allCurrentMoves);
  @Output() moveSelected = new EventEmitter<MoveInVideo>();

  treeControl: FlatTreeControl<DynamicFlatNode>;
  dataSource: DynamicDataSource;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moveCategories: string[];
  isExpandable = (node: DynamicFlatNode) => node.expandable;
  hasChild = (_: number, _nodeData: DynamicFlatNode) => _nodeData.expandable;
  getLevel = (node: DynamicFlatNode) => node.level;

  constructor(private db: DatabaseService, textTransformationService: TextTransformationService, database: DynamicDatabase) {
    //TODO fix this after mat-tree SO branch gets resolved
    this.treeControl = new FlatTreeControl<DynamicFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new DynamicDataSource(this.treeControl, database, this.db);

    this.dataSource.data = database.initialData();

    // database.dataChange.subscribe(data =>{
    //   this.nestedDataSource.data = data;
    // });
  }

  ngOnInit() {
    $('.modal').modal();
    let categories = this.db.getMovesKeys().subscribe(results=>{
      this.moveCategories = results;
    });
    let results = this.db.getMoves().subscribe(stuff=>{
      // console.log(stuff);
      for(let index in stuff){
      // console.log(stuff[index].key());
    }
    });
  }

  submitFormAndClose(){
    console.log("got to submitFormAndClose");
    //TODO createMoveInVideo from form submission
    let tempMove = new MoveInVideo('0', 'armbar', 'me', 'you', 1, 2, 0, '12345', true);
    this.moveSelected.emit(tempMove);
    //TODO add some way to resume the youtube player from here...
  }

  selectItem(item: string){
    console.log("clicked!" + item);
  }
}
