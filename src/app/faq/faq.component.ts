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
  private localMinimumAnnotationRatingAVideoFlaggedAsRemovedNeedsToPreventUserDeduction: number = constants.numberOfFlagsAnAnnotationNeedsBeforeReptuationDeduction;

  constructor(public ngZone: NgZone, private db: DatabaseService, private router: Router) {
    super();
  }

  ngOnInit() {
  }

  navigateToVideoInNeedOfAnnotation(){
    console.log("clicked navigateToVideoInNeedOfAnnotation");
    this.db.getMatchInNeedOfAnnotation().pipe(take(1)).subscribe(match =>{
      this.ngZone.run(() =>{
        this.router.navigate(['matches/' + match.id]);
      });
    });
  }


}
