import { Component, OnInit, OnDestroy } from "@angular/core";

import { MatSnackBar } from "@angular/material";
import { takeUntil, withLatestFrom, take } from "rxjs/operators";

import { constants } from "../constants";
import { DynamicFormConfiguration } from "../dynamicFormConfiguration.model";
import { FormQuestionBase } from "../formQuestionBase.model";
import { QuestionService } from "../question.service";
import { FormProcessingService } from "../form-processing.service";
import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { TrackerService } from "../tracker.service";
import { Collection } from "../collection.model";

@Component({
  selector: "app-collection-creation-stepper-one",
  templateUrl: "./collection-creation-stepper-one.component.html",
  styleUrls: ["./collection-creation-stepper-one.component.scss"],
})
export class CollectionCreationStepperOneComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public localCollectionConfigOptions: DynamicFormConfiguration;
  public localCollectionQuestions: FormQuestionBase<any>[];
  public localUser: any;
  public formSubmissionCounter: number = 0;
  constructor(
    public databaseService: DatabaseService,
    public questionService: QuestionService,
    public formProcessingService: FormProcessingService,
    public snackBar: MatSnackBar,
    public trackerService: TrackerService
  ) {
    super();
  }

  ngOnInit() {
    this.formSubmissionCounter = 0;
    console.log("ngOnInit of stepper one entered");
    this.formProcessingService.restartFormAndQuestions(
      this.questionService.getNewCollectionQuestionsAsObj()
    );
    let self = this;
    this.trackerService.currentUserBehaviorSubject
      .pipe(take(2))
      .subscribe((user) => {
        if (user) {
          this.localUser = user;
        }
      });
    this.questionService
      .getNewCollectionQuestions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((questionResults) => {
        self.questionService
          .getCollectionQuestionGroupQuestions()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((newQuestionGroupResults) => {
            console.log(
              "populating with new collection questions in stepper one"
            );
            this.localCollectionConfigOptions = new DynamicFormConfiguration(
              questionResults,
              newQuestionGroupResults,
              "Next"
            );
            this.formProcessingService.buttonDisplayName.next("Next");
            this.localCollectionQuestions = questionResults;
          });
      });

    this.formProcessingService.questionArrayOfForm
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((newQuestions) => {
        if (newQuestions) {
          this.localCollectionQuestions = newQuestions;
          //TODO do something here that captures new formControls? Still needed?
        }
      });

    //when form is submitted --------------------
    this.formProcessingService.formSubmitted
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isFormSubmitted) => {
        if (isFormSubmitted) {
          console.log(
            "form submitted monitoring in collection stepper one component firing off"
          );
          let formResultObservableWithLatestQuestions =
            this.formProcessingService.formResults.pipe(
              withLatestFrom(this.formProcessingService.questionArrayOfForm)
            );
          formResultObservableWithLatestQuestions
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((combinedResults) => {
              let formResults = combinedResults[0];
              let currentFormQuestions = combinedResults[1];
              if (formResults) {
                //formSubmitted &&
                if (formResults[0] !== "Stop") {
                  if (formResults.collectionName) {
                    if (currentFormQuestions) {
                      if (currentFormQuestions[0] !== "Stop") {
                        let newCollection = Collection.fromForm(
                          formResults,
                          currentFormQuestions
                        );
                        if (
                          this.localUser &&
                          this.localUser.id &&
                          self.formSubmissionCounter < 1
                        ) {
                          this.databaseService
                            .addCollectionToDatabase(
                              newCollection,
                              this.localUser.id
                            )
                            .pipe(takeUntil(this.ngUnsubscribe))
                            .subscribe((additionResults) => {
                              let additionStatus = false;
                              let collectionId = null;
                              if (additionResults) {
                                additionStatus = additionResults.status;
                                collectionId = additionResults.collectionId;
                              }
                              if (additionStatus) {
                                console.log(
                                  "collection added notification is firing"
                                );
                                self.openSnackBar(
                                  constants.collectionAddedNotification
                                );
                                self.formProcessingService.stopFormAndQuestions();
                                // self.formProcessingService.restartFormAndQuestions(self.questionService.getNewCollectionQuestionsAsObj());
                                if (
                                  self.localCollectionConfigOptions.getSubmitButtonDisplay() ===
                                  "Next"
                                ) {
                                  self.formProcessingService.nextButtonClicked.next(
                                    true
                                  );
                                  if (collectionId) {
                                    self.formProcessingService.collectionId.next(
                                      collectionId
                                    );
                                  }
                                  self.formProcessingService.formSubmitted
                                    .pipe(takeUntil(self.ngUnsubscribe))
                                    .subscribe((formSubmitted) => {
                                      if (formSubmitted) {
                                        self.questionService
                                          .getOriginalCollectionOwnerQuestionGroupQuestions()
                                          .pipe(takeUntil(self.ngUnsubscribe))
                                          .subscribe(
                                            (collectionOwnerQuestions) => {
                                              console.log("got here 1");
                                              self.formProcessingService.captureQuestionArrayOfCurrentForm(
                                                collectionOwnerQuestions
                                              );
                                            }
                                          );
                                      }
                                    });
                                }
                              } else {
                                console.log(
                                  "collection added failure notification is firing"
                                );
                                self.openSnackBar(
                                  constants.collectionAlreadyExistsNotification
                                );
                                self.formProcessingService.restartFormAndQuestions(
                                  self.questionService.getNewCollectionQuestionsAsObj()
                                );
                                self.formSubmissionCounter--;
                                //don't trigger next click
                              }
                            });
                          console.log(
                            "incrementing formSubmissionCounter from " +
                              self.formSubmissionCounter +
                              " to " +
                              (self.formSubmissionCounter + 1)
                          );
                          self.formSubmissionCounter++;
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
    this.snackBar.open(message, "", {
      duration: 3000,
    });
  }
}
