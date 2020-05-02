//NOTE TODO future somehow figure out constructor stuff so that you can actually make this an inherited class rather than just a template

import { Component, OnInit, Input } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
// import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TrackerService } from '../tracker.service';
import { HelperService } from '../helper.service';
import { ApprovalConfig } from '../approvalConfig.model';

@Component({
  selector: 'app-base-approval',
  templateUrl: './base-approval.component.html',
  styleUrls: ['./base-approval.component.scss']
})
export class BaseApprovalComponent extends BaseComponent implements OnInit {
  private localUser: any = null;
  public localIsAdmin: boolean = false;


  @Input('approvalConfig') approvalConfig: ApprovalConfig;

  constructor(private db: DatabaseService, private trackerService: TrackerService, private helperService: HelperService) {
    super();
  }

  ngOnInit() {
    this.db.getGenericApprovedList(this.approvalConfig.localApprovedListPath).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log("entered getGenericApprovedList");
      console.log(results);
      this.approvalConfig.localApprovedNames = results;
    });

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user =>{
      if(user){
        this.localUser = user;
        this.db.getUserByUid(user.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(dbUser =>{
          if(dbUser.privileges.isAdmin){
            this.localIsAdmin = true;
          } else{
            this.localIsAdmin = false;
          }
        });
      }
    });

    this.db.getGenericCandidateNames(this.approvalConfig.candidatePath,'name').pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log("results from getGenericCandidateNames");
      console.log(results);
      this.approvalConfig.localCandidateNames = results;
    });
  }

  approveName(name: string, metaDataName: string){
    console.log("approveName entered");
    console.log(name);
    console.log(metaDataName);
    console.log(this.approvalConfig);
    let confirmation = confirm("Are you sure you want to APPROVE the " + metaDataName + " name " + name + "?");
    if(confirmation){
      this.db.addGenericItemToDb(this.approvalConfig.localApprovedListPath, name);
      this.db.removeGenericStringWithOrderByFromDb(this.approvalConfig.candidatePath,'name', name);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, this.approvalConfig.localApprovalAndDisapprovalPoints, "You approved " + metaDataName + " name " + name);
      }
    }
  }

  disapproveName(name: string, metaDataName: string){
    let confirmation = confirm("Are you sure you want to DISAPPROVE the " + metaDataName + " name " + name + "?");
    if(confirmation){
      this.db.getMatchUrlFromGenericCandidateName(this.approvalConfig.candidatePath, 'name', name).pipe(takeUntil(this.ngUnsubscribe)).subscribe(urlResult =>{
        this.db.getMatchIdFromMatchUrl(urlResult).pipe(takeUntil(this.ngUnsubscribe)).subscribe(videoIdResult =>{
          console.log("getMatchIdFromMatchUrl from disapproveName is " + videoIdResult);
          this.db.updateGenericNameInMatch(this.approvalConfig.localSubPathToMatchParameter,videoIdResult, this.approvalConfig.localReplacementText);
        });
      })
      this.db.removeGenericStringWithOrderByFromDb(this.approvalConfig.candidatePath, 'name', name);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, this.approvalConfig.localApprovalAndDisapprovalPoints, "You disapproved " + metaDataName + " name " + name);
      }
    }
  }

  deleteName(name: string, metaDataName: string){
    let confirmation = confirm("Are you sure you want to delete "+ metaDataName + " " + name + " from the database?");
    if(confirmation){
        this.db.deleteGenericString(this.approvalConfig.localApprovedListPath, name);
    }
  }


}
