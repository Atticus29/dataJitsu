import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil, withLatestFrom, take } from 'rxjs/operators';

import {MatSnackBar} from '@angular/material';

import { constants } from '../constants';
import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { Collection } from '../collection.model';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { FormQuestionBase } from '../formQuestionBase.model';
import { QuestionService } from '../question.service';
import { QuestionControlService } from '../question-control.service';
import { FormProcessingService } from '../form-processing.service';
import { TrackerService } from '../tracker.service';
import { VideoDetails } from '../videoDetails.model';
import { Video } from '../video.model';
import { EventInVideo } from '../eventInVideo.model';

@Component({
  selector: 'app-generic-new-video-form',
  templateUrl: './generic-new-video-form.component.html',
  styleUrls: ['./generic-new-video-form.component.scss']
})
export class GenericNewVideoFormComponent extends BaseComponent implements OnInit {
  private localCollection: Collection = null;
  private localCollectionQuestions: FormQuestionBase<any>[] = this.questionService.getShamCollectionQuestionsInstantly();
  private localCollectionConfigOptions: DynamicFormConfiguration = new DynamicFormConfiguration(this.localCollectionQuestions, [], "Submit");
  private localUser: any;

  constructor(public snackBar: MatSnackBar, private databaseService: DatabaseService, private route: ActivatedRoute, private questionService: QuestionService, private qcs: QuestionControlService, private formProcessingService: FormProcessingService, private trackerService: TrackerService) {
    super();
  }

  ngOnInit() {
    let self = this;
    this.trackerService.currentUserBehaviorSubject.pipe(take(2)).subscribe(user =>{
      if(user){
        this.localUser = user;
      }
    });
    this.formProcessingService.restartFormAndQuestions();
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      // console.log(params.collectionId);
      this.databaseService.getCollection(params.collectionId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionResult =>{
        this.localCollection = Collection.fromDataBase(collectionResult);
        // console.log("this.localCollection in generic-video-creation component is: ");
        // console.log(this.localCollection);
        this.questionService.questionsFromDbCollection(this.localCollection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
          // console.log("questionResults are: ");
          // this.localCollectionConfigOptions = new DynamicFormConfiguration(questionResults, [], "Submit");
          self.formProcessingService.buttonDisplayName.next("Submit");
          // console.log("localCollectionConfigOptions are: ");
          // console.log(this.localCollectionConfigOptions);
          // this.localCollectionQuestions = questionResults;
          // console.log("this.localCollectionQuestions are: ");
          // console.log(this.localCollectionQuestions);
          let form = this.qcs.toFormGroup(questionResults);
          // console.log("form in dynamic form component is: ");
          // console.log(form);
          this.formProcessingService.actualForm.next(form);
          this.formProcessingService.captureQuestionArrayOfCurrentForm(questionResults);
          // console.log("this.configOptions.getSubmitButtonDisplay() is: " + this.configOptions.getSubmitButtonDisplay());
          // this.localButtonDisplayName = this.configOptions.getSubmitButtonDisplay();
        });
      })
    });

    this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
      // console.log("newQuestions in generic new video form:");
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
      console.log("isFormSubmitted is: " + isFormSubmitted);
      if(isFormSubmitted){
        // let formResultObservableWithLatestQuestions = formThread[stepNum].pipe(withLatestFrom(this.formProcessingService.questionThread[stepNum]));
        let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
        // let formResultsWithLatestSubmissionConfirmation = this.formProcessingService.formSubmitted.pipe(withLatestFrom(formResultObservableWithLatestQuestions));
        formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
          console.log("combinedResults are: ");
          console.log(combinedResults);
          let formResults = combinedResults[0];
          let currentFormQuestions = combinedResults[1];
          // console.log("currentFormQuestions are:");
          // console.log(currentFormQuestions);
          if(formResults){ //formSubmitted &&
            // console.log("form has been submitted and there are form results");
            if(formResults !== "Stop"){
              console.log("formResults are: ");
              console.log(formResults);
              if(formResults.collectionName){ //TODO edit
                if(currentFormQuestions){
                  if(currentFormQuestions !== "Stop"){
                    if(this.localUser && this.localUser.id){
                      formResults.originalPosterId = this.localUser.id;

                      let newVideo: Video = Video.fromJson(formResults);
                      //TODO create new video-generic
                      // let newCollection = Collection.fromForm(formResults, currentFormQuestions);
                      // console.log(newCollection);
                      //TODO the below should be add video to collection

                      this.databaseService.addVideoToDbWithPath(newVideo, self.localCollection.getId()+'/videos/').pipe(takeUntil(this.ngUnsubscribe)).subscribe(vidoeId =>{
                        let additionStatus = false;
                        let localVideoId = null;
                        if(vidoeId){
                          localVideoId = vidoeId;
                        }
                        if(localVideoId){
                          self.openSnackBar(constants.videoAddedNotification);
                          self.formProcessingService.stopFormAndQuestions();

                          if(self.localCollectionConfigOptions.getSubmitButtonDisplay() && self.localCollectionConfigOptions.getSubmitButtonDisplay()==="Next"){
                            self.formProcessingService.nextButtonClicked.next(true);
                            //TODO what else to do here?
                          }
                        }else{
                          self.openSnackBar(constants.collectionAlreadyExistsNotification);
                          //don't trigger next click
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
