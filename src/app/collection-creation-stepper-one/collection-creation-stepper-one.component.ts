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
    this.formProcessingService.restartFormAndQuestions();
    let self = this;
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      if(user){
        this.localUser = user;
      }
    });
    this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      self.questionService.getCollectionQuestionGroupQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestionGroupResults =>{
        this.localCollectionConfigOptions = new DynamicFormConfiguration(questionResults, newQuestionGroupResults, "Next");
        this.formProcessingService.buttonDisplayName.next("Next");
        this.localCollectionQuestions = questionResults;
      });
    });

    this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
      if(newQuestions){
        this.localCollectionQuestions = newQuestions;
        //TODO do something here that captures new formControls? Still needed?
      }
    });

    //when form is submitted --------------------
        this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
          if(isFormSubmitted){
                let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
                formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
                  let formResults = combinedResults[0];
                  let currentFormQuestions = combinedResults[1];
                  if(formResults){ //formSubmitted &&
                    if(formResults[0] !== "Stop"){
                      if(formResults.collectionName){
                        if(currentFormQuestions){
                          if(currentFormQuestions[0] !== "Stop"){
                            let newCollection = Collection.fromForm(formResults, currentFormQuestions);
                            if(this.localUser && this.localUser.id && self.formSubmissionCounter<1){
                              this.databaseService.addCollectionToDatabase(newCollection, this.localUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(additionResults =>{
                                let additionStatus = false;
                                let collectionId = null;
                                if(additionResults){
                                  additionStatus = additionResults.status;
                                  collectionId = additionResults.collectionId;
                                }
                                if(additionStatus){
                                  self.openSnackBar(constants.collectionAddedNotification);
                                  self.formProcessingService.stopFormAndQuestions();
                                  if(self.localCollectionConfigOptions.getSubmitButtonDisplay()==="Next"){
                                    self.formProcessingService.nextButtonClicked.next(true);
                                    if(collectionId){
                                      self.formProcessingService.collectionId.next(collectionId);
                                    }
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
      duration: 3000,
    });
  }

}