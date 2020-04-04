import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { FormQuestionBase } from './formQuestionBase.model';


@Injectable({
  providedIn: 'root'
})
export class FormProcessingService {
  public formResults: BehaviorSubject<any> = new BehaviorSubject(null);
  public questionArrayOfForm: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() { }

  captureFormResults(formResults: any){
    this.formResults.next(formResults);
  }

  captureQuestionArrayOfCurrentForm(questionArray: FormQuestionBase<string>[]){
    this.questionArrayOfForm.next(questionArray);
  }
}
