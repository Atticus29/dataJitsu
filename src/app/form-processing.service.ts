import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { FormQuestionBase } from './formQuestionBase.model';


@Injectable({
  providedIn: 'root'
})
export class FormProcessingService {
  public formResults: BehaviorSubject<any> = new BehaviorSubject(null);
  public questionArrayOfForm: BehaviorSubject<any> = new BehaviorSubject(null);
  public nextButtonClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public backButtonClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public formSubmitted: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

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
}
