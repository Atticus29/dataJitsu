import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil, withLatestFrom } from 'rxjs/operators';
import {MatSnackBar} from '@angular/material';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { QuestionService } from '../question.service';
import { User } from '../user.model';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { FormProcessingService } from '../form-processing.service';
import { FormQuestionBase } from 'app/formQuestionBase.model';
import { constants } from '../constants';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent extends BaseComponent implements OnInit {
  private localDetailList: User[] = null;
  private localConfigOptions: DynamicFormConfiguration;
  private localQuestions: FormQuestionBase<any>[];
  // private currentQuestion: any;
  private stopCounter = 0;
  private showLoader: boolean = false;

  constructor(
      private databaseService: DatabaseService,
      private questionService: QuestionService,
      private formProcessingService: FormProcessingService,
      public snackBar: MatSnackBar
    ) {
    super();
  }

  async ngOnInit() {
    const self = this;
    this.databaseService.getUsers().pipe(takeUntil(this.ngUnsubscribe)).subscribe(userResults => {
      this.localDetailList = userResults;
    });
    try {
      this.questionService.getUserDeleteQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((userDeleteQuestionObj) => {
        if (userDeleteQuestionObj) {
          this.localConfigOptions = new DynamicFormConfiguration(userDeleteQuestionObj, [], 'Delete');
          // this.localQuestions = userDeleteQuestionObj;
          this.formProcessingService.captureQuestionArrayOfCurrentForm(this.localQuestions);
          this.handleFormSubmission();
        }
      });

      // this.questionService.getUserEditQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe((userEditQuestionsObj) => { //TODO change this method to one that fetches a hashmap of question objects keyed by displayItem.originalKey and pull it out by said key
      //   console.log("userEditQuestionsObj is: ");
      //   console.log(userEditQuestionsObj);
      //   if (userEditQuestionsObj && originalKey) {
      //     this.localConfigOptions = new DynamicFormConfiguration(userEditQuestionsObj[originalKey], [], "Save");
      //     let currentQuestion = userEditQuestionsObj[originalKey];
      //     currentQuestion.submitAfterThisQuestion = true;
      //     this.currentQuestion = userEditQuestionsObj[originalKey];
      //     this.formProcessingService.captureQuestionArrayOfCurrentForm([currentQuestion]);
      //   }
      // });
    } catch (error) {
      console.log('error getting the user edit autocomplete');
      console.log(error);
    }
}

  handleFormSubmission() {
    console.log('deleteMe handleFormSubmission entered');
    this.formProcessingService.formSubmitted.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isFormSubmitted => {
      console.log('deleteMe isFormSubmitted for user-delete-component is: ' + isFormSubmitted);
      if (isFormSubmitted && this.stopCounter < 1) {
        this.showLoader = true;
        console.log('deleteMe got here 1');
        this.stopCounter++;
        const formResultObservableWithLatestQuestions = this.formProcessingService.formResults.pipe(
          withLatestFrom(this.formProcessingService.questionArrayOfForm)
        );
        console.log('deleteMe got here 2/3');
        formResultObservableWithLatestQuestions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(combinedResults => {
          console.log('deleteMe got here 4');
          const formResults = combinedResults[0];
          const currentFormQuestions = combinedResults[1];
          if (formResults) {
            console.log('deleteMe got here 5');
            if (formResults[0] !== "Stop") {
              console.log('deleteMe got here 6');
              // begin custom stuff
              if (currentFormQuestions) {
                console.log('deleteMe got here 7');
                if (currentFormQuestions[0] !== 'Stop') {
                  console.log('deleteMe got here 8');
                  console.log('dleteMe formResults are: ');
                  console.log(formResults);
                  this.handleUserDeletion(formResults, self);
                  // TODO delete user
                  // TODO handle resetting the form
                  // let newUser: User = this.createUserObjFromDynamicForm(formResults);
                  // this.addUserToDbHelper(newUser, formResults);
                }
              }
            }
          }
        });
      }
    });
  }

  handleUserDeletion(formResults, self) {
    const userName: string = formResults ? formResults.userDelete : null ;
    this.databaseService.getFirstUserByUsername(userName).pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(results => {
        try {
            console.log('about to delete user with email address: ' + results.email);
            const deletionResponse: Observable<any> = this.databaseService.deleteUserByEmail(results.email);
            deletionResponse.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
              console.log('deleteMe result of deletion call is: ');
              console.log(result);
              this.showLoader = false;
              this.openSnackBar(result.message);
              if(!(result.ok)){
                console.log('deleteMe resoponse was not ok');
              } else{
                this.databaseService.deleteUserFromDatabase(results.email);
              }
            });
          } catch (error) {
            console.log('deleteMe got here error is: ');
            console.log(error);
          }
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
    });
  }

}
