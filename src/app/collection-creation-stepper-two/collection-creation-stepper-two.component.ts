 import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
 import { Router } from '@angular/router';

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
import { OwnerQuestionSet } from '../ownerQuestionSet.model';

@Component({
  selector: 'app-collection-creation-stepper-two',
  templateUrl: './collection-creation-stepper-two.component.html',
  styleUrls: ['./collection-creation-stepper-two.component.scss']
})
export class CollectionCreationStepperTwoComponent  extends BaseComponent implements OnInit, OnDestroy {
  private localEntryDetailConfigOptions: DynamicFormConfiguration;
  private localEntryDetailQuestions: FormQuestionBase<any>[];
  private localUser: any;
  private stopCounter: number = 0;
  private isLoading: boolean = true;

  constructor(private databaseService: DatabaseService, private questionService: QuestionService, private formProcessingService:FormProcessingService, public snackBar: MatSnackBar, private trackerService: TrackerService, private ngZone: NgZone, private router:Router) {
    super();
  }

  ngOnInit() {
    let self = this;
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      if(user){
        this.localUser = user;
      }
    });
    // console.log("got here stepper two");
    this.questionService.getNewEntryDetailQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
      self.questionService.getNewEntryDetailQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestionGroupResults =>{
        // console.log("questionResults from getNewEntryDetailQuestions from stepper two are: ");
        // console.log(questionResults);
        this.localEntryDetailConfigOptions = new DynamicFormConfiguration(questionResults, newQuestionGroupResults, "Submit");
        this.localEntryDetailQuestions = questionResults;
      });
    });

    this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
      // console.log("newQuestions in stepper two:");
      // console.log(newQuestions);
      if(newQuestions!="Stop" && this.stopCounter<1){
        //TODO loading
        this.isLoading = true;
      }
      if(newQuestions==="Stop"){
        // console.log("Stop has been hit! Adding to counter...");
        this.stopCounter ++;
        this.isLoading = true; //TODO ??
      }
      if(newQuestions!="Stop" && this.stopCounter>0){
        // console.log("newQuestions are: ");
        // console.log(newQuestions);
        this.localEntryDetailQuestions = newQuestions;
        this.isLoading = false;
        //TODO do something here that captures new formControls?
      }
    });

    //when form is submitted --------------------
        this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
          // console.log("isFormSubmitted in stepper two is: " + isFormSubmitted);
          if(isFormSubmitted && this.stopCounter>0){
                let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
                formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
                  // console.log("combinedResults in stepper two are: ");
                  // console.log(combinedResults);
                  let formResults = combinedResults[0];
                  // console.log("formResults are:");
                  // console.log(formResults);
                  let currentFormQuestions = combinedResults[1];
                  // console.log("currentFormQuestions are:");
                  // console.log(currentFormQuestions);
                  if(formResults){ //formSubmitted &&
                    console.log("form has been submitted and there are form results");
                    if(formResults !== "Stop"){
                      // console.log("got here a not stop");
                      if(formResults.labelQuestionName && formResults.inputTypeQuestionName){
                        if(currentFormQuestions){
                          if(currentFormQuestions !== "Stop"){
                            self.formProcessingService.collectionId.pipe(takeUntil(self.ngUnsubscribe)).subscribe(collectionId =>{
                              // console.log("collectionId in stepper two is: " + collectionId);
                              if(collectionId){
                                let newOwnerQuestionSet: OwnerQuestionSet = OwnerQuestionSet.fromForm(collectionId, formResults, currentFormQuestions);
                                console.log("newOwnerQuestionSet is: ");
                                console.log(newOwnerQuestionSet);
                                if(this.localUser && this.localUser.id){
                                  this.databaseService.addOwnerQuestionSetToDatabase(newOwnerQuestionSet, this.localUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(additionStatus =>{
                                    if(additionStatus){
                                      self.openSnackBar(constants.collectionOwnerQuestionsAddedNotification);
                                      self.formProcessingService.collectionId.next(null);
                                      self.formProcessingService.restartFormAndQuestions();
                                      //TODO repopulate form and questions with original primary stepper after a clear
                                      self.ngZone.run(() =>{
                                        self.router.navigate([constants.collectionsPathName + '/' + collectionId]); // + '/'+ constants.newVideoPathName
                                      });
                                    }else{
                                      self.openSnackBar(constants.collectionOwnerQuestionsErrorNotification);
                                    }
                                  });
                                }
                              }
                            });
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
      duration: 5000,
    });
  }

}
