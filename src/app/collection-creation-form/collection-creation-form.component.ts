import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, combineLatest, of } from 'rxjs';
import { takeUntil, takeLast, takeWhile, take, withLatestFrom } from 'rxjs/operators';
// import {MatSnackBar} from '@angular/material';
import {MatStepper} from '@angular/material/stepper';

// import { constants } from '../constants';

import { TrackerService } from '../tracker.service';
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

  constructor(private formProcessingService:FormProcessingService, private trackerService: TrackerService) {
    super();
  }

  ngOnDestroy(){
    // this.formProcessingService.setAllFormThreadsTo("Stop");
    // this.formProcessingService.setAllQuestionThreadsTo("Stop");
    this.formProcessingService.captureFormResults("Stop");
    this.formProcessingService.captureQuestionArrayOfCurrentForm("Stop");
  }
  ngAfterViewInit(){
    // this.formProcessingService.formEntriesValid.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formEntriesValid =>{
    //   this.localValid = formEntriesValid;
    // });
    let stepNum = this.stepper?this.stepper.selectedIndex:0;

    //change questions being displayed --------
        // this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
        //   if(newQuestions){
        //     this.localCollectionQuestions = newQuestions;
        //     //TODO do something here that captures new formControls?
        //   }
        // });
    //-------------------------------------------



  }

  ngOnInit() {
    this.formProcessingService.nextButtonClicked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(nextButtonClicked=>{
      console.log("nextButtonClicked in collection-creation form is: " + nextButtonClicked);
      if(nextButtonClicked){
        this.stepper.next();
      } else{
        console.log("got here 1");
        // this.stepper.reset();
      }
    });
    // console.log("ngOnInit in CollectionCreationFormComponent called");
    // this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionQuestions =>{
    //   this.localCollectionQuestions = collectionQuestions;
    // });
    // this.questionService.getNewEntryDetailQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(entryQuestions =>{
    //   this.localEntryDetailQuestions = entryQuestions;
    // });


    // this.questionService.getOriginalCollectionOwnerQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
    //   this.localEntryDetailConfigOptions = new DynamicFormConfiguration(questionResults, "Submit");
    // });
    // this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
    //   if(user){
    //     this.localUser = user;
    //   }
    // });

  }

  // openSnackBar(message: string) {
  //   this.snackBar.open(message, '', {
  //     duration: 1000, //TODO change to 3000 once testing is complete a feature is good to go
  //   });
  // }

}
