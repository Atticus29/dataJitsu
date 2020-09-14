import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { FormQuestionBase } from './formQuestionBase.model';


@Injectable({
  providedIn: 'root'
})
export class FormProcessingService {
  public formResults: BehaviorSubject<any> = new BehaviorSubject(null);
  public questionArrayOfForm: BehaviorSubject<any> = new BehaviorSubject(null);
  public formThread: BehaviorSubject<any>[] = new Array<BehaviorSubject<any>>();
  public questionThread: BehaviorSubject<any>[] = new Array<BehaviorSubject<any>>();

  constructor() { }

  captureFormResults(formResults: any){
    console.log("formResults typeof in form-processing.service is: ");
    console.log(typeof formResults);
    this.formResults.next(formResults);
  }

  captureFormResultsInThread(formResults: any, threadNum: number){
    if(this.formThread.length < threadNum){
      for(let i = 0; i<threadNum-this.formThread.length; i++){
        this.formThread.push(new BehaviorSubject<any>(null));
      }
    }
    this.formThread[threadNum].next(formResults);
  }

  captureQuestionArrayOfCurrentForm(newValue:any){ //questionArray: FormQuestionBase<string>[]
    // console.log("captureQuestionArrayOfCurrentForm has been entered. New questionArray is: ");
    // console.log(newValue);
    this.questionArrayOfForm.next(newValue);
  }

  captureQuestionArrayOfCurrentFormInThread(newValue:any, threadNum: number){
    // console.log("captureQuestionArrayOfCurrentFormInThread has been entered. New questionArray is: ");
    // console.log(newValue);
    if(this.questionThread.length < threadNum){
      for(let i = 0; i<threadNum-this.questionThread.length; i++){
        this.questionThread.push(new BehaviorSubject<any>(null));
      }
    }
    this.questionThread[threadNum].next(newValue);
  }

  setAllFormThreadsTo(val: String){
    for(let i = 0; i<this.formThread.length; i++){
      this.formThread[i].next(val);
  }
}

  setAllQuestionThreadsTo(val: String){
    for(let i = 0; i<this.questionThread.length; i++){
      this.questionThread[i].next(val);
    }
  }
}
