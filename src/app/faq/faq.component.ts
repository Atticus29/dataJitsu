import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { take } from "rxjs/operators";

import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { constants } from "../constants";

@Component({
  selector: "app-faq",
  templateUrl: "./faq.component.html",
  styleUrls: ["./faq.component.scss"],
})
export class FaqComponent extends BaseComponent implements OnInit {
  public localTitle: string = constants.title;
  public localActvityName: string = constants.activityName;
  public localNumberOfCurrentAnnotationsNeeded: number =
    constants.numberOfCurrentAnnotationsNeeded;
  public localMonthlyCost: string = constants.monthlyCostString;
  public localNumberOfPointsToAwardForAnnotation: number =
    constants.numberOfPointsToAwardForAnnotation;
  public localNumberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction: number =
    constants.numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction;
  public localNumberOfPointsToDeductForBadAnnotation: number =
    constants.numberOfPointsToDeductForBadAnnotation;
  public localMinimumAnnotationRatingAVideoFlaggedAsRemovedNeedsToPreventUserDeduction: number =
    constants.minimumAnnotationRatingThatAVideoFlaggedAsRemovedNeedsToPreventMajorityAnnotatorDeduction;
  public faqQuestions: any[] = [];

  constructor(
    public ngZone: NgZone,
    public db: DatabaseService,
    public router: Router
  ) {
    super();
  }

  ngOnInit() {
    console.log(constants.faqQuestions);
    this.faqQuestions = constants.faqQuestions;
    console.log("faqQuestions is: ");
    console.log(this.faqQuestions);
  }

  navigateToVideoInNeedOfAnnotation() {
    console.log("clicked navigateToVideoInNeedOfAnnotation");
    this.db
      .getMatchInNeedOfAnnotation()
      .pipe(take(1))
      .subscribe((match) => {
        this.ngZone.run(() => {
          this.router.navigate([constants.allVideosPathName + match.id]);
        });
      });
  }
}
