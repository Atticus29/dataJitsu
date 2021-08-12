import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { QuestionService } from '../question.service';
import { User } from '../user.model';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { FormProcessingService } from '../form-processing.service';

@Component({
  selector: 'app-user-delete',
  templateUrl: './user-delete.component.html',
  styleUrls: ['./user-delete.component.scss']
})
export class UserDeleteComponent extends BaseComponent implements OnInit {
  private localDetailList: User[] = null;
  private localConfigOptions: DynamicFormConfiguration;
  private currentQuestion: any;

  constructor(
      private databaseService: DatabaseService,
      private questionService: QuestionService,
      private formProcessingService: FormProcessingService
    ) {
    super();
  }

  async ngOnInit() {
    try {
      this.questionService.getUserDeleteQuestion().pipe(takeUntil(this.ngUnsubscribe)).subscribe((userDeleteQuestionObj) => {
        if (userDeleteQuestionObj) {
          this.localConfigOptions = new DynamicFormConfiguration(userDeleteQuestionObj, [], 'Delete');
          this.currentQuestion = userDeleteQuestionObj[0];
          this.formProcessingService.captureQuestionArrayOfCurrentForm([this.currentQuestion]);
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


    const userEmail: String = 'tmp11@gmail.com';
    try {
      this.databaseService.getUsers().pipe(takeUntil(this.ngUnsubscribe)).subscribe(userResults =>{
        this.localDetailList = userResults;
        console.log('deleteMe localDetailList is: ');
        console.log(this.localDetailList);
        // const nameAndEmails = userResults.map(result => {
        //   return {name: result.name, email: result.email};
        // });
        // console.log('nameAndEmails is: ');
        // console.log(nameAndEmails);
      });

      const deletionStatus: Observable<boolean> = this.databaseService.deleteUserByEmail(userEmail);
      deletionStatus.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        console.log('deleteMe result of deletion call is: ');
        console.log(result);
      })
    } catch (error) {
      console.log('deleteMe got here error is: ');
      console.log(error);
      // this.openSnackBar(error.message);
      // this.cardErrors = error.message;
      // this.subscriptionStatus = '';
    }
  }

}
