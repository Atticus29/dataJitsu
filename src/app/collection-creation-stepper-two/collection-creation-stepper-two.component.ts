import { Component, OnInit, OnDestroy, NgZone } from "@angular/core";
import { Router } from "@angular/router";

import { MatSnackBar } from "@angular/material";
import { takeUntil, withLatestFrom, take } from "rxjs/operators";

import { constants } from "../constants";
import { DynamicFormConfiguration } from "../dynamicFormConfiguration.model";
import { FormQuestionBase } from "../formQuestionBase.model";
import { QuestionService } from "../question.service";
import { FormProcessingService } from "../form-processing.service";
import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { Collection } from "../collection.model";
import { TrackerService } from "../tracker.service";
import { OwnerQuestionSet } from "../ownerQuestionSet.model";

@Component({
  selector: "app-collection-creation-stepper-two",
  templateUrl: "./collection-creation-stepper-two.component.html",
  styleUrls: ["./collection-creation-stepper-two.component.scss"],
})
export class CollectionCreationStepperTwoComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  public localEntryDetailConfigOptions: DynamicFormConfiguration;
  public localEntryDetailQuestions: FormQuestionBase<any>[];
  public localUser: any;
  public stopCounter: number = 0;
  public isLoading: boolean = true;

  constructor(
    public databaseService: DatabaseService,
    public questionService: QuestionService,
    public formProcessingService: FormProcessingService,
    public snackBar: MatSnackBar,
    public trackerService: TrackerService,
    public ngZone: NgZone,
    public router: Router
  ) {
    super();
  }

  ngOnInit() {
    console.log("ngOnInit of stepper-two entered");
    let self = this;
    this.trackerService.currentUserBehaviorSubject
      .pipe(take(2))
      .subscribe((user) => {
        if (user) {
          this.localUser = user;
        }
      });
    this.questionService
      .getNewEntryDetailQuestions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((questionResults) => {
        self.questionService
          .getNewEntryDetailQuestions()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((newQuestionGroupResults) => {
            this.localEntryDetailConfigOptions = new DynamicFormConfiguration(
              questionResults,
              newQuestionGroupResults,
              "Submit"
            );
            this.localEntryDetailQuestions = questionResults;
          });
      });

    this.formProcessingService.questionArrayOfForm
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((newQuestions) => {
        if (newQuestions[0] != "Stop" && this.stopCounter < 1) {
          this.isLoading = true;
        }
        if (newQuestions[0] === "Stop") {
          this.stopCounter++;
          this.isLoading = true; //TODO ??
        }
        if (newQuestions[0] != "Stop" && this.stopCounter > 0) {
          this.localEntryDetailQuestions = newQuestions;
          this.isLoading = false;
          //TODO do something here that captures new formControls?
        }
      });

    //when form is submitted --------------------
    this.formProcessingService.formSubmitted
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isFormSubmitted) => {
        console.log(
          "form submitted monitoring in collection stepper two component firing off"
        );
        if (isFormSubmitted && this.stopCounter > 0) {
          console.log("form is submitted and stop counter is greater than one");
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
                  if (
                    formResults.labelQuestionName &&
                    formResults.inputTypeQuestionName
                  ) {
                    if (currentFormQuestions) {
                      if (currentFormQuestions[0] !== "Stop") {
                        self.formProcessingService.collectionId
                          .pipe(takeUntil(self.ngUnsubscribe))
                          .subscribe((collectionId) => {
                            if (collectionId) {
                              let newOwnerQuestionSet: OwnerQuestionSet =
                                OwnerQuestionSet.fromForm(
                                  collectionId,
                                  formResults,
                                  currentFormQuestions
                                );
                              if (this.localUser && this.localUser.id) {
                                this.databaseService
                                  .addOwnerQuestionSetToDatabase(
                                    newOwnerQuestionSet,
                                    this.localUser.id
                                  )
                                  .pipe(takeUntil(this.ngUnsubscribe))
                                  .subscribe((additionStatus) => {
                                    if (additionStatus) {
                                      self.openSnackBar(
                                        constants.collectionOwnerQuestionsAddedNotification
                                      );
                                      self.formProcessingService.collectionId.next(
                                        null
                                      );
                                      self.formProcessingService.stopFormAndQuestions();
                                      self.formProcessingService.finalSubmitButtonClicked.next(
                                        true
                                      );
                                      self.formProcessingService.restartFormAndQuestions(
                                        self.questionService.getNewCollectionQuestionsAsObj()
                                      );
                                      // self.questionService.getNewCollectionQuestions().pipe(takeUntil(self.ngUnsubscribe)).subscribe(newCollectionQuestions=>{
                                      //   self.formProcessingService.questionArrayOfForm.next(newCollectionQuestions);
                                      // });
                                      self.stopCounter = 0;
                                      self.ngZone.run(() => {
                                        self.router.navigate([
                                          constants.collectionsPathName +
                                            "/" +
                                            collectionId,
                                        ]); // + '/'+ constants.newVideoPathName
                                      });
                                    } else {
                                      self.openSnackBar(
                                        constants.collectionOwnerQuestionsErrorNotification
                                      );
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
    this.snackBar.open(message, "", {
      duration: 5000,
    });
  }
}
