import { Component, OnInit } from '@angular/core';

import { takeUntil, withLatestFrom } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { constants } from '../constants';
import { TrackerService } from '../tracker.service';
import { BaseComponent } from '../base/base.component';
import { TextTransformationService } from '../text-transformation.service';
import { QuestionService } from 'app/question.service';
import { FormProcessingService } from 'app/form-processing.service';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-user-info-edit',
  templateUrl: './user-info-edit.component.html',
  styleUrls: ['./user-info-edit.component.scss']
})
export class UserInfoEditComponent extends BaseComponent implements OnInit {
  private displayItems: {}[] = [];
  private editableParams: String[] = null;
  private displayData: any[] = null;
  private stopCounter: number = 0;
  private displayMode: boolean = true;
  private localConfigOptions: DynamicFormConfiguration;
  private currentQuestion: any;
  private userInDbId: any = null;
  private localPrivileges: any = null;

  constructor(private trackerService: TrackerService, private textTransformationService: TextTransformationService, private questionService: QuestionService, private formProcessingService: FormProcessingService, public snackBar: MatSnackBar, private databaseService: DatabaseService) {
    super();
  }

  ngOnInit() {
    this.handleFormSubmission();
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currentUsr  =>{
      this.userInDbId = currentUsr;
    });
    let localUsr = this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(usrResults => {
      if (usrResults) {
        const userParams = Object.keys(usrResults);
        this.editableParams = userParams.filter(param => {
          if (constants.editableUserInfoList.indexOf(param) > 0) {
            return param;
          }
        });
        userParams.forEach(param => {
          if (constants.displayableUserInfoObj[param] != null) {
            let currentObj: {} = {param: usrResults[param]};
            currentObj['originalKey'] = param;
            if (param === constants.privilegesParamName){
              currentObj['isPrivileges'] = true;
              let paramObj: any = usrResults[param];
              let paramObjKeys = Object.keys(paramObj);
              this.localPrivileges = [];
              paramObjKeys.forEach(paramObjkey =>{
                this.localPrivileges.push({"displayName":constants.displayablePrivilegesInfoObj[paramObjkey], "val": paramObj[paramObjkey]});
              });
              // console.log("this.localPrivileges is: ");
              // console.log(this.localPrivileges);

            }
            if (typeof usrResults[param] === "string" && param.includes(constants.stringSharedByAllDateParams)){
              let transformedText = this.textTransformationService.simplifyDateString(usrResults[param]);
              currentObj['param'] = transformedText;
            }
            currentObj['displayWords'] = constants.displayableUserInfoObj[param];
            // console.log("currentObj is: ");
            // console.log(currentObj);
            // console.log("type is: ");
            // console.log(typeof usrResults[param]);
            this.displayItems = this.replaceOrAddInto(this.displayItems, currentObj);
          }
        });
        this.stopCounter ++;
      }
    });
  }

  replaceOrAddInto(arrayOfItems, currentCandidate){
    let returnVal = arrayOfItems;
    let indexOfMatch = arrayOfItems.map(item => item.originalKey).indexOf(currentCandidate.originalKey);
    if(indexOfMatch<0){
      returnVal.push(currentCandidate);
    } else{
      returnVal[indexOfMatch] = currentCandidate;
    }
    return returnVal;
  }

  toggleEdit(displayItem: any){
    console.log("displayItem in toggleEdit is: ");
    console.log(displayItem);
    let originalKey = displayItem.originalKey ? displayItem.originalKey: null;
    this.stopCounter = 0;
    this.questionService.getUserEditQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe((userEditQuestionsObj) => { //TODO change this method to one that fetches a hashmap of question objects keyed by displayItem.originalKey and pull it out by said key
      console.log("userEditQuestionsObj is: ");
      console.log(userEditQuestionsObj);
      if (userEditQuestionsObj && originalKey){
        this.localConfigOptions = new DynamicFormConfiguration(userEditQuestionsObj[originalKey], [], "Save");
        let currentQuestion = userEditQuestionsObj[originalKey];
        currentQuestion.submitAfterThisQuestion = true;
        this.currentQuestion = userEditQuestionsObj[originalKey];
        this.formProcessingService.captureQuestionArrayOfCurrentForm([currentQuestion]);
      }
    });
    this.displayMode = false;
  }

  handleFormSubmission() { //TODO edit
    //when form is submitted --------------------
    let self = this;
    this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted => {
      console.log("form submitted monitoring in video-display firing off");
      // console.log("isFormSubmitted is: " + isFormSubmitted);
      if (isFormSubmitted && this.stopCounter < 1) {
        this.stopCounter++;
        console.log("form is submitted and stop counter less than one");
        let formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(withLatestFrom(this.formProcessingService.questionArrayOfForm));
        formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults => {
          console.log("combinedResults are: ");
          console.log(combinedResults);
          let formResults = combinedResults[0];
          console.log("formResults are:");
          console.log(formResults);
          let currentFormQuestions = combinedResults[1];
          if (formResults) { //formSubmitted &&
            if (formResults[0] !== "Stop") {
              //begin custom stuff
              console.log("formResults are: ");
              console.log(formResults);
              if (currentFormQuestions) {
                if (currentFormQuestions[0] !== "Stop") {
                  if (this.userInDbId) {
                    let path: string = null;
                    let updateVal: any = null;
                    let oldVal: any = null;
                    let formKeys = Object.keys(formResults);
                    console.log("formKeys is: ");
                    console.log(formKeys);
                    let userInDbIdKeys = Object.keys(this.userInDbId);
                    console.log("userInDbIdKeys is: ");
                    console.log(userInDbIdKeys);
                    if (formKeys.length === 1 && this.userInDbId.id){
                      //just want to update one at a time
                      path = '/users/' + this.userInDbId.id + '/' + formKeys[0] + '/';
                      updateVal = formResults[formKeys[0]];
                      oldVal = this.userInDbId[formKeys[0]];
                      console.log("path is: " + path);
                      console.log("updateVal is: " + updateVal);
                      console.log("oldVal is: " + oldVal);
                    }

                    //TODO check if entry already exists in any lists!!
                    if (path && updateVal) {
                      console.log("currentFormQuestions right before entering updateUser is:");
                      console.log(currentFormQuestions);
                      this.databaseService.updateUser(currentFormQuestions[0], path, updateVal).pipe(takeUntil(this.ngUnsubscribe)).subscribe(additionStatus => { //currentFormQuestions[0] assumes all of the update content on this page are single-question arrays
                        console.log("additionStatus is: " + additionStatus);
                        if (additionStatus) {
                          self.openSnackBar(constants.userDetailUpdatedNotification);
                          // self.formProcessingService.collectionId.next(null);
                          self.formProcessingService.stopFormAndQuestions();
                          self.formProcessingService.finalSubmitButtonClicked.next(true);
                          self.formProcessingService.restartFormAndQuestions(self.questionService.getShamQuestionAsObj());
                          self.stopCounter = 0;
                          this.hideEditAndShowNewValue(formResults);
                          // self.displayModeInd1 = !self.displayModeInd1;
                        } else {
                          self.openSnackBar(constants.userDetailUpdateFailureNotification);
                          this.hideEditAndShowNewValue(formResults);
                          // self.displayModeInd1 = !self.displayModeInd1;
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

  hideEditAndShowNewValue(formResults: any) {
    if (formResults) {
      this.displayMode = true;
    }
  }

  cancelForm(){
    this.displayMode = true;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }


}
