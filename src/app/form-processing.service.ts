import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormQuestionBase } from './formQuestionBase.model';
import { QuestionService } from './question.service';


@Injectable({
  providedIn: 'root'
})
export class FormProcessingService {
  public formResults: BehaviorSubject<any> = new BehaviorSubject(null);
  public questionArrayOfForm: BehaviorSubject<any> = new BehaviorSubject(null);
  public nextButtonClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  // public backButtonClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public formSubmitted: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public actualForm: BehaviorSubject<FormGroup> = new BehaviorSubject(null);
  public collectionId: BehaviorSubject<string> = new BehaviorSubject(null);
  public ngUnsubscribe = new Subject<void>();
  public buttonDisplayName: BehaviorSubject<string> = new BehaviorSubject(null);

  constructor(private questionService: QuestionService) { }

  captureFormResults(formResults: any){
    console.log("captureFormResults emitted and formResults are:");
    console.log(formResults);
    this.formResults.next(formResults);
  }

  captureQuestionArrayOfCurrentForm(newValue:any){ //questionArray: FormQuestionBase<string>[]
    // console.log("captureQuestionArrayOfCurrentForm has been entered. New questionArray is: ");
    // console.log(newValue);
    this.questionArrayOfForm.next(newValue);
  }

  stopFormAndQuestions(){
    console.log("stopFormAndQuestions called");
    this.formResults.next(["Stop"]);
    this.questionArrayOfForm.next(["Stop"]);
  }

  restartFormAndQuestions(){
    console.log("restartFormAndQuestions called");
    this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(newCollectionQuestions=>{
      // console.log("newCollectionQuestions in restartFormAndQuestions returns:");
      // console.log(newCollectionQuestions);
      if(newCollectionQuestions){
        // console.log("newCollectionQuestions in restartFormAndQuestions in form processing service are: ");
        // console.log(newCollectionQuestions);
        this.questionArrayOfForm.next(newCollectionQuestions);
        this.formResults.next(null);
        this.nextButtonClicked.next(false);
        this.buttonDisplayName.next(null);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

      }
    });
  }
}
