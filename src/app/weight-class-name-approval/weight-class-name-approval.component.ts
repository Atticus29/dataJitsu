import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
// import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TrackerService } from '../tracker.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-weight-class-name-approval',
  templateUrl: './weight-class-name-approval.component.html',
  styleUrls: ['./weight-class-name-approval.component.scss']
})
export class WeightClassNameApprovalComponent extends BaseComponent implements OnInit {
  private localCandidateNames: any = null;
  private localApprovedNames: any = null;
  private localUser: any = null;
  private localIsAdmin: boolean = false;
  private localParameterPhrase: string = 'Weight class';
  private localApprovalAndDisapprovalPhrase: string = 'weight class';
  private localReplacementText: string = constants.weightClassRemovedMessage;
  private localApprovalAndDisapprovalPoints: number = constants.numberOfPointsToAwardForApprovingWeigthClassName;
  private localSubPathToMatchParameter: string = 'videoDeets/weightClass';
  private localApprovedListPath: string = '/weightClasses';
  private candidatePath: string = '/candidateWeightClasses';

  constructor(private db: DatabaseService, private trackerService: TrackerService, private helperService: HelperService) {
    super();
  }

  ngOnInit() {
    this.db.getGenericApprovedList(this.localApprovedListPath).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log("entered getGenericApprovedList");
      console.log(results);
      this.localApprovedNames = results;
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

    this.db.getGenericCandidateNames(this.candidatePath,'name').pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log("results from getGenericCandidateNames");
      console.log(results);
      this.localCandidateNames = results;
    });
  }

  approveName(name: string, metaDataName: string){
    let confirmation = confirm("Are you sure you want to APPROVE the " + metaDataName + " name " + name + "?");
    if(confirmation){
      this.db.addGenericItemToDb(this.localApprovedListPath, name);
      this.db.removeGenericStringWithOrderByFromDb(this.candidatePath,'name', name);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, this.localApprovalAndDisapprovalPoints, "You approved " + metaDataName + " name " + name);
      }
    }
  }

  disapproveName(name: string, metaDataName: string){
    let confirmation = confirm("Are you sure you want to DISAPPROVE the " + metaDataName + " name " + name + "?");
    if(confirmation){
      this.db.getMatchUrlFromGenericCandidateName(this.candidatePath, 'name', name).pipe(takeUntil(this.ngUnsubscribe)).subscribe(urlResult =>{
        this.db.getMatchIdFromMatchUrl(urlResult).pipe(takeUntil(this.ngUnsubscribe)).subscribe(videoIdResult =>{
          console.log("getMatchIdFromMatchUrl from disapproveName is " + videoIdResult);
          this.db.updateGenericNameInMatch(this.localSubPathToMatchParameter,videoIdResult, this.localReplacementText);
        });
      })
      this.db.removeGenericStringWithOrderByFromDb(this.candidatePath, 'name', name);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, this.localApprovalAndDisapprovalPoints, "You disapproved " + metaDataName + " name " + name);
      }
    }
  }

  deleteName(name: string, metaDataName: string){
    let confirmation = confirm("Are you sure you want to delete "+ metaDataName + " " + name + " from the database?");
    if(confirmation){
        this.db.deleteGenericString(this.localApprovedListPath, name);
    }
  }


}
