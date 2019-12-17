import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';
import { ReputationLog } from '../reputationLog.model';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent extends BaseComponent implements OnInit {
  private userDbId: string = null;
  private logEntries: Array<ReputationLog> = null;

  constructor(private route: ActivatedRoute, private db: DatabaseService, private textTransformationService: TextTransformationService) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      this.userDbId = params['userId'];
      this.db.getUserReputationLogs(this.userDbId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results => {
        this.logEntries = Object.values(results);
        console.log(this.logEntries);
      });
    });

  }

}
