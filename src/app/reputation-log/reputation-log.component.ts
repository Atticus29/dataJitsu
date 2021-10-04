import { Component, OnInit } from "@angular/core";

import { ActivatedRoute, Params, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";

import { BaseComponent } from "../base/base.component";
import { TextTransformationService } from "../text-transformation.service";
import { ReputationLog } from "../reputationLog.model";
import { DatabaseService } from "../database.service";

@Component({
  selector: "app-reputation-log",
  templateUrl: "./reputation-log.component.html",
  styleUrls: ["./reputation-log.component.scss"],
})
export class ReputationLogComponent extends BaseComponent implements OnInit {
  private logEntries: Array<ReputationLog> = null;
  private userDbId: string = null;

  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService,
    private textTransformationService: TextTransformationService
  ) {
    super();
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.userDbId = params["userId"];
        this.db
          .getUserReputationLogs(this.userDbId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((results) => {
            console.log("deleteMe results in reputation log:");
            console.log(results);
            if (results) {
              this.logEntries = Object.values(results);
              console.log(this.logEntries);
            }
          });
      });
  }
}
