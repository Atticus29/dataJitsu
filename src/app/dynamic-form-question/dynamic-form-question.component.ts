import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import { FormQuestionBase } from '../formQuestionBase.model';
import { QuestionControlService } from '../question-control.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent extends BaseComponent implements OnInit {
  @Input() question: FormQuestionBase<string>;
  @Input() form: FormGroup;
  get isValid() {
    let returnVal = null;
    if(this.form){
      if(this.question){
        if(this.question.key){
          if(this.form.controls[this.question.key]){
              returnVal = this.form.controls[this.question.key].valid? this.form.controls[this.question.key].valid: null;
              return returnVal;
          } else{
            return returnVal;
          }
        }else{
          return returnVal;
        }
      }else{
        return returnVal;
      }
    } else{
      return returnVal;
    }

  }

  constructor(private qcs: QuestionControlService, private fps: FormProcessingService) {
    super();
  }

  ngOnInit() {
    this.fps.questionThreadCounter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionThreadCount =>{
      if(questionThreadCount>0){
        this.fps.questionThread[questionThreadCount-1].pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionArrayOfForm =>{
          console.log("questionArrayOfForm in dynamic-for-QUESTION component is:");
          console.log(questionArrayOfForm);
          if(questionArrayOfForm){
            if(questionArrayOfForm!== "Stop"){
              let objectPayLoad = this.form.getRawValue();
              // this.fps.captureQuestionArrayOfCurrentFormInThread(questionArrayOfForm, questionThreadCount);
              this.form = this.qcs.toFormGroup(questionArrayOfForm);
              console.log("objectPayLoad in dynamic-form-QUESTION component is: ");
              console.log(objectPayLoad);
              this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayOfForm);
            }
          }
        });
      }
    });
  }

  repopulateFormWithPreviousPayload(form: FormGroup, payLoad: Object, questionArray: FormQuestionBase<string>[]){
    console.log("repopulateFormWithPreviousPayload  in dynamic-form-QUESTION");
    let payLoadKeys: string[] = Object.keys(payLoad);
    console.log("payLoadKeys is:");
    console.log(payLoadKeys);
    let payLoadValues: string[] = Object.values(payLoad);
    console.log("got here 1");
    for(let i=0; i<payLoadKeys.length; i++){
      console.log("got here 2");
      if(questionArray.findIndex(q => q.key === payLoadKeys[i])>-1){
        console.log("got here 3");
        let correspondingQuestionIndex = questionArray.findIndex(q => q.key === payLoadKeys[i]);
        let populatedFormControl: FormControl = questionArray[correspondingQuestionIndex].required ? new FormControl(payLoadValues[i] || '', Validators.required) :
        new FormControl(payLoadValues[i] || '');
        console.log("got here 4");
        if(questionArray[correspondingQuestionIndex].type === 'dropdown'){
          populatedFormControl.setValue(payLoadValues[i]);
          console.log("got here 5");
        }
        console.log("got to set control");
        console.log("before set control");
        console.log(form);
        form.setControl(payLoadKeys[i], populatedFormControl);
        console.log("after");
        console.log(form);
        this.form.setControl(payLoadKeys[i], populatedFormControl);
        // this.trackFormValidationAndEmit();
      }else{
      }
    }
  }

  // trackFormValidationAndEmit(){
  //   console.log("trackFormValidationAndEmit in dynamic-form-QUESTION");
  //   this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(valueChanges =>{
  //     let objKeys: string[] = Object.keys(valueChanges);
  //     let objVals: string[] = Object.values(valueChanges);
  //     let givenValidValues: number[] = objVals.map(entry=>{if(entry){return 1;}else{return 0;}});
  //     if(this.questions){
  //       let questionKeys: string[] = this.questions.map(entry =>{
  //         return entry.key;
  //       });
  //       let requireds: number[] = this.questions.map(entry=>{ if(entry.required){return 1;} else{return 0;}});
  //       let counter: number = 0;
  //       for(let i=0; i<requireds.length; i++){
  //         counter ++;
  //         if(requireds[i]>givenValidValues[objKeys.indexOf(questionKeys[i])]){ //because as soon as new form fields are added, question keys and object keys are no longer paralelle
  //             this.fps.formEntriesValid.next(false);
  //             counter --; //deduct counter because there's a mismatch
  //         }
  //       }
  //       if(counter == requireds.length){
  //         this.fps.formEntriesValid.next(true); //everything that's required had values, so all valid
  //       }
  //     }
  //   });
  // }

}
