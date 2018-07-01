import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs/Subject';
import { TextTransformationService } from '../text-transformation.service';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
declare var $:any;

@Component({
  selector: 'app-annotation-display',
  templateUrl: './annotation-display.component.html',
  styleUrls: ['./annotation-display.component.scss']
})
export class AnnotationDisplayComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moveCategories: string[];
  constructor(private db: DatabaseService, textTransformationService: TextTransformationService) { }

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
