import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-temporary',
  templateUrl: './temporary.component.html',
  styleUrls: ['./temporary.component.scss']
})
export class TemporaryComponent extends BaseComponent implements OnInit {
  private displayText: any;

  constructor(private dbService: DatabaseService) {
    super();
  }

  ngOnInit() {
    console.log(this.dbService.db.database);
    this.dbService.getMovesAsList().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      // console.log(results);
      this.displayText = results.toString();
    });
  }

}
