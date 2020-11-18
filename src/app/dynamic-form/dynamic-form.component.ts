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
    private localButtonDisplayName: String;
    // gridLengthsForButtons: number = null;
    // gridLengthsForInput: number = null;

    constructor(private qcs: QuestionControlService, private formProcessingService: FormProcessingService) {
      super();
    }

    ngOnInit() {
      this.form = this.qcs.toFormGroup(this.questions);
      // this.formProcessingService.form
      this.localButtonDisplayName = this.configOptions.getSubmitButtonDisplay();
      // this.gridLengthsForButtons = this.configOptions.getGridLengthsForButtons();
      // console.log("gridLengthsForButtons are: " + this.gridLengthsForButtons);
      // this.gridLengthsForInput = this.configOptions.getGridLengthsForInput();
      // console.log("gridLengthsForInput is: " + this.gridLengthsForInput);
      // console.log("questions upon entry into ngOnInit of DynamicFormComponent are");
      // console.log(this.questions);
      this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionArrayOfForm =>{
        // console.log("questionArrayOfForm emitted in formProcessingService. questionArrayOfForm is: ");
        // console.log(questionArrayOfForm);
        if(questionArrayOfForm){
          if(questionArrayOfForm!== "Stop"){
            this.questions = questionArrayOfForm;
          }
        }
      });
    }

    processForm(questions: FormQuestionBase<string>[]){
      console.log("processForm called");
      console.log("questions are:");
      console.log(questions);
      // console.log(this.form.getRawValue());
      this.payLoad = JSON.stringify(this.form.getRawValue());
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questions);
      this.formProcessingService.captureFormResults(this.form.getRawValue());
      this.formProcessingService.formSubmitted.next(true);
      // if(this.configOptions.getSubmitButtonDisplay()==="Next"){
      //   this.formProcessingService.nextButtonClicked.next(true);
      // }
      // if(this.configOptions.getSubmitButtonDisplay()==="Back"){
      //   this.formProcessingService.backButtonClicked.next(true);
      // }
    }

    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number, submitAfterThisQuestion: boolean){
      console.log("addAnotherQuestion entered");
      // console.log("question is: ")
      // console.log(question);
      // console.log("questionArray is: ");
      // console.log(questionArray);
      // console.log("index is: " + index);
      // console.log("submitAfterThisQuestion is: " + submitAfterThisQuestion);
      let newQuestionToBeAdded: FormQuestionBase<string> = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, true, true, submitAfterThisQuestion); //TODO last argument true??
      let baseKey: string = question.key.split(/\d+/)[0];
      let newIndex: number = FormQuestionBase.calculateCurrentHighestIndexWithThisBaseKey(baseKey,questionArray) + 1;
      newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingKeyOfExistingQuestion(newQuestionToBeAdded, baseKey+newIndex);
      let previousQuestionModified = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false, false, false);
      previousQuestionModified = FormQuestionBase.createNewQuestionByModifyingExistingQuestion(previousQuestionModified, false, false);
      questionArray[index] = previousQuestionModified;
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, [newQuestionToBeAdded], index);
      // this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questionArrayCombiningNewAndOld);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      console.log(this.form.getRawValue()[question.key]);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);
      console.log(this.form.getRawValue()[question.key]);
    }
    addAnotherQuestionGroup(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      console.log("addAnotherQuestionGroup entered");
      let lastSiblingIndex = question.findLastSiblingQuestionIndex(question, questionArray, index);
      let updatedQuestion: FormQuestionBase<string> = FormQuestionBase.createNewQuestionByModifyingExistingQuestion(question, false, false);
      console.log("new old question is: ");
      console.log(updatedQuestion);
      console.log("index into which it is to be inserted is: " + index);
      questionArray[index] = updatedQuestion;
      let newQuestionGroup = this.configOptions.getSupplementaryQuestionGroup();
      console.log("newQuestionGroup is:");
      console.log(newQuestionGroup);
      let renamedNewQuestionGroup = FormQuestionBase.renameNewQuestionGroup(questionArray, newQuestionGroup);
      console.log("renamedNewQuestionGroup is: ");
      console.log(renamedNewQuestionGroup);
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, renamedNewQuestionGroup, lastSiblingIndex);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      console.log("questionArrayCombiningNewAndOld is: ");
      console.log(questionArrayCombiningNewAndOld);
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questionArrayCombiningNewAndOld);
      let tmp = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      console.log("new form is: ");
      console.log(tmp);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      // console.log(this.form.getRawValue()[question.key]);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);
      // console.log(this.form.getRawValue()[question.key]);
    }

    repopulateFormWithPreviousPayload(form: FormGroup, payLoad: Object, questionArray: FormQuestionBase<string>[]){
      console.log("repopulateFormWithPreviousPayload entered");
      console.log("form is: ");
      console.log(form);
      console.log("payLoad is:");
      console.log(payLoad);
      console.log("questionArray is:");
      console.log(questionArray);
      let payLoadKeys: string[] = Object.keys(payLoad);
      console.log("payLoadKeys is:");
      console.log(payLoadKeys);
      let payLoadValues: string[] = Object.values(payLoad);
      console.log("got here 1");
      for(let i=0; i<payLoadKeys.length; i++){
        console.log("got here 2");
        if(questionArray.findIndex(q => q.key === payLoadKeys[i])>-1){
          console.log("got here 3");
          console.log("payLoadValues[i] is: " + payLoadValues[i]);
          let correspondingQuestionIndex = questionArray.findIndex(q => q.key === payLoadKeys[i]);
          console.log("correspondingQuestionIndex is: " + correspondingQuestionIndex);
          let populatedFormControl: FormControl = questionArray[correspondingQuestionIndex].required ? new FormControl(payLoadValues[i] || '', Validators.required) :
          console.log("populatedFormControl is: ");
          console.log(populatedFormControl);
          new FormControl(payLoadValues[i] || ''); //TODO what happens if I remove this?
          console.log("got here 4");
          console.log("questionArray[correspondingQuestionIndex].type is: " + questionArray[correspondingQuestionIndex].type);
          if(questionArray[correspondingQuestionIndex].type === 'dropdown'){
            console.log("type is dropdown. Setting value of form control to: " + payLoadValues[i]);
            populatedFormControl.setValue(payLoadValues[i]);
            console.log("got here 5");
          }
          console.log("got to set control");
          console.log("before set control");
          console.log(form);
          form.setControl(payLoadKeys[i], populatedFormControl);
          console.log("after");
          console.log(form);
          // console.log("populatedFormControl is: ");
          // console.log(populatedFormControl);
          this.form.setControl(payLoadKeys[i], populatedFormControl);
          console.log("form set control for index " + i + " has completed");
        }else{
          console.log("ack hit a bad else...");
        }
      }
    }
}
