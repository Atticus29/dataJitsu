import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TrackerService } from '../tracker.service';
import { HelperService } from '../helper.service';

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
  private localCategoryHasSubcategory: boolean = false;
  private localSubcategories: string[] = null;
  private subcategories: string[] = constants.subCategories;

  constructor(private db: DatabaseService, private trackerService: TrackerService, private helperService: HelperService) {
    super();
  }

  ngOnInit() {
    this.localSubcategories = constants.subCategories; //hacky because I don't want to deal with async for this silly thing
    // this.db.getMoveNamesFromCategory("Submissions or Submission Attempts/Elbow").pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
    //   console.log("elbow");
    //   console.log(results);
    //   console.log(this.helperService.hasSubcategories(results));
    // });
    // this.db.getMoveNamesFromCategory("Submissions or Submission Attempts").pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
    //   console.log(results);
    //   console.log(this.helperService.hasSubcategories(results));
    // });
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

      // console.log(this.localCandidateMoves[0].moveCategory);
    });

    constants.rootNodes.forEach(category =>{

      // console.log("category is: " + category);
      // console.log("has subcategory?");
      // console.log(this.helperService.hasSubcategories(category));
      this.db.getMoveNamesFromCategory(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
        console.log(results);
        if(this.helperService.hasSubcategories(results)){
          // this.localCategoryHasSubcategory = true;
          // this.localSubcategories = constants.subCategories; //hacky because I don't want to deal with async for this silly thing

          // this.db.getMovesSubsetAsObject(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
          //   // console.log("results in getMovesSubsetAsObject call in move-name-approval: ");
          //   // console.log(Object.keys(result));
          //   this.localSubcategories = Object.keys(result);
          //   //TODO flesh out
          // });
        }else {
          this.existingMovesObj[category] = results;
          // this.localCategoryHasSubcategory = false;
        }
        // console.log("getMoveNamesFromCategory results:");
        // console.log(results);
      });
      // console.log("existingMovesObj: ");
      // console.log(this.existingMovesObj);
    });
  }

    approveMove(moveName: string, categoryName: string){
      // console.log("approve clicked " + move);
      let confirmation = confirm("Are you sure you want to APPROVE this move?");
      if(confirmation){
        this.db.addMoveNameToDb(moveName, categoryName);
        this.db.removeMoveNameFromCandidateList(moveName);
        if(this.localUser){
          // console.log(this.localUser.id);
          // console.log(constants.numberOfPointsToAwardForApprovingMoveName);
          this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingMoveName);
        }
      }
    }

    disapproveMove(move: string){
      // console.log("disapprove clicked " + move);
      let confirmation = confirm("Are you sure you want to DISAPPROVE this move?");
      if(confirmation){
        this.db.getMatchUrlFromCandidateMoveName(move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(urlResult =>{
          // console.log(urlResult);
          this.db.getMatchIdFromMatchUrl(urlResult).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchIdResult =>{
            this.db.getMoveIdFromMatchId(matchIdResult, move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveIdResult =>{
              // console.log("moveIdResult: " + moveIdResult);
              this.db.updateMoveNameInMatch(matchIdResult, moveIdResult, move, "Move name has been removed; flag me");
            });
          });
        })
        this.db.removeMoveNameFromCandidateList(move);
        if(this.localUser){
          // console.log(this.localUser);
          // console.log(this.localUser.id);
          // console.log(constants.numberOfPointsToAwardForApprovingMoveName);
          // console.log(constants.numberOfPointsToAwardForApprovingMoveName);
          this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingMoveName);
        }
      }
    }

    deleteMoveName(move: string, category: string){
      // console.log("deleteMoveName clicked! Name is " + move + " and category is " + category);
      let confirmation = confirm("Are you sure you want to delete " + move + " from the database?");
      if(confirmation){
        this.db.getSubcategoryFromMoveAndCategory(category, move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
          // console.log("result from getSubcategoryFromMoveAndCategory call: ");
          // console.log(result);
          // this.db.deleteMoveName(move, category, result);
        });
      }
    }
}
