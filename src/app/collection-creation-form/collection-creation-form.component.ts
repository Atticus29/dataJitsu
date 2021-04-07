import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, combineLatest, of } from 'rxjs';
import { takeUntil, takeLast, takeWhile, take, withLatestFrom } from 'rxjs/operators';
import {MatStepper} from '@angular/material/stepper';

// import { constants } from '../constants';

import { TrackerService } from '../tracker.service';
import { QuestionService } from '../question.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';
import { Collection } from '../collection.model';
// import { DatabaseService } from '../database.service';
import { AuthorizationService } from '../authorization.service';



@Component({
  selector: 'app-collection-creation-form',
  templateUrl: './collection-creation-form.component.html',
  styleUrls: ['./collection-creation-form.component.scss']
})
export class CollectionCreationFormComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', {static:false}) stepper: MatStepper;
  private localCurrentStep: number;


  private localUser: any;
  private currentStepInStepper: Observable<number>;
  private localValid: boolean = false;

  constructor(private formProcessingService:FormProcessingService, private trackerService: TrackerService, private questionService: QuestionService) {
    super();
  }

  ngOnDestroy(){
    console.log("ng on destroy entered in collection-creation-form component");
    // this.formProcessingService.captureFormResults(["Stop"]);
    // this.formProcessingService.captureQuestionArrayOfCurrentForm(["Stop"]);
    this.formProcessingService.restartFormAndQuestions(this.questionService.getNewCollectionQuestionsAsObj());
  }
  ngAfterViewInit(){
    console.log("ngAfterViewInit called in collection creation form");
    let stepNum = this.stepper?this.stepper.selectedIndex:0;
  }

  ngOnInit() {
    console.log("ngOnInit in collection-creation form component entered");
    this.formProcessingService.nextButtonClicked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(nextButtonClicked=>{
      if(nextButtonClicked){
        console.log("next button clicked registered in collection creation form component");
        this.stepper.next();
      }
    });
    this.formProcessingService.finalSubmitButtonClicked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(finalSubmitButtonClicked=>{
      if(finalSubmitButtonClicked){
        console.log("final submit button clicked registered in collection creation form component");
        this.stepper.reset();
      }
    });
  }

}
