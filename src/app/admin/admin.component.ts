import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "../base/base.component";
import { ApprovalConfig } from "../approvalConfig.model";
import { constants } from "../constants";

import { TrackerService } from "../tracker.service";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent extends BaseComponent implements OnInit {
  public localWeightClassApprovalConfig: ApprovalConfig =
    constants.weightClassApprovalConfig;
  public localTournamentNameApprovalConfig: ApprovalConfig =
    constants.tournamentNameApprovalConfig;
  public localNoGiApprovalConfig: ApprovalConfig =
    constants.noGiRankApprovalConfig;
  public localAgeClassApprovalConfig: ApprovalConfig =
    constants.ageClassApprovalConfig;
  public localLocationNameApprovalConfig: ApprovalConfig =
    constants.locationNameApprovalConfig;
  public localGymAffiliationApprovalConfig: ApprovalConfig =
    constants.gymAffiliationApprovalConfig;
  public localIsAdmin: boolean = false;

  constructor(public trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    this.trackerService.currentUserBehaviorSubject
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        if (user && user.uid && user.privileges && user.privileges.isAdmin) {
          this.localIsAdmin = true;
        }
      });
  }
}
