import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'app-athlete-name-approval',
  templateUrl: './athlete-name-approval.component.html',
  styleUrls: ['./athlete-name-approval.component.scss']
})
export class AthleteNameApprovalComponent extends BaseComponent implements OnInit {
  private localCandidateAthleteNames: any = null;
  private localAtheleteNames: any = null;
  private localUser: any = null;
  private localIsAdmin: boolean = false;

  constructor(private db: DatabaseService, private trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
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
    // let candidateNames = await this.db.getCandidateAthleteNames();
    this.db.getCandidateAthleteNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      // console.log(  "candidate name db results");
      // console.log(results);
      this.localCandidateAthleteNames = results.sort();
    });
    this.db.getIndividualNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      // console.log("athlete names db results");
      // console.log(results);
      this.localAtheleteNames = results.sort();
    });
  }

  approveName(name: string){
    // console.log("approve clicked " + name);
    let confirmation = confirm("Are you sure you want to APPROVE the name " + name + "?");
    if(confirmation){
      this.db.addAthleteNameToDb(name);
      this.db.removeAthleteNameFromCandidateList(name);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingCandidateAthleteName, "You approved candidate athlete name " + name);
      }
    }
  }

  disapproveName(name: string){
    // console.log("disapprove clicked " + name);
    let confirmation = confirm("Are you sure you want to DISAPPROVE the name " + name + "?");
    if(confirmation){
      this.db.getMatchUrlFromCandidateAthleteName(name).pipe(takeUntil(this.ngUnsubscribe)).subscribe(urlResult =>{
        console.log(urlResult);
        this.db.getVideoIdFromVideohUrl(urlResult).pipe(takeUntil(this.ngUnsubscribe)).subscribe(videoIdResult =>{
          this.db.updateAthleteNameInMatch(videoIdResult, name, "Un-named Athlete");
        });
      })
      this.db.removeAthleteNameFromCandidateList(name);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingCandidateAthleteName, "You disapproved candidate athlete name " + name)
      }
    }
  }

  deleteAthleteName(name: string){
    console.log("deleteAthleteName clicked! Name is " + name);
    let confirmation = confirm("Are you sure you want to delete " + name + " from the database?");
    if(confirmation){
      this.db.deleteAthleteName(name);
    }
  }

}
