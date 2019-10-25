import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'app-move-name-approval',
  templateUrl: './move-name-approval.component.html',
  styleUrls: ['./move-name-approval.component.scss']
})
export class MoveNameApprovalComponent extends BaseComponent implements OnInit {
  private localCandidateMoves: any = null;
  private localMoveNames: any = null;
  private localUser: any = null;
  private localIsAdmin: boolean = false;
  private localCategoryNames: string[] = constants.rootNodes;
  private existingMovesObj: {[k:string]: any} = {};

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

    this.db.getCandidateMoves().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      // console.log("candidate move  db results");
      // console.log(results);
      // if(Object.keys(results).length == constants.rootNodes.length){
      let resultArray = Object.keys(results).map(function(candidateMovesObjIndex){
          let singleCandidateMoveObj = results[candidateMovesObjIndex];
          return singleCandidateMoveObj;
      });
      // console.log(resultArray);
      // }
      this.localCandidateMoves = resultArray;
      console.log(this.localCandidateMoves[0].moveCategory);
    });

    constants.rootNodes.forEach(category =>{
      // console.log("category is: " + category);
      this.db.getMoveNamesFromCategory(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
        this.existingMovesObj[category] = results;
        // console.log("getMoveNamesFromCategory results:");
        // console.log(results);
      });
      // console.log("existingMovesObj: ");
      // console.log(this.existingMovesObj);
    });
  }

    approveMove(move: string, categoryName: string){
      // console.log("approve clicked " + move);
      let confirmation = confirm("Are you sure you want to APPROVE this move?");
      if(confirmation){
        this.db.addMoveNameToDb(move, categoryName);
        this.db.removeMoveNameFromCandidateList(move);
        if(this.localUser){
          this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingMoveName)
        }
      }
    }

    disapproveMove(move: string){
      // console.log("disapprove clicked " + move);
      let confirmation = confirm("Are you sure you want to DISAPPROVE this move?");
      if(confirmation){
        this.db.getMatchUrlFromCandidateMoveName(move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(urlResult =>{
          console.log(urlResult);
          this.db.getMatchIdFromMatchUrl(urlResult).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchIdResult =>{
            //TODO get moveId
            this.db.updateMoveNameInMatch(matchIdResult, moveId, move, "Move name has been removed; flag me");
          });
        })
        this.db.removeMoveNameFromCandidateList(move);
        if(this.localUser){
          this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingMoveName)
        }
        //TODO remove athlete name from matches in database and remove from candidates
        //award points to current user for flagging
      }
    }

    deleteMoveName(move: string, category: string){
      //TODO moveCategory exists in front end; currently, not implemented how to get it
      console.log("deleteMoveName clicked! Name is " + move);
      let confirmation = confirm("Are you sure you want to delete " + move + " from the database?");
      if(confirmation){
        this.db.deleteMoveName(move, category);
      }
    }

}
