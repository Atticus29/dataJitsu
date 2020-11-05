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
        // this.fps.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionArrayOfForm =>{
        //   // console.log("questionArrayOfForm in dynamic-for-QUESTION component is:");
        //   // console.log(questionArrayOfForm);
        //   if(questionArrayOfForm){
        //     if(questionArrayOfForm!== "Stop"){
        //       let objectPayLoad = this.form.getRawValue();
        //       this.form = this.qcs.toFormGroup(questionArrayOfForm);
        //       this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayOfForm);
        //     }
        //   }
        // });
      }

    // this.fps.captureDesiredInDynamicForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(captureFormDesired =>{
    //   if(captureFormDesired){
    //     console.log("this.question when next button clicked is:");
    //     console.log(this.question);
    //     console.log("this.threadNum when next button clicked is: " + this.threadNum);
    //     console.log("this.form.getRawValue() when next button clicked is:");
    //     console.log(this.form);
    //     console.log(this.form.getRawValue());
    //     this.fps.captureQuestionArrayOfCurrentFormInThread(this.questions, this.threadNum);
    //     this.fps.captureFormResultsInThread(this.form.getRawValue(), this.threadNum);
    //     console.log("form before:");
    //     console.log(this.form);
    //     this.form = this.qcs.toFormGroup(this.questions);
    //     console.log("form after");
    //     console.log(this.form);
    //     this.fps.captureDesiredInDynamicForm.next(false);
    //   }
    // });


  }

  repopulateFormWithPreviousPayload(form: FormGroup, payLoad: Object, questionArray: FormQuestionBase<string>[]){
    // console.log("repopulateFormWithPreviousPayload  in dynamic-form-QUESTION");
    let payLoadKeys: string[] = Object.keys(payLoad);
    // console.log("payLoadKeys is:");
    // console.log(payLoadKeys);
    let payLoadValues: string[] = Object.values(payLoad);
    // console.log("got here 1");
    for(let i=0; i<payLoadKeys.length; i++){
      // console.log("got here 2");
      if(questionArray.findIndex(q => q.key === payLoadKeys[i])>-1){
        // console.log("got here 3");
        let correspondingQuestionIndex = questionArray.findIndex(q => q.key === payLoadKeys[i]);
        let populatedFormControl: FormControl = questionArray[correspondingQuestionIndex].required ? new FormControl(payLoadValues[i] || '', Validators.required) :
        new FormControl(payLoadValues[i] || '');
        // console.log("got here 4");
        if(questionArray[correspondingQuestionIndex].type === 'dropdown'){
          populatedFormControl.setValue(payLoadValues[i]);
          // console.log("got here 5");
        }
        // console.log("got to set control");
        // console.log("before set control");
        // console.log(form);
        form.setControl(payLoadKeys[i], populatedFormControl);
        // console.log("after");
        // console.log(form);
        this.form.setControl(payLoadKeys[i], populatedFormControl);
        this.trackFormValidationAndEmit();
      }else{
      }
    }
  }

  trackFormValidationAndEmit(){
    // console.log("trackFormValidationAndEmit in dynamic-form-QUESTION");
    this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(valueChanges =>{
      // console.log("form value changes in dynamic form QUESTION");
      // console.log("valueChanges are:");
      // console.log(valueChanges);
      let objKeys: string[] = Object.keys(valueChanges);
      let objVals: string[] = Object.values(valueChanges);
      let givenValidValues: number[] = objVals.map(entry=>{if(entry){return 1;}else{return 0;}});
      if(this.question){
        let questionKeys: string = this.question.key;
        let requireds: number = this.question.required? 1:0;
        let counter: number = 0;
        counter ++;
        if(requireds>givenValidValues[objKeys.indexOf(questionKeys)]){ //because as soon as new form fields are added, question keys and object keys are no longer paralelle
            this.fps.formEntriesValid.next(false);
            counter --; //deduct counter because there's a mismatch
        }
        if(counter == 1){
          // console.log("all is valid...");
          this.fps.formEntriesValid.next(true); //everything that's required had values, so all valid
        }
      }
    });
  }

}
