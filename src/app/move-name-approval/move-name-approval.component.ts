import { Component, OnInit } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { Subject, Observable, BehaviorSubject } from "rxjs";

import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { constants } from "../constants";
import { TrackerService } from "../tracker.service";
import { HelperService } from "../helper.service";

@Component({
  selector: "app-move-name-approval",
  templateUrl: "./move-name-approval.component.html",
  styleUrls: ["./move-name-approval.component.scss"],
})
export class MoveNameApprovalComponent extends BaseComponent implements OnInit {
  public localCandidateMoves: any = null;
  public localMoveNames: any = null;
  public localUser: any = null;
  public localIsAdmin: boolean = false;
  public localCategoryNames: string[] = constants.rootNodes;
  public existingMovesObj: { [k: string]: any } = {};
  public localCategoryHasSubcategory: boolean = false;
  public localSubcategories: string[] = constants.subCategories;
  public subcategories: string[] = constants.subCategories;

  constructor(
    public db: DatabaseService,
    public trackerService: TrackerService,
    public helperService: HelperService
  ) {
    super();
  }

  ngOnInit() {
    this.db
      .getMoves()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((results) => {
        const categoryNames = Object.keys(results);
        this.localCategoryNames = categoryNames;
        for (let i = 0; i < categoryNames.length; i++) {
          if (this.helperService.hasSubcategories(categoryNames[i])) {
            let subcategoryNames = Object.keys(results[categoryNames[i]]);
            subcategoryNames.forEach((subcategoryName) => {
              results[categoryNames[i]][subcategoryName] =
                this.helperService.renderFlatStringObjectAsArray(
                  results[categoryNames[i]][subcategoryName]
                );
            });
          } else {
            const modifiedResults =
              this.helperService.renderFlatStringObjectAsArray(
                results[categoryNames[i]]
              );
            results[categoryNames[i]] = modifiedResults;
          }
        }
        this.existingMovesObj = results;
      });

    this.trackerService.currentUserBehaviorSubject
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        if (user) {
          this.localUser = user;
          this.db
            .getUserByUid(user.uid)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((dbUser) => {
              if (dbUser.privileges.isAdmin) {
                this.localIsAdmin = true;
              } else {
                this.localIsAdmin = false;
              }
            });
        }
      });

    this.db
      .getCandidateMoves()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((results) => {
        let resultArray = Object.keys(results).map(function (
          candidateMovesObjIndex
        ) {
          let singleCandidateMoveObj = results[candidateMovesObjIndex];
          return singleCandidateMoveObj;
        });
        this.localCandidateMoves = resultArray;
      });
  }

  approveMove(
    eventName: string,
    categoryName: string,
    subcategoryName: string
  ) {
    let confirmation = confirm(
      "Are you sure you want to APPROVE the move " + eventName + "?"
    );
    if (confirmation) {
      this.db.addMoveNameToDb(eventName, categoryName, subcategoryName);
      this.db.removeMoveNameFromCandidateList(eventName);
      if (this.localUser) {
        this.db.updateUserReputationPoints(
          this.localUser.id,
          constants.numberOfPointsToAwardForApprovingMoveName,
          "You approved move name " + eventName
        );
      }
    }
  }

  disapproveMove(eventName: string) {
    let confirmation = confirm(
      "Are you sure you want to DISAPPROVE the move " + eventName + "?"
    );
    if (confirmation) {
      this.db
        .getvideoUrlFromCandidateMoveName(eventName)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((urlResult) => {
          this.db
            .getVideoIdFromVideoUrl(urlResult)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((videoIdResult) => {
              this.db
                .getMoveIdFromMatchId(videoIdResult, eventName)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((moveIdResult) => {
                  this.db.updateMoveNameInMatch(
                    videoIdResult,
                    moveIdResult,
                    eventName,
                    constants.eventNameRemovedMessage
                  );
                });
            });
        });
      this.db.removeMoveNameFromCandidateList(eventName);
      if (this.localUser) {
        this.db.updateUserReputationPoints(
          this.localUser.id,
          constants.numberOfPointsToAwardForApprovingMoveName,
          "You disapproved move name " + eventName
        );
      }
    }
  }

  deleteMoveName(move: string, category: string) {
    let confirmation = confirm(
      "Are you sure you want to delete " + move + " from the database?"
    );
    if (confirmation) {
      this.db
        .getSubcategoryFromMoveAndCategory(category, move)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((subcategory) => {
          this.db.deleteMoveName(move, category, subcategory);
        });
    }
  }
}
