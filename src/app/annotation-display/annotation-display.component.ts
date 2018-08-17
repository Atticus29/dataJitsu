import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs';
import { TextTransformationService } from '../text-transformation.service';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import { allCurrentMoves } from '../moves';
declare var $:any;

export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

@Component({
  selector: 'app-annotation-display',
  templateUrl: './annotation-display.component.html',
  styleUrls: ['./annotation-display.component.scss']
})
export class AnnotationDisplayComponent implements OnInit {
  private treeData = JSON.stringify(allCurrentMoves);
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moveCategories: string[];
  constructor(private db: DatabaseService, textTransformationService: TextTransformationService) {
    //TODO fix this after mat-tree SO branch gets resolved
    // this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    // this.nestedDataSource = new MatTreeNestedDataSource();
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
}
