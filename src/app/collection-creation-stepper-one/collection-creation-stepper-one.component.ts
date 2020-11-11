import { Component, OnInit, OnDestroy } from '@angular/core';

import {MatSnackBar} from '@angular/material';
import { takeUntil, withLatestFrom } from 'rxjs/operators';

import { constants } from '../constants';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { FormQuestionBase } from '../formQuestionBase.model';
import { QuestionService } from '../question.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
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
  constructor(private databaseService: DatabaseService, private questionService: QuestionService, private formProcessingService:FormProcessingService, public snackBar: MatSnackBar) {
    super();
  }

  ngOnInit() {
    this.questionService.getCollectionQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      console.log("questionResults are: ");
      console.log(questionResults);
      this.localCollectionConfigOptions = new DynamicFormConfiguration(questionResults, "Next");
      this.localCollectionQuestions = questionResults;
    });

    this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
      if(newQuestions){
        console.log("newQuestions are: ");
        console.log(newQuestions);
        this.localCollectionQuestions = newQuestions;
        //TODO do something here that captures new formControls?
      }
    });

    //when form is submitted --------------------
        let self = this;
        this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
          console.log("isFormSubmitted is: " + isFormSubmitted);
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

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 1000, //TODO change to 3000 once testing is complete a feature is good to go
    });
  }

}
