import { Component, OnInit, OnDestroy } from '@angular/core';

import {MatSnackBar} from '@angular/material';
import { takeUntil, withLatestFrom, take } from 'rxjs/operators';

import { constants } from '../constants';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { FormQuestionBase } from '../formQuestionBase.model';
import { QuestionService } from '../question.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { Collection } from '../collection.model';

@Component({
  selector: 'app-collection-creation-stepper-one',
  templateUrl: './collection-creation-stepper-one.component.html',
  styleUrls: ['./collection-creation-stepper-one.component.scss']
})
export class CollectionCreationStepperOneComponent  extends BaseComponent implements OnInit, OnDestroy {
  private localCollectionConfigOptions: DynamicFormConfiguration;
  private localCollectionQuestions: FormQuestionBase<any>[];
  private localUser: any;
  private formSubmissionCounter: number = 0;
  constructor(private databaseService: DatabaseService, private questionService: QuestionService, private formProcessingService:FormProcessingService, public snackBar: MatSnackBar, private trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    let self = this;
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      if(user){
        this.localUser = user;
      }
    });
    this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      self.questionService.getCollectionQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestionGroupResults =>{
        console.log("newQuestionGroupResults are: ");
        console.log(newQuestionGroupResults);
        // console.log("questionResults are: ");
        // console.log(questionResults);
        this.localCollectionConfigOptions = new DynamicFormConfiguration(questionResults, newQuestionGroupResults, "Next");
        this.localCollectionQuestions = questionResults;
      });
    });

    this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
      // console.log("newQuestions in stepper one:");
      // console.log(newQuestions);
      if(newQuestions){
        // console.log("newQuestions are: ");
        // console.log(newQuestions);
        this.localCollectionQuestions = newQuestions;
        //TODO do something here that captures new formControls?
      }
    });

    //when form is submitted --------------------

        this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
          // console.log("isFormSubmitted is: " + isFormSubmitted);
          if(isFormSubmitted){
                // let formResultObservableWithLatestQuestions = formThread[stepNum].pipe(withLatestFrom(this.formProcessingService.questionThread[stepNum]));
                let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
                // let formResultsWithLatestSubmissionConfirmation = this.formProcessingService.formSubmitted.pipe(withLatestFrom(formResultObservableWithLatestQuestions));
                formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
                  // console.log("combinedResults are: ");
                  // console.log(combinedResults);
                  let formResults = combinedResults[0];
                  let currentFormQuestions = combinedResults[1];
                  // console.log("currentFormQuestions are:");
                  // console.log(currentFormQuestions);
                  if(formResults){ //formSubmitted &&
                    // console.log("form has been submitted and there are form results");
                    if(formResults !== "Stop"){
                      // console.log("formResults are: ");
                      // console.log(formResults);
                      if(formResults.collectionName){
                        if(currentFormQuestions){
                          if(currentFormQuestions !== "Stop"){
                            let newCollection = Collection.fromForm(formResults, currentFormQuestions);
                            // console.log(newCollection);
                            if(this.localUser && this.localUser.id && self.formSubmissionCounter<1){
                              this.databaseService.addCollectionToDatabase(newCollection, this.localUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(additionStatus =>{
                                // console.log("additionStatus is: " + additionStatus);
                                if(additionStatus){
                                  self.openSnackBar(constants.collectionAddedNotification);
                                  //TODO next stop for form and questions
                                  self.formProcessingService.stopFormAndQuestions();

                                  if(self.localCollectionConfigOptions.getSubmitButtonDisplay()==="Next"){
                                    self.formProcessingService.nextButtonClicked.next(true);
                                    self.questionService.getOriginalCollectionOwnerQuestionGroupQuestions().pipe(takeUntil(self.ngUnsubscribe)).subscribe(collectionOwnerQuestions=>{
                                      self.formProcessingService.questionArrayOfForm.next(collectionOwnerQuestions);
                                    });
                                  }
                                }else{
                                  self.openSnackBar(constants.collectionAlreadyExistsNotification);
                                  //don't trigger next click
                                }
                              });
                              console.log("incrementing formSubmissionCounter");
                              self.formSubmissionCounter ++;
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

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 1000, //TODO change to 3000 once testing is complete a feature is good to go
    });
  }

}
