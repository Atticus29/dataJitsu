import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TrackerService } from "app/tracker.service";
import { takeUntil } from "rxjs/operators";
import { constants } from "../constants";

import { BaseComponent } from "../base/base.component";

@Component({
  selector: "app-user-info",
  templateUrl: "./user-info.component.html",
  styleUrls: ["./user-info.component.scss"],
})
export class UserInfoComponent extends BaseComponent implements OnInit {
  public userDbId: string = null;
  constructor(
    public route: ActivatedRoute,
    public trackerService: TrackerService
  ) {
    super();
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.userDbId = params["userId"];
      });
  }
}
