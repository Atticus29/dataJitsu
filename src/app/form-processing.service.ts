import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { FormQuestionBase } from './formQuestionBase.model';


@Injectable({
  providedIn: 'root'
})
export class FormProcessingService {
  // public formResults: BehaviorSubject<any> = new BehaviorSubject(null);
  public questionArrayOfForm: BehaviorSubject<any> = new BehaviorSubject(null);
  public nextButtonClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public backButtonClicked: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  captureFormResultsInThread(formResults: any, threadNum: number){
    // console.log("captureFormResultsInThread entered");
    if(this.formThread.length < threadNum){
      for(let i = 0; i<threadNum-this.formThread.length; i++){
        this.formThread.push(new BehaviorSubject<any>(null));
        this.formResultsThreadCounter.next(threadNum);
      }
    }
    this.formThread[threadNum-1].next(formResults);
    // console.log("this.formThread[threadNum-1] is:");
    // console.log(this.formThread[threadNum-1]);
  }

  captureQuestionArrayOfCurrentFormInThread(newValue:any, threadNum: number){
    // console.log("captureQuestionArrayOfCurrentFormInThread entered");
    if(this.questionThread.length < threadNum){
      for(let i = 0; i<threadNum-this.questionThread.length; i++){
        // console.log("previous this.questionThread size was: " + this.questionThread.length);
        this.questionThread.push(new BehaviorSubject<any>(null));
        // console.log("new this.questionThread size is: " + this.questionThread.length);
        this.questionThreadCounter.next(threadNum);
      }
    }
    // console.log("threadNum-1 is: " + (threadNum-1));
    // console.log("newValue is ");
    // console.log(newValue);
    // console.log("this.questionThread is:");
    // console.log(this.questionThread);
    this.questionThread[threadNum-1].next(newValue);
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
