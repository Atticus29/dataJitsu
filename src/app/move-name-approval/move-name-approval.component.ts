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
      // console.log("whole object at once:")
      console.log(results);
      const categoryNames = Object.keys(results);
      this.localCategoryNames = categoryNames;
      // console.log(categoryNames);
      for(let i=0; i<categoryNames.length; i++){
        if(this.helperService.hasSubcategories(categoryNames[i])){
          console.log(categoryNames[i]+ " has subcategories");
        }else{
          console.log(categoryNames[i]+ " does not have subcategories");
          const modifiedResults = this.helperService.renderFlatStringObjectAsArray(results[categoryNames[i]]);
          results[categoryNames[i]] = modifiedResults
        }
      }
      this.existingMovesObj = results;
    });

    // this.localSubcategories = constants.subCategories; //hacky because I don't want to deal with async for this silly thing
    // this.db.getSubcategoryFromMoveAndCategory("Submissions or Submission Attempts", "Biceps Slicer").pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
    //   console.log("result from getSubcategoryFromMoveAndCategory: ");
    //   console.log(result);
    // });
    // this.db.getSubcategoryFromMoveAndCategory("Advantage", "Advantage Awarded").pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
    //   console.log("result from getSubcategoryFromMoveAndCategory, expecting nothing: ");
    //   console.log(result);
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

    // constants.rootNodes.forEach(category =>{
    //   // console.log("category is: " + category);
    //   // console.log("has subcategory?");
    //   // console.log(this.helperService.hasSubcategories(category));
    //   this.db.getMoveNamesFromCategory(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe(results =>{
    //     // console.log(results);
    //     if(this.helperService.hasSubcategories(results)){
    //       // this.localSubcategories = constants.subCategories; //hacky because I don't want to deal with async for this silly thing
    //       this.existingMovesObj[category] = constants.subCategories.reduce((a,b)=> (a[b]='',a),{});
    //       // console.log(this.existingMovesObj[category]);
    //       this.localSubcategories.forEach(subcategory =>{
    //         this.db.getMovesSubsetAsObject(subcategory).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
    //           // console.log(result)
    //           if(Array.isArray(result)){
    //             // console.log("array happens");
    //             // console.log(this.existingMovesObj);
    //             // console.log(result);
    //             this.existingMovesObj[category][subcategory] = result;
    //           } else{
    //             // console.log("object happens");
    //             // console.log(this.existingMovesObj);
    //             // console.log(result);
    //             // console.log(Object.values(result));
    //             this.existingMovesObj[category][subcategory] = Object.values(result);
    //           }
    //         });
    //       });
    //       // console.log(this.existingMovesObj);
    //     }else {
    //       // console.log("non subcategory results: ");
    //       // console.log(results);
    //       this.existingMovesObj[category] = results;
    //     }
    //   });
    //   // console.log(this.existingMovesObj); //omg if this console log is missing, sometimes this.existingMovesObj comes out different
    // });
  }

    approveMove(moveName: string, categoryName: string, subcategoryName: string){
      console.log("approve clicked! moveName: + " + moveName + ", categoryName: " + categoryName + ", subcategoryName: " + subcategoryName);
      let confirmation = confirm("Are you sure you want to APPROVE this move?");
      if(confirmation){
        this.db.addMoveNameToDb(moveName, categoryName, subcategoryName);
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
              this.db.updateMoveNameInMatch(matchIdResult, moveIdResult, move, constants.moveNameRemovedMessage);
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
        this.db.getSubcategoryFromMoveAndCategory(category, move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(subcategory =>{
          console.log("result from getSubcategoryFromMoveAndCategory call: ");
          console.log(subcategory);
          this.db.deleteMoveName(move, category, subcategory);
        });
      }
    }
}
