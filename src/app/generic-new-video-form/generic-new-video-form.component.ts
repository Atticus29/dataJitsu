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
import { HelperService } from '../helper.service';

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
  private localCounter = 0;

  constructor(public snackBar: MatSnackBar, private databaseService: DatabaseService, private route: ActivatedRoute, private questionService: QuestionService, private qcs: QuestionControlService, private formProcessingService: FormProcessingService, private trackerService: TrackerService, private helperService: HelperService) {
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
      this.databaseService.getCollection(params.collectionId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionResult =>{
        this.localCollection = Collection.fromDataBase(collectionResult);
        this.questionService.questionsFromDbCollection(this.localCollection).pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionResults =>{
          self.formProcessingService.buttonDisplayName.next("Submit");
          let form = this.qcs.toFormGroup(questionResults);
          this.formProcessingService.actualForm.next(form);
          this.formProcessingService.captureQuestionArrayOfCurrentForm(questionResults);
        });
      })
    });

    this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
      if(newQuestions){
        this.localCollectionQuestions = newQuestions;
        //TODO do something here that captures new formControls? I no longer think it's necessary?
      }
    });

    //when form is submitted --------------------
    this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted =>{
      console.log("isFormSubmitted is: " + isFormSubmitted);
      if(isFormSubmitted){
        let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
        formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults =>{
          console.log("combinedResults are: ");
          console.log(combinedResults);
          let formResults = this.helperService.convertObjectValuesToStrings(combinedResults[0]);
          let currentFormQuestions = combinedResults[1];
          if(formResults){
            if(formResults[0] !== "Stop" && currentFormQuestions!== "Stop"){
              console.log("formResults got here and are:");
              console.log(formResults);
              // if(formResults.collectionName){ //TODO edit
                if(currentFormQuestions){
                  if(currentFormQuestions[0] !== "Stop"){
                    if(this.localUser && this.localUser.id && this.localCounter <1){
                      formResults['originalPosterId'] = this.localUser.id;
                      let newVideo: Video = Video.fromJson(formResults);
                      console.log("newVideo is: ");
                      console.log(newVideo);
                      console.log("shouldn't get here yet");
                      //TODO create new video-generic
                      //TODO the below should be add video to collection
                      this.localCounter ++;
                      this.databaseService.addVideoToDbWithPath(newVideo, 'collections/' + self.localCollection.getId()+'/videos/').pipe(takeUntil(this.ngUnsubscribe)).subscribe(vidoeId =>{
                        console.log("shouldn't get here yet");
                        let additionStatus = false;
                        let localVideoId = null;
                        if(vidoeId){
                          localVideoId = vidoeId;
                        }
                        if(localVideoId){
                          self.openSnackBar(constants.videoAddedNotification);
                          self.formProcessingService.stopFormAndQuestions();

                          if(self.localCollectionConfigOptions.getSubmitButtonDisplay() && self.localCollectionConfigOptions.getSubmitButtonDisplay()==="Next"){
                            console.log("Ack should never get here");
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
              // }
            }
          }
        });
      }
    });
    //----end form submission doing things

  }

  openSnackBar(message: string) {
    console.log("openSnackBar in generic new video called");
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }

}
