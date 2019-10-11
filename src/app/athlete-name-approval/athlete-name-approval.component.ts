import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-athlete-name-approval',
  templateUrl: './athlete-name-approval.component.html',
  styleUrls: ['./athlete-name-approval.component.scss']
})
export class AthleteNameApprovalComponent extends BaseComponent implements OnInit {
  private localCandidateAthleteNames: any = null;
  private localAtheleteNames: any = null;

  constructor(private db: DatabaseService) {
    super();
  }

  ngOnInit() {
    this.db.getCandidateAthleteNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log("candidate name db results");
      console.log(results);
      this.localCandidateAthleteNames = results;
    });
    this.db.getAthleteNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      // console.log(results);
      this.localAtheleteNames = results;
    });
  }

}
