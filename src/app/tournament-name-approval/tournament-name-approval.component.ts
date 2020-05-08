import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TrackerService } from '../tracker.service';
import { HelperService } from '../helper.service';

@Component({
  selector: 'app-tournament-name-approval',
  templateUrl: './tournament-name-approval.component.html',
  styleUrls: ['./tournament-name-approval.component.scss']
})
export class TournamentNameApprovalComponent extends BaseComponent implements OnInit {
  private localCandidateTournamentNames: any = null;
  private localTournamentNames: any = null;
  private localUser: any = null;
  private localIsAdmin: boolean = false;
  private existingMovesObj: {[k:string]: any} = {};

  constructor(private db: DatabaseService, private trackerService: TrackerService, private helperService: HelperService) {
    super();
  }

  ngOnInit() {
    this.db.getTournamentNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log(results);
      this.localTournamentNames = results;
      // for(let i=0; i<tournamentNames.length; i++){
      //   if(this.helperService.hasSubcategories(categoryNames[i])){
      //     let subcategoryNames = Object.keys(results[categoryNames[i]]);
      //     subcategoryNames.forEach(subcategoryName =>{
      //       results[categoryNames[i]][subcategoryName] = this.helperService.renderFlatStringObjectAsArray(results[categoryNames[i]][subcategoryName]);
      //     })
      //   }else{
      //     const modifiedResults = this.helperService.renderFlatStringObjectAsArray(results[categoryNames[i]]);
      //     results[categoryNames[i]] = modifiedResults
      //   }
      // }
      // this.existingMovesObj = results;
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

    this.db.getCandidateTournamentNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      console.log("results from getCandidateTournamentNames");
      console.log(results);
      this.localCandidateTournamentNames = results;
    });
  }

  approveTournamentName(tournamentMoveName: string){
    let confirmation = confirm("Are you sure you want to APPROVE the tournament name " + tournamentMoveName + "?");
    if(confirmation){
      this.db.addTournamentNameToDb(tournamentMoveName);
      this.db.removeTournamentNameFromCandidateList(tournamentMoveName);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingTournamentName, "You approved tournament name " + tournamentMoveName);
      }
    }
  }

  disapproveTournamentName(tournamentName: string){
    let confirmation = confirm("Are you sure you want to DISAPPROVE the tournament name " + tournamentName + "?");
    if(confirmation){
      this.db.getMatchUrlFromCandidateTournamentName(tournamentName).pipe(takeUntil(this.ngUnsubscribe)).subscribe(urlResult =>{
        this.db.getVideoIdFromVideohUrl(urlResult).pipe(takeUntil(this.ngUnsubscribe)).subscribe(videoIdResult =>{
            this.db.updateTournamentNameInMatch(videoIdResult, constants.tournamentNameRemovedMessage);
        });
      })
      this.db.removeTournamentNameFromCandidateList(tournamentName);
      if(this.localUser){
        this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingTournamentName, "You disapproved tournament name " + tournamentName);
      }
    }
  }

  deleteTournamentName(tournamentName: string){
    let confirmation = confirm("Are you sure you want to delete " +  tournamentName + " from the database?");
    if(confirmation){
        this.db.deleteTournamentName(tournamentName);
    }
  }

}
