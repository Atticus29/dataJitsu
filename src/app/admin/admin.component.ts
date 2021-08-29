import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ApprovalConfig } from '../approvalConfig.model';
import { constants } from '../constants';

import { TrackerService } from '../tracker.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends BaseComponent implements OnInit {
  private localWeightClassApprovalConfig: ApprovalConfig = constants.weightClassApprovalConfig;
  private localTournamentNameApprovalConfig: ApprovalConfig = constants.tournamentNameApprovalConfig;
  private localNoGiApprovalConfig: ApprovalConfig = constants.noGiRankApprovalConfig;
  private localAgeClassApprovalConfig: ApprovalConfig = constants.ageClassApprovalConfig;
  private localLocationNameApprovalConfig: ApprovalConfig = constants.locationNameApprovalConfig;
  private localGymAffiliationApprovalConfig: ApprovalConfig = constants.gymAffiliationApprovalConfig;
  private localIsAdmin: boolean = false;

  constructor(private trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      console.log('deleteMe local user result is: ');
      console.log(user);
      if (user && user.uid && user.privileges && user.privileges.isAdmin) {
        this.localIsAdmin = true;
      }

    });

  }

}
