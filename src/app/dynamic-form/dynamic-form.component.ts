import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import { QuestionControlService } from '../question-control.service';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { DatabaseService } from '../database.service';
import { FormProcessingService } from '../form-processing.service';
import { BaseComponent } from '../base/base.component';
import { FormQuestionBase } from '../formQuestionBase.model';
import { Collection } from '../collection.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})

export class DynamicFormComponent extends BaseComponent implements OnInit, OnDestroy{
  @Input() questions: FormQuestionBase<string>[] = [];
  @Input() configOptions: DynamicFormConfiguration;
    form: FormGroup;
    payLoad: string = '';
    private threadNum: number;

    constructor(private qcs: QuestionControlService, private formProcessingService: FormProcessingService) {
      super();
    }

    ngOnInit() {
      this.form = this.qcs.toFormGroup(this.questions);
      this.trackFormValidationAndEmit();
      this.threadNum = this.configOptions.getThreadNum();
      if(this.formProcessingService.questionThread.length>0){
        this.formProcessingService.questionThread[this.threadNum-1].pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionArrayOfForm =>{
          if(questionArrayOfForm){
            if(questionArrayOfForm!== "Stop"){
              this.questions = questionArrayOfForm;
            }
          }
        });
      }
      this.formProcessingService.captureDesiredInDynamicForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(captureFormDesired =>{
        // console.log("captureFormDesired is: " + captureFormDesired);
        if(captureFormDesired){
          // this.propagateCaptureOfFormResults();
          this.formProcessingService.captureQuestionArrayOfCurrentFormInThread(this.questions, this.threadNum);
          this.formProcessingService.captureFormResultsInThread(this.form.getRawValue(), this.threadNum);
          this.formProcessingService.captureDesiredInDynamicForm.next(false);
        }
      });
    }

    trackFormValidationAndEmit(){
      this.form.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(valueChanges =>{
        let objKeys: string[] = Object.keys(valueChanges);
        console.log("objKeys are: ");
        console.log(objKeys);
        let objVals: string[] = Object.values(valueChanges);
        let givenValidValues: number[] = objVals.map(entry=>{if(entry){return 1;}else{return 0;}});
        console.log("givenValidValues are: ");
        console.log(givenValidValues);
        if(this.questions){
          console.log("this.questions are:");
          console.log(this.questions);
          let questionKeys: string[] = this.questions.map(entry =>{
            return entry.key;
          });
          console.log("questionKeys are:");
          console.log(questionKeys);
          let requireds: number[] = this.questions.map(entry=>{ if(entry.required){return 1;} else{return 0;}});
          console.log("requireds are: ");
          console.log(requireds);
          let counter: number = 0;
          for(let i=0; i<requireds.length; i++){
            counter ++;
            if(requireds[i]>givenValidValues[objKeys.indexOf(questionKeys[i])]){ // objKeys.indexOf(questionKeys[i])
              console.log("mismatch at index: " + i);
              console.log("requireds[i]: " +requireds[i]);
              console.log("givenValidValues[i]: " + givenValidValues[i]);
                this.formProcessingService.formEntriesValid.next(false);
                counter --; //deduct counter because there's a mismatch
            }
          }
          if(counter == requireds.length){
            console.log("no mismatches");
            this.formProcessingService.formEntriesValid.next(true);
          } //everything that's required had values, so all valid
        }
      });
    }

    getSum(total, num){
      return total + num;
    }

    processForm(questions: FormQuestionBase<string>[]){
      console.log("processForm clicked");
      // this.payLoad = JSON.stringify(this.form.getRawValue());
      this.formProcessingService.captureQuestionArrayOfCurrentFormInThread(questions, this.threadNum);
      this.formProcessingService.captureFormResultsInThread(this.form.getRawValue(), this.threadNum);
      this.formProcessingService.formSubmitted.next(true);
    }

    // propagateCaptureOfFormResults(){
    //     this.formProcessingService.captureFormResultsInThread(this.form.getRawValue(), this.threadNum);
    // }

    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number, submitAfterThisQuestion: boolean){
      let newQuestionToBeAdded: FormQuestionBase<string> = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, true, true, submitAfterThisQuestion); //TODO last argument true??
      let baseKey: string = question.key.split(/\d+/)[0];
      let newIndex: number = FormQuestionBase.calculateCurrentHighestIndexWithThisBaseKey(baseKey,questionArray) + 1;
      newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingKeyOfExistingQuestion(newQuestionToBeAdded, baseKey+newIndex);
      let previousQuestionModified = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false, false, false);
      previousQuestionModified = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(previousQuestionModified, false);
      questionArray[index] = previousQuestionModified;
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, [newQuestionToBeAdded], index);
      // this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      this.formProcessingService.captureQuestionArrayOfCurrentFormInThread(questionArrayCombiningNewAndOld, this.threadNum);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);
    }
    addAnotherQuestionGroup(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      let lastSiblingIndex = question.findLastSiblingQuestionIndex(question, questionArray, index);
      let updatedQuestion: FormQuestionBase<string> = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(question, false);
      questionArray[index] = updatedQuestion;
      let newQuestionGroup = this.configOptions.getOriginalQuestionGroup();
      let renamedNewQuestionGroup = FormQuestionBase.renameNewQuestionGroup(questionArray, newQuestionGroup);
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, renamedNewQuestionGroup, lastSiblingIndex);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      this.formProcessingService.captureQuestionArrayOfCurrentFormInThread(questionArrayCombiningNewAndOld, this.threadNum);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);
    }

    repopulateFormWithPreviousPayload(form: FormGroup, payLoad: Object, questionArray: FormQuestionBase<string>[]){
      let payLoadKeys: string[] = Object.keys(payLoad);
      let payLoadValues: string[] = Object.values(payLoad);
      for(let i=0; i<payLoadKeys.length; i++){
        if(questionArray.findIndex(q => q.key === payLoadKeys[i])>-1){
          let correspondingQuestionIndex = questionArray.findIndex(q => q.key === payLoadKeys[i]);
          let populatedFormControl: FormControl = questionArray[correspondingQuestionIndex].required ? new FormControl(payLoadValues[i] || '', Validators.required) :
          new FormControl(payLoadValues[i] || '');
          if(questionArray[correspondingQuestionIndex].type === 'dropdown'){
            populatedFormControl.setValue(payLoadValues[i]);
          }
          console.log("got to set control");
          form.setControl(payLoadKeys[i], populatedFormControl);
          this.trackFormValidationAndEmit();
        }else{
        }
      }
    }
}
