import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs/Subject';
declare var $:any;

@Component({
  selector: 'app-annotation-display',
  templateUrl: './annotation-display.component.html',
  styleUrls: ['./annotation-display.component.scss']
})
export class AnnotationDisplayComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private db: DatabaseService) { }

  ngOnInit() {
    $('.modal').modal();
    let results = this.db.getMoves().subscribe(stuff=>{
      console.log(Object.keys(stuff));
      for(let index in stuff){
      // console.log(stuff[index].key());
    }
    });
  }
}
