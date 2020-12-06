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

  constructor(private questionService: QuestionService) { }

  captureFormResults(formResults: any){
    this.formResults.next(formResults);
  }

  captureQuestionArrayOfCurrentForm(newValue:any){ //questionArray: FormQuestionBase<string>[]
    // console.log("captureQuestionArrayOfCurrentForm has been entered. New questionArray is: ");
    // console.log(newValue);
    this.questionArrayOfForm.next(newValue);
  }

  stopFormAndQuestions(){
    this.formResults.next("Stop");
    this.questionArrayOfForm.next("Stop");
  }

  restartFormAndQuestions(){
    this.questionService.getNewCollectionQuestions().pipe(takeUntil(this.ngUnsubscribe)).subscribe(newCollectionQuestions=>{
      if(newCollectionQuestions){
        console.log("newCollectionQuestions in restartFormAndQuestions in form processing service are: ");
        console.log(newCollectionQuestions);
        this.questionArrayOfForm.next(newCollectionQuestions);
        this.formResults.next(null);
        this.nextButtonClicked.next(false);
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();

      }
    });
  }
}
