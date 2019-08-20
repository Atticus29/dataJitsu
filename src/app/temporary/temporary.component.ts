import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-temporary',
  templateUrl: './temporary.component.html',
  styleUrls: ['./temporary.component.scss']
})
export class TemporaryComponent implements OnInit {
  private displayText: any;

  constructor(private dbService: DatabaseService) { }

  ngOnInit() {
    this.dbService.getMovesAsList().subscribe(results =>{
      // console.log(results);
      this.displayText = results.toString();
    });
  }

}
