import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

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
  private localCandidateWeightClassNames: any = null;
  private localWeightClassNames: any = null;
  private localUser: any = null;
  private localIsAdmin: boolean = false;
  private localParameterPhrase: string = 'Weight class';

  constructor(private db: DatabaseService, private trackerService: TrackerService, private helperService: HelperService) {
    super();
  }

  ngOnInit() {
    //TODO LEFT OFF HERE CHECKING AND ADDING FEATURE WHERE DISAPPROVED NAME GETS SUBSTITUTED

    this.db.getWeightClasses().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log(results);
      this.localWeightClassNames = results;
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

    this.db.getCandidateWeightClassNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log("results from getCandidateTournamentNames");
      console.log(results);
      this.localCandidateWeightClassNames = results;
    });
  }

  approveName(name: string, metaDataName: string){
    let confirmation = confirm("Are you sure you want to APPROVE the " + metaDataName + " name " + name + "?");
    if(confirmation){
      this.db.addGenericItemToDb('weightClasses',name);
      this.db.removeGenericStringWithOrderByFromDb('/candidateWeightClasses/','name', name);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingWeigthClassName, "You approved " + metaDataName + " name " + name);
      }
    }
  }

  disapproveName(name: string, metaDataName: string){
    let confirmation = confirm("Are you sure you want to DISAPPROVE the " + metaDataName + " name " + name + "?");
    if(confirmation){
      this.db.getMatchUrlFromCandidateTournamentName(name).pipe(takeUntil(this.ngUnsubscribe)).subscribe(urlResult =>{
        this.db.getMatchIdFromMatchUrl(urlResult).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchIdResult =>{
            this.db.updateTournamentNameInMatch(matchIdResult, constants.tournamentNameRemovedMessage);
        });
      })
      this.db.removeGenericStringWithOrderByFromDb('/candidateWeightClasses', 'name', name);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingWeigthClassName, "You disapproved " + metaDataName + " name " + name);
      }
    }
  }

  deleteName(name: string, metaDataName: string){
    let confirmation = confirm("Are you sure you want to delete "+ metaDataName + " " + name + " from the database?");
    if(confirmation){
        this.db.deleteGenericString('weightClasses',name);
    }
  }


}
