import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Observable, combineLatest, of } from 'rxjs';
import { takeUntil, takeLast, takeWhile, take, withLatestFrom } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';
import {MatStepper} from '@angular/material/stepper';

import { constants } from '../constants';
import { QuestionService } from '../question.service';
import { TrackerService } from '../tracker.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';
import { Collection } from '../collection.model';
import { FormQuestionBase } from '../formQuestionBase.model';
import { DatabaseService } from '../database.service';
import { AuthorizationService } from '../authorization.service';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';


@Component({
  selector: 'app-collection-creation-form',
  templateUrl: './collection-creation-form.component.html',
  styleUrls: ['./collection-creation-form.component.scss']
})
export class CollectionCreationFormComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('stepper', {static:false}) stepper: MatStepper;
  private localCurrentStep: number;
  private localCollectionQuestions: FormQuestionBase<any>[];
  private localEntryDetailQuestions: FormQuestionBase<any>[];
  private localCollectionConfigOptions: DynamicFormConfiguration;
  private localEntryDetailConfigOptions: DynamicFormConfiguration;
  private localUser: any;
  private currentStepInStepper: Observable<number>;
  private localValid: boolean = false;

  constructor(private questionService: QuestionService, private databaseService: DatabaseService, private formProcessingService:FormProcessingService, private trackerService: TrackerService, public snackBar: MatSnackBar) {
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
        this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
          if(newQuestions){
            this.localCollectionQuestions = newQuestions;
            //TODO do something here that captures new formControls?
          }
        });
    //-------------------------------------------

    //when form is submitted --------------------
        let self = this;
        this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
          // console.log("isFormSubmitted is: " + isFormSubmitted);
          if(isFormSubmitted){
                // let formResultObservableWithLatestQuestions = formThread[stepNum].pipe(withLatestFrom(this.formProcessingService.questionThread[stepNum]));
                let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
                // let formResultsWithLatestSubmissionConfirmation = this.formProcessingService.formSubmitted.pipe(withLatestFrom(formResultObservableWithLatestQuestions));
                formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
                  console.log("combinedResults are: ");
                  console.log(combinedResults);
                  // console.log("combinedResultsAndChecker is:");
                  // console.log(combinedResultsAndChecker);
                  // let formSubmitted = combinedResultsAndChecker[1];
                  // console.log("has form been submitted?: " + formSubmitted);
                  // let combinedResults = combinedResultsAndChecker[0];
                  let formResults = combinedResults[0];
                  console.log("formResults are:");
                  console.log(formResults);
                  let currentFormQuestions = combinedResults[1];
                  console.log("currentFormQuestions are:");
                  console.log(currentFormQuestions);
                  if(formResults){ //formSubmitted &&
                    console.log("form has been submitted and there are form results");
                    if(formResults !== "Stop"){
                      if(formResults.collectionName){
                        if(currentFormQuestions){
                          if(currentFormQuestions !== "Stop"){
                            let newCollection = Collection.fromForm(formResults, currentFormQuestions);
                            if(this.localUser && this.localUser.id){
                              this.databaseService.addCollectionToDatabase(newCollection, this.localUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(additionStatus =>{
                                if(additionStatus){
                                  self.openSnackBar(constants.collectionAddedNotification);
                                }else{
                                  self.openSnackBar(constants.collectionAlreadyExistsNotification);
                                }
                              });
                            }
                          }
                        }
                      }
                    }
                  }
                });
              }
        });
        //----end form submission doing things

  }

  ngOnInit() {
    this.formProcessingService.nextButtonClicked.pipe(takeUntil(this.ngUnsubscribe)).subscribe(nextButtonClicked=>{
      console.log("nextButtonClicked in collection-creation form is: " + nextButtonClicked);
      if(nextButtonClicked){

      }
    });
    // console.log("ngOnInit in CollectionCreationFormComponent called");
    this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionQuestions =>{
      this.localCollectionQuestions = collectionQuestions;
    });
    this.questionService.getNewEntryDetailQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(entryQuestions =>{
      this.localEntryDetailQuestions = entryQuestions;
    });
    this.questionService.getCollectionQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      this.localCollectionConfigOptions = new DynamicFormConfiguration(questionResults, "Next");
    });

    this.questionService.getOriginalCollectionOwnerQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      this.localEntryDetailConfigOptions = new DynamicFormConfiguration(questionResults, "Submit");
    });
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      if(user){
        this.localUser = user;
      }
    });

  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 1000, //TODO change to 3000 once testing is complete a feature is good to go
    });
  }

}
