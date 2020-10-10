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

  captureFormResultsInThread(formResults: any, threadNum: number){
    if(this.formThread.length < threadNum){
      for(let i = 0; i<threadNum-this.formThread.length; i++){
        this.formThread.push(new BehaviorSubject<any>(null));
      }
    }
    this.formThread[threadNum-1].next(formResults);
  }

  captureQuestionArrayOfCurrentFormInThread(newValue:any, threadNum: number){
    if(this.questionThread.length < threadNum){
      for(let i = 0; i<threadNum-this.questionThread.length; i++){
        this.questionThread.push(new BehaviorSubject<any>(null));
        this.questionThreadCounter.next(threadNum);
      }
    }
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
