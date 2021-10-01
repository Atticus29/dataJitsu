import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { takeUntil, withLatestFrom, take } from "rxjs/operators";

import { MatSnackBar } from "@angular/material";

import { constants } from "../constants";
import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { Collection } from "../collection.model";
import { DynamicFormConfiguration } from "../dynamicFormConfiguration.model";
import { FormQuestionBase } from "../formQuestionBase.model";
import { QuestionService } from "../question.service";
import { QuestionControlService } from "../question-control.service";
import { FormProcessingService } from "../form-processing.service";
import { TrackerService } from "../tracker.service";
import { VideoDetails } from "../videoDetails.model";
import { Video } from "../video.model";
import { EventInVideo } from "../eventInVideo.model";
import { HelperService } from "../helper.service";

@Component({
  selector: "app-generic-new-video-form",
  templateUrl: "./generic-new-video-form.component.html",
  styleUrls: ["./generic-new-video-form.component.scss"],
})
export class GenericNewVideoFormComponent
  extends BaseComponent
  implements OnInit
{
  private localCollection: Collection = null;
  private localCollectionBackupCopy: Collection = null;
  private localCollectionQuestions: FormQuestionBase<any>[] =
    this.questionService.getShamCollectionQuestionsInstantly();
  private localCollectionConfigOptions: DynamicFormConfiguration =
    new DynamicFormConfiguration(this.localCollectionQuestions, [], "Submit");
  private localUser: any;
  private localCounter = 0;
  private isCurrentCollectionOwnedByCurrentUser: boolean;

  constructor(
    public snackBar: MatSnackBar,
    private databaseService: DatabaseService,
    private route: ActivatedRoute,
    private questionService: QuestionService,
    private qcs: QuestionControlService,
    private formProcessingService: FormProcessingService,
    private trackerService: TrackerService,
    private helperService: HelperService
  ) {
    super();
  }

  ngOnInit() {
    console.log("ngOnInit on generic new video form component entered");
    let self = this;
    this.trackerService.currentUserBehaviorSubject
      .pipe(take(2))
      .subscribe((user) => {
        if (user) {
          this.localUser = user;
          if (Object.keys(this.localUser.collections)) {
            let currentUserCollectionIds = Object.keys(
              this.localUser.collections
            );
            console.log("currentUserCollectionIds are: ");
            console.log(currentUserCollectionIds);
            this.route.params
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((params) => {
                if (params.collectionId) {
                  console.log(
                    "current collection params.collectionId is: " +
                      params.collectionId
                  );
                  if (currentUserCollectionIds.includes(params.collectionId)) {
                    console.log("setting to true...");
                    this.isCurrentCollectionOwnedByCurrentUser = true;
                  } else {
                    this.isCurrentCollectionOwnedByCurrentUser = false;
                  }
                }
              });
          }
          console.log("this.localUser in generic-new-video form is ");
          console.log(this.localUser);
        }
      });
    this.formProcessingService.restartFormAndQuestions(
      this.questionService.getNewCollectionQuestionsAsObj()
    );
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        this.databaseService
          .getCollection(params.collectionId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((collectionResult) => {
            this.localCollection = Collection.fromDataBase(collectionResult);
            this.questionService
              .questionsFromDbCollection(this.localCollection)
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((questionResults) => {
                self.formProcessingService.buttonDisplayName.next("Submit");
                let form = this.qcs.toFormGroup(questionResults);
                this.formProcessingService.actualForm.next(form);
                this.formProcessingService.captureQuestionArrayOfCurrentForm(
                  questionResults
                );
                this.localCollectionBackupCopy = questionResults;
              });
          });
      });

    this.formProcessingService.questionArrayOfForm
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((newQuestions) => {
        if (newQuestions) {
          this.localCollectionQuestions = newQuestions;
          //TODO do something here that captures new formControls? I no longer think it's necessary?
        }
      });

    //when form is submitted --------------------
    this.formProcessingService.formSubmitted
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isFormSubmitted) => {
        console.log("isFormSubmitted is: " + isFormSubmitted);
        if (isFormSubmitted) {
          let formResultObservableWithLatestQuestions =
            this.formProcessingService.formResults.pipe(
              withLatestFrom(this.formProcessingService.questionArrayOfForm)
            );
          formResultObservableWithLatestQuestions
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((combinedResults) => {
              console.log("combinedResults are: ");
              console.log(combinedResults);
              let formResults = this.helperService.convertObjectValuesToStrings(
                combinedResults[0]
              );
              let currentFormQuestions = combinedResults[1];
              if (formResults) {
                if (
                  formResults[0] !== "Stop" &&
                  currentFormQuestions !== "Stop"
                ) {
                  console.log("formResults got here and are:");
                  console.log(formResults);
                  // if(formResults.collectionName){ //TODO edit
                  if (currentFormQuestions) {
                    console.log("got here mark");
                    console.log("currentFormQuestions are: ");
                    console.log(currentFormQuestions);
                    if (currentFormQuestions[0] !== "Stop") {
                      if (
                        this.localUser &&
                        this.localUser.id &&
                        this.localCounter < 1
                      ) {
                        formResults["originalPosterId"] = this.localUser.id;
                        let newVideo: Video = Video.fromJson(formResults);
                        console.log("newVideo is: ");
                        console.log(newVideo);
                        console.log("shouldn't get here yet");
                        //TODO create new video-generic
                        //TODO the below should be add video to collection
                        this.localCounter++;
                        this.databaseService
                          .addVideoToDbWithPath(
                            newVideo,
                            "collections/" +
                              self.localCollection.getId() +
                              "/videos/"
                          )
                          .pipe(takeUntil(this.ngUnsubscribe))
                          .subscribe((videoId) => {
                            console.log("shouldn't get here yet");
                            let additionStatus = false;
                            let localVideoId = null;
                            if (videoId) {
                              localVideoId = videoId;
                            }
                            if (localVideoId) {
                              self.openSnackBar(
                                constants.videoAddedNotification
                              );
                              console.log("got here 111");
                              // self.formProcessingService.stopFormAndQuestions();
                              //TODO maybe:

                              self.formProcessingService.restartFormAndQuestions(
                                self.localCollectionBackupCopy
                              );
                              this.localCounter--; //hopefully does not cause a forever loop

                              if (
                                self.localCollectionConfigOptions.getSubmitButtonDisplay() &&
                                self.localCollectionConfigOptions.getSubmitButtonDisplay() ===
                                  "Next"
                              ) {
                                console.log("Ack should never get here");
                                self.formProcessingService.nextButtonClicked.next(
                                  true
                                );
                                //TODO what else to do here?
                              }
                            } else {
                              console.log(
                                "failure here deleteMe and don't freak out"
                              );
                              // self.openSnackBar(constants.collectionAlreadyExistsNotification); //this happens in the stepper components now?
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
    this.snackBar.open(message, "", {
      duration: 3000,
    });
  }
}
