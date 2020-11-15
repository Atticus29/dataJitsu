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
import { Collection } from '../collection.model';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'app-collection-creation-stepper-two',
  templateUrl: './collection-creation-stepper-two.component.html',
  styleUrls: ['./collection-creation-stepper-two.component.scss']
})
export class CollectionCreationStepperTwoComponent  extends BaseComponent implements OnInit, OnDestroy {
  private localEntryDetailConfigOptions: DynamicFormConfiguration;
  private localEntryDetailQuestions: FormQuestionBase<any>[];
  private localUser: any;

  constructor(private databaseService: DatabaseService, private questionService: QuestionService, private formProcessingService:FormProcessingService, public snackBar: MatSnackBar, private trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      if(user){
        this.localUser = user;
      }
    });
    console.log("got here stepper two");
    this.questionService.getNewEntryDetailQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      console.log("questionResults from getNewEntryDetailQuestions from stepper two are: ");
      console.log(questionResults);
      this.localEntryDetailConfigOptions = new DynamicFormConfiguration(questionResults, "Submit");
      this.localEntryDetailQuestions = questionResults;
    });

    this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
      console.log("newQuestions in stepper two:");
      console.log(newQuestions);
      if(newQuestions){
        // console.log("newQuestions are: ");
        // console.log(newQuestions);
        // this.localEntryDetailQuestions = newQuestions;
        //TODO do something here that captures new formControls?
      }
    });

    //when form is submitted --------------------
        let self = this;
        this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
          console.log("isFormSubmitted in stepper two is: " + isFormSubmitted);
          if(isFormSubmitted){
                let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
                formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
                  console.log("combinedResults in stepper two are: ");
                  console.log(combinedResults);
                  let formResults = combinedResults[0];
                  console.log("formResults are:");
                  console.log(formResults);
                  let currentFormQuestions = combinedResults[1];
                  console.log("currentFormQuestions are:");
                  console.log(currentFormQuestions);
                  if(formResults){ //formSubmitted &&
                    console.log("form has been submitted and there are form results");
                    if(formResults !== "Stop"){
                      console.log("got here a not stop");
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
