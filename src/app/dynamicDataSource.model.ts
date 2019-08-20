import { Injectable } from '@angular/core';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { NestedTreeControl, FlatTreeControl } from '@angular/cdk/tree';

import { DynamicFlatNode } from './dynamicFlatNode.model';
import { DynamicDatabase } from './dynamicDatabase.model';
import { DatabaseService } from './database.service';

import { BehaviorSubject, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';

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

    jsonToStrMap(jsonStr) {
      console.log("Got into jsonToStrMap");
      console.log(jsonStr);
      console.log(Object.entries(jsonStr));
      let map = null;
      try {
        map = new Map(Object.entries(jsonStr));
        // console.log(map);
      }
      catch(error) {
        // console.log("got into error in jsonToStrMap");
        console.error(error);
      }
      // console.log(map);
      return map;
    }

  toggleNode(node: DynamicFlatNode, expand: boolean) {
    node.isLoading = true;
    console.log(node.item);
    this.dbService.getMovesSubsetAsObject(node.item).subscribe(results=>{
      console.log("results in toggleNode getMovesSubsetAsObject call");
      console.log(results);
      let children = null;
      if (Array.isArray(results)) { //results[0] === "string"
        children = results;
      } else{
        try {
          // console.log("results before conversion:");
          // console.log(results);
          results = this.jsonToStrMap(results);
          console.log("jsonToStrMap successful:");
          console.log(results);
          children = results;
        }
        catch(error) {
          console.error(error);
        }
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
          // console.log("expand is true and children is not an array");
          const nodes = Array.from(children).map(name => new DynamicFlatNode(name[0], node.level + 1, true));
          // console.log("node after mapping to dynamicFlatNodes: ");
          // console.log(nodes);
          this.data.splice(index + 1, 0, ...nodes); //this.data.splice(index + 1, 0, ...nodes);
        }
      } else {
        let count = 0;
        for (let i = index + 1; i < this.data.length
          && this.data[i].level > node.level; i++, count++) {}
        this.data.splice(index + 1, count);
      }
      console.log("got to dataChange");
      this.dataChange.next(this.data);
      console.log("got to changing node isLoading to false");
      node.isLoading = false;
    });
    // node.isLoading = true;
  }
}
