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
      // console.log("got into ngOnInit for DynamicFormComponent");
      // console.log(this.configOptions);
    }

    processForm(questions: FormQuestionBase<string>[]){
      console.log("processForm called");
      console.log("questions are:");
      console.log(questions);
      // console.log(this.form.getRawValue());
      this.payLoad = JSON.stringify(this.form.getRawValue());
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questions);
      this.formProcessingService.captureFormResults(this.form.getRawValue());
      this.formProcessingService.nextButtonClicked.next(true);
    }
    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      // console.log("addAnotherQuestion called");
      // let currentQuestionKey = questionArray[index].key;
      // console.log(this.form.getRawValue()[questionArray[index].key]);
      let previousQuestionKeyLength = questionArray[index].key.length;
      let newQuestionToBeAdded: FormQuestionBase<string> = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, true, true);
      let baseKey: string = question.key.split(/\d+/)[0];
      let newIndex: number = FormQuestionBase.calculateCurrentHighestIndexWithThisBaseKey(baseKey,questionArray) + 1;
      newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingKeyOfExistingQuestion(newQuestionToBeAdded, baseKey+newIndex);
      // newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(newQuestionToBeAdded, question.isThisQuestionTheLastOfAQuestionGroup);
      //TODO change modified question's index? Change its isThisQuestionTheLastOfAQuestionGroup?
      let previousQuestionModified = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false, false);
      previousQuestionModified = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(previousQuestionModified, false);
      questionArray[index] = previousQuestionModified;
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, [newQuestionToBeAdded], index);
      // questionArray.splice(index+1, 0, newQuestionToBeAdded);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questionArrayCombiningNewAndOld);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);
    }
    addAnotherQuestionGroup(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      // console.log("addAnotherQuestionGroup called");
      // console.log(questionArray);
      // console.log("index is " + index);
      // let parentQuestionIndex = question.findParentQuestionIndex(question, questionArray, index);
      let lastSiblingIndex = question.findLastSiblingQuestionIndex(question, questionArray, index);
      // console.log("lastSiblingIndex is: " + lastSiblingIndex);
      // console.log(questionArray);
      let updatedQuestion: FormQuestionBase<string> = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(question, false);
      // console.log(updatedQuestion);
      // console.log(questionArray);
      questionArray[index] = updatedQuestion;
      // console.log(questionArray);
      let newQuestionGroup = this.configOptions.getOriginalQuestionGroup();
      // console.log(newQuestionGroup);
      let renamedNewQuestionGroup = FormQuestionBase.renameNewQuestionGroup(questionArray, newQuestionGroup);
      // console.log("got here");
      // console.log(renamedNewQuestionGroup);
      // console.log(questionArray);
      // console.log(newQuestionGroup);
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, renamedNewQuestionGroup, lastSiblingIndex);
      // console.log(questionArrayCombiningNewAndOld);
      // questionArray.splice(lastSiblingIndex+1, 0, ...renamedNewQuestionGroup); //TODO update this to insert newQuestionGroup using lastSiblingIndex
      // console.log(questionArray);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questionArrayCombiningNewAndOld);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      // console.log("form after re-making with questionArrayCombiningNewAndOld");
      // console.log(this.form);

      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);

      // updateQuestion = updatedQuestion.modifyQuestionIsThisQuestionTheLastOfAQuestionGroupStatus
      // let newQuestionGroup = questionArray.slice(parentQuestionIndex, index+1);
      // console.log("newQuestionGroup is:");
      // console.log(newQuestionGroup);
      //TODO insert the new question set into questionArray
      //TODO remove isThisQuestionTheLastOfAQuestionGroup status from previous lastQuestion and call makeNewQuestionAsTheLastOfAQuestionGroup on new question
    }

    repopulateFormWithPreviousPayload(form: FormGroup, payLoad: Object, questionArray: FormQuestionBase<string>[]){
      console.log("entered repopulateFormWithPreviousPayload")
      console.log("form");
      console.log(form);
      console.log("payLoad");
      console.log(payLoad);
      console.log("questionArray");
      console.log(questionArray);
      let payLoadKeys: string[] = Object.keys(payLoad);
      let payLoadValues: string[] = Object.values(payLoad);
      for(let i=0; i<payLoadKeys.length; i++){
        // console.log("payLoadKey is: " + payLoadKeys[i]);
        // console.log(payLoadKeys.length);
        // console.log(payLoadValues.length);
        // console.log(questionArray.length);
        // console.log("questionArray's index for corresponding payLoad item is: " + questionArray.findIndex(q => q.key === payLoadKeys[i]));
        if(questionArray.findIndex(q => q.key === payLoadKeys[i])>-1){
          let correspondingQuestionIndex = questionArray.findIndex(q => q.key === payLoadKeys[i]);
          // console.log("corresponding question is: ");
          // console.log(questionArray[correspondingQuestionIndex]);
          // console.log("payLoadKeys for same question: ");
          // console.log(payLoadKeys[i]);
          // let populatedFormControl: FormControl = questionArray[i].required ? new FormControl(payLoadKeys[i] || '', Validators.required) :
          // new FormControl(payLoadKeys[i] || '');
          // form.setControl(payLoadKeys[i], new FormControl(payLoadValues[i]|| '', Validators.required));
          let populatedFormControl: FormControl = questionArray[correspondingQuestionIndex].required ? new FormControl(payLoadValues[i] || '', Validators.required) :
          new FormControl(payLoadValues[i] || '');
          console.log(populatedFormControl);
          if(questionArray[correspondingQuestionIndex].type === 'dropdown'){
            console.log("we have a dropdown question!");
            console.log("question is:");
            console.log(questionArray[correspondingQuestionIndex]);
            console.log("value to be added is: " + payLoadValues[i]);
            populatedFormControl.setValue(payLoadValues[i]);
            console.log(populatedFormControl);
          }
          // console.log("populatedFormControl in repopulateFormWithPreviousPayload");
          // console.log(populatedFormControl);
          // form[payLoadKeys[i]] = populatedFormControl;
          form.setControl(payLoadKeys[i], populatedFormControl);
        }else{
          // console.log(payLoadKeys[i]);
          // console.log(payLoadValues[i]);
        }
      }
    }
}
