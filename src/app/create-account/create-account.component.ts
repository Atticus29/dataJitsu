import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
  FormGroupDirective,
  NgForm,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";

import { takeUntil, take, last, withLatestFrom } from "rxjs/operators";
import { Subject } from "rxjs";

import { constants } from "../constants";
import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { User } from "../user.model";
import { TrackerService } from "../tracker.service";
import { TextTransformationService } from "../text-transformation.service";
import { ValidationService } from "../validation.service";
import { AuthorizationService } from "../authorization.service";
import { DynamicFormConfiguration } from "../dynamicFormConfiguration.model";
import { QuestionService } from "../question.service";
import { FormProcessingService } from "../form-processing.service";

@Component({
  selector: "app-create-account",
  templateUrl: "./create-account.component.html",
  styleUrls: ["./create-account.component.scss"],
  providers: [DatabaseService, ValidationService, AuthorizationService],
})
export class CreateAccountComponent extends BaseComponent implements OnInit {
  //@TODO make weight class, age class, etc. autocompletes
  newUserForm: FormGroup;
  title: string = "Create an Account";
  genders: Array<string> = constants.genders;
  weightClasses: any[];
  noGiRanks: any[];
  giRanks: any[];
  ageClasses: any[];
  ages: Array<number> = new Array<number>();
  disabledAge: boolean = true;
  disabledNoGiRank: boolean = false;
  disabledGiRank: boolean = false;
  disabledAgeClass: boolean = false;
  private localConfigOptions: DynamicFormConfiguration;
  private stopCounter: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private vs: ValidationService,
    private as: AuthorizationService,
    private trackerService: TrackerService,
    private defaultErrorStateMatcher: ErrorStateMatcher,
    private questionService: QuestionService,
    private formProcessingService: FormProcessingService,
    private databaseService: DatabaseService,
    private textTransformationService: TextTransformationService,
    public snackBar: MatSnackBar,
    public ngZone: NgZone
  ) {
    super();
  }

  ngOnInit() {
    this.handleFormSubmission();
    this.questionService
      .getAccountCreationQuestions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((accountCreationQuestions) => {
        if (accountCreationQuestions) {
          this.localConfigOptions = new DynamicFormConfiguration(
            accountCreationQuestions,
            [],
            "CREATE"
          );
        }
      });
  }

  handleFormSubmission() {
    let self = this;
    this.formProcessingService.formSubmitted
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((isFormSubmitted) => {
        if (isFormSubmitted && this.stopCounter < 1) {
          this.stopCounter++;
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
                  //begin custom stuff
                  if (currentFormQuestions) {
                    if (currentFormQuestions[0] !== "Stop") {
                      let newUser: User =
                        this.createUserObjFromDynamicForm(formResults);
                      this.addUserToDbHelper(newUser, formResults);
                    }
                  }
                }
              }
            });
        }
      });
  }

  createUserObjFromDynamicForm(formResults: any) {
    const {
      name,
      email,
      password,
      confirmPassword,
      affiliation,
      gender,
      giRank,
      noGiRank,
      weight,
      age,
    } = formResults;
    const newUser = new User(
      name,
      email,
      password,
      giRank,
      noGiRank,
      affiliation,
      Number(age),
      Number(weight),
      100,
      "",
      gender,
      new Date().toJSON()
    );
    return newUser;
  }

  addUserToDbHelper(newUser: User, formResults: any) {
    console.log("addUserToDbHelper entered");
    // let result = this.getValues();
    // console.log(result);
    const self = this;

    //The signup and db add HAVE to happen before the subscription. You've made this mistake before
    this.as.emailSignUp(newUser.getEmail(), newUser.getPassword());
    this.databaseService
      .addUserToDb(newUser)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((dbUserId: string) => {
        if (dbUserId) {
          self.trackerService.currentUserDbId.next(dbUserId); // app.component listens for this and reconciles the guid from firebase and adds it to a user with this node
          this.trackerService.currentUserDbId.next(dbUserId);
          //can assume success TODO
          let path: string = null;
          let candidatePath: string = null;
          let updateVal: any = null;
          if (formResults.gymAffiliation) {
            console.log("formResults.gymAffiliation exists...");
            path = "/gymAffiliations/";
            candidatePath = "/candidateGymAffiliations/";
            updateVal = formResults.gymAffiliation;
            self.databaseService
              .doesGenricCandidateAlreadyExistInDb(path, updateVal)
              .pipe(take(1))
              .subscribe((alreadyExists) => {
                console.log(
                  "alreadyExists in updateVideoDeet is: " + alreadyExists
                );
                if (!alreadyExists) {
                  self.databaseService.addGenericCandidateNameToDb(
                    candidatePath,
                    self.textTransformationService.capitalizeFirstLetter(
                      updateVal
                    ),
                    dbUserId
                  );
                }
              });
          }
          if (formResults.giRank) {
            console.log("formResults.giRank exists...");
            path = "/giRanks/";
            candidatePath = "/candidateGymAffiliations/";
            updateVal = formResults.giRank;
            self.databaseService
              .doesGenricCandidateAlreadyExistInDb(path, updateVal)
              .pipe(take(1))
              .subscribe((alreadyExists) => {
                console.log("alreadyExists in giRank is: " + alreadyExists);
                if (!alreadyExists) {
                  self.databaseService.addGenericCandidateNameToDb(
                    candidatePath,
                    self.textTransformationService.capitalizeFirstLetter(
                      updateVal
                    ),
                    dbUserId
                  );
                }
              });
          }
          if (formResults.noGiRank) {
            console.log("formResults.noGiRank exists...");
            path = "/noGiRanks/";
            candidatePath = "/candidateNoGiRanks/";
            updateVal = formResults.noGiRank;
            self.databaseService
              .doesGenricCandidateAlreadyExistInDb(path, updateVal)
              .pipe(take(1))
              .subscribe((alreadyExists) => {
                console.log("alreadyExists in noGiRank is: " + alreadyExists);
                if (!alreadyExists) {
                  self.databaseService.addGenericCandidateNameToDb(
                    candidatePath,
                    self.textTransformationService.capitalizeFirstLetter(
                      updateVal
                    ),
                    dbUserId
                  );
                }
              });
          }

          this.trackerService.currentUserBehaviorSubject.next(newUser);
          self.formProcessingService.stopFormAndQuestions();
          self.formProcessingService.finalSubmitButtonClicked.next(true);
          self.formProcessingService.restartFormAndQuestions(
            self.questionService.getAccountCreationQuestionsAsObj()
          );
          self.stopCounter = 0;
          // this.trackerService.currentUserUid
          //   .pipe(takeUntil(this.ngUnsubscribe))
          //   .subscribe((currentUid: string) => {
          //     console.log("deleteMe got her g1");
          //     console.log("deleteMe currentUid is: ");
          //     console.log(currentUid);
          //     if (currentUid) {
          //       console.log("deleteMe got her g2");
          //       this.databaseService.addUidToUser(currentUid, dbUserId);
          //     }
          //   });
          this.trackerService.currentUserBehaviorSubject
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((user) => {
              if (user) {
                if (user.uid) {
                  this.databaseService.addUidToUser(user.uid, dbUserId);
                }
                this.as.emailLogin(newUser.getEmail(), newUser.getPassword()); //TODO I'm not sure where to put this... putting it below FUBARs it
                self.openSnackBar(constants.userAddedToDbNotification);
                // TODO navigate to user page
                // this.ngZone.run(() => {
                //   console.log("deleteMe got here a6");
                //   this.router.navigate([
                //     constants.userInfoPath + "/" + user.uid,
                //   ]);
                //   console.log("deleteMe got here a7");
                // });
              }
            });
        } else {
          self.openSnackBar(constants.userAddedToDbFailureNotification);
        }
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 3000,
    });
  }
}
