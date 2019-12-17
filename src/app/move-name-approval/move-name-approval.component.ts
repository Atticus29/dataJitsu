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
  private localSubcategories: string[] = constants.subCategories;;
  private subcategories: string[] = constants.subCategories;

  constructor(private db: DatabaseService, private trackerService: TrackerService, private helperService: HelperService) {
    super();
  }

  ngOnInit() {
    this.db.getMoves().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      const categoryNames = Object.keys(results);
      this.localCategoryNames = categoryNames;
      for(let i=0; i<categoryNames.length; i++){
        if(this.helperService.hasSubcategories(categoryNames[i])){
          let subcategoryNames = Object.keys(results[categoryNames[i]]);
          subcategoryNames.forEach(subcategoryName =>{
            results[categoryNames[i]][subcategoryName] = this.helperService.renderFlatStringObjectAsArray(results[categoryNames[i]][subcategoryName]);
          })
        }else{
          const modifiedResults = this.helperService.renderFlatStringObjectAsArray(results[categoryNames[i]]);
          results[categoryNames[i]] = modifiedResults
        }
      }
      this.existingMovesObj = results;
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

    this.db.getCandidateMoves().pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
      let resultArray = Object.keys(results).map(function(candidateMovesObjIndex){
          let singleCandidateMoveObj = results[candidateMovesObjIndex];
          return singleCandidateMoveObj;
      });
      this.localCandidateMoves = resultArray;
    });
  }

    approveMove(moveName: string, categoryName: string, subcategoryName: string){
      let confirmation = confirm("Are you sure you want to APPROVE this move?");
      if(confirmation){
        this.db.addMoveNameToDb(moveName, categoryName, subcategoryName);
        this.db.removeMoveNameFromCandidateList(moveName);
        if(this.localUser){
          this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingMoveName);
        }
      }
    }

    disapproveMove(move: string){
      let confirmation = confirm("Are you sure you want to DISAPPROVE this move?");
      if(confirmation){
        this.db.getMatchUrlFromCandidateMoveName(move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(urlResult =>{
          this.db.getMatchIdFromMatchUrl(urlResult).pipe(takeUntil(this.ngUnsubscribe)).subscribe(matchIdResult =>{
            this.db.getMoveIdFromMatchId(matchIdResult, move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(moveIdResult =>{
              this.db.updateMoveNameInMatch(matchIdResult, moveIdResult, move, constants.moveNameRemovedMessage);
            });
          });
        })
        this.db.removeMoveNameFromCandidateList(move);
        if(this.localUser){
          this.db.updateUserReputationPoints(this.localUser.id, constants.numberOfPointsToAwardForApprovingMoveName);
        }
      }
    }

    deleteMoveName(move: string, category: string){
      let confirmation = confirm("Are you sure you want to delete " + move + " from the database?");
      if(confirmation){
        this.db.getSubcategoryFromMoveAndCategory(category, move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(subcategory =>{
          this.db.deleteMoveName(move, category, subcategory);
        });
      }
    }
}
