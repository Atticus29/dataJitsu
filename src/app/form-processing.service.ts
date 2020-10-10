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
  public questionThreadCounter: BehaviorSubject<number> = new BehaviorSubject(null);

  constructor() { }

  captureFormResults(formResults: any){
    console.log("formResults typeof in form-processing.service is: ");
    console.log(typeof formResults);
    this.formResults.next(formResults);
  }

  captureFormResultsInThread(formResults: any, threadNum: number){
    console.log("captureFormResultsInThread entered");
    if(this.formThread.length < threadNum){
      for(let i = 0; i<threadNum-this.formThread.length; i++){
        this.formThread.push(new BehaviorSubject<any>(null));
        // console.log("got here");

      }
    }
    this.formThread[threadNum-1].next(formResults);
    console.log("this.formThread is:");
    console.log(this.formThread);
  }

  captureQuestionArrayOfCurrentForm(newValue:any){ //questionArray: FormQuestionBase<string>[]
    console.log("captureQuestionArrayOfCurrentForm has been entered. New questionArray is: ");
    console.log(newValue);
    this.questionArrayOfForm.next(newValue);
  }

  captureQuestionArrayOfCurrentFormInThread(newValue:any, threadNum: number){
    console.log("captureQuestionArrayOfCurrentFormInThread has been entered. New questionArray is: ");
    console.log(newValue);
    console.log("threadNum is: " + threadNum);
    console.log("this.questionThread.length is " + this.questionThread.length);
    if(this.questionThread.length < threadNum){
      for(let i = 0; i<threadNum-this.questionThread.length; i++){
        // console.log("got here!");
        this.questionThread.push(new BehaviorSubject<any>(null));
        this.questionThreadCounter.next(threadNum);
      }
    }
    this.questionThread[threadNum-1].next(newValue);
    console.log("this.questionThread is:");
    console.log(this.questionThread);
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
