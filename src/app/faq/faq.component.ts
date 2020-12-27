import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent extends BaseComponent implements OnInit {
  private localTitle: string = constants.title;
  private localActvityName: string = constants.activityName;
  private localNumberOfCurrentAnnotationsNeeded: number = constants.numberOfCurrentAnnotationsNeeded;
  private localMonthlyCost: string = constants.monthlyCostString;
  private localNumberOfPointsToAwardForAnnotation: number = constants.numberOfPointsToAwardForAnnotation;
  private localNumberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction: number = constants.numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction;
  private localNumberOfPointsToDeductForBadAnnotation: number = constants.numberOfPointsToDeductForBadAnnotation;
  private localMinimumAnnotationRatingAVideoFlaggedAsRemovedNeedsToPreventUserDeduction: number = constants.minimumAnnotationRatingThatAVideoFlaggedAsRemovedNeedsToPreventMajorityAnnotatorDeduction;
  private faqQuestions: any[] = [];

  constructor(public ngZone: NgZone, private db: DatabaseService, private router: Router) {
    super();
  }

  ngOnInit() {
    console.log(constants.faqQuestions);
    this.faqQuestions=constants.faqQuestions;
    console.log("faqQuestions is: ");
    console.log(this.faqQuestions);
  }

  navigateToVideoInNeedOfAnnotation(){
    console.log("clicked navigateToVideoInNeedOfAnnotation");
    this.db.getMatchInNeedOfAnnotation().pipe(take(1)).subscribe(match =>{
      this.ngZone.run(() =>{
        this.router.navigate([constants.allVideosPathName + match.id]);
      });
    });
  }


}
