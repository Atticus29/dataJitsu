import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
declare var $:any;

@Component({
  selector: 'app-annotation-display',
  templateUrl: './annotation-display.component.html',
  styleUrls: ['./annotation-display.component.scss']
})
export class AnnotationDisplayComponent implements OnInit {

  constructor(private db: DatabaseService) { }

  ngOnInit() {
    $('.modal').modal();
    this.db.getMoves().subscribe(moves=>{
      console.log(moves);
    });
  }

}
