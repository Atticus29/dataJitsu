import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base/base.component';
import { ApprovalConfig } from '../approvalConfig.model';
import { constants } from '../constants';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends BaseComponent implements OnInit {
  private localWeightClassApprovalConfig: ApprovalConfig = constants.weightClassApprovalConfig;
  private localTournamentNameApprovalConfig: ApprovalConfig = constants.tournamentNameApprovalConfig;
  private localNoGiApprovalConfig: ApprovalConfig = constants.noGiRankApprovalConfig;

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
