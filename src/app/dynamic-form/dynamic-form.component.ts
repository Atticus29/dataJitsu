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
      this.threadNum = this.configOptions.getThreadNum();
      this.formProcessingService.questionThreadCounter.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currentQuestionThreadNum =>{
        console.log("currentQuestionThreadNum:");
        console.log(currentQuestionThreadNum);
        if(currentQuestionThreadNum >0){
          this.formProcessingService.questionThread[currentQuestionThreadNum-1].pipe(takeUntil(this.ngUnsubscribe)).subscribe(newQuestions =>{
            console.log("newQuestions in dynamic-form is:");
            console.log(newQuestions);
          });
        }
      });
      // console.log("thread count is: " + this.threadNum);
      // this.gridLengthsForButtons = this.configOptions.getGridLengthsForButtons();
      // console.log("gridLengthsForButtons are: " + this.gridLengthsForButtons);
      // this.gridLengthsForInput = this.configOptions.getGridLengthsForInput();
      // console.log("gridLengthsForInput is: " + this.gridLengthsForInput);
      // console.log("questions upon entry into ngOnInit of DynamicFormComponent are");
      // console.log(this.questions);
      // console.log(this.formProcessingService.questionThread);
      if(this.formProcessingService.questionThread.length>0){
        this.formProcessingService.questionThread[this.threadNum-1].pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionArrayOfForm =>{
          console.log("questionArrayOfForm emitted in formProcessingService. questionArrayOfForm is: ");
          console.log(questionArrayOfForm);
          if(questionArrayOfForm){
            if(questionArrayOfForm!== "Stop"){
              this.questions = questionArrayOfForm;
            }
          }
        });
      }
      // console.log("got into ngOnInit for DynamicFormComponent");
      // console.log(this.configOptions);
    }

    processForm(questions: FormQuestionBase<string>[]){
      // console.log("processForm called");
      // console.log("questions are:");
      // console.log(questions);
      // console.log(this.form.getRawValue());
      this.payLoad = JSON.stringify(this.form.getRawValue());
      // console.log("this.threadNum in dynamic-form component is: " + this.threadNum);
      this.formProcessingService.captureQuestionArrayOfCurrentFormInThread(questions, this.threadNum);
      this.formProcessingService.captureFormResultsInThread(this.form.getRawValue(), this.threadNum);
    }
    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      // console.log("addAnotherQuestion called");
      // console.log("questionArray:");
      // console.log(questionArray);
      // let currentQuestionKey = questionArray[index].key;
      // console.log(this.form.getRawValue()[questionArray[index].key]);
      // let previousQuestionKeyLength = questionArray[index].key.length;
      let newQuestionToBeAdded: FormQuestionBase<string> = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, true, true);
      let baseKey: string = question.key.split(/\d+/)[0];
      let newIndex: number = FormQuestionBase.calculateCurrentHighestIndexWithThisBaseKey(baseKey,questionArray) + 1;
      newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingKeyOfExistingQuestion(newQuestionToBeAdded, baseKey+newIndex);
      // newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(newQuestionToBeAdded, question.isThisQuestionTheLastOfAQuestionGroup);
      //TODO change modified question's index? Change its isThisQuestionTheLastOfAQuestionGroup?
      let previousQuestionModified = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false, false);
      previousQuestionModified = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(previousQuestionModified, false);
      questionArray[index] = previousQuestionModified;
      // console.log("got here 1");
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, [newQuestionToBeAdded], index);
      // console.log("got here 2");
      // console.log("questionArrayCombiningNewAndOld is:");
      // console.log(questionArrayCombiningNewAndOld);
      // questionArray.splice(index+1, 0, newQuestionToBeAdded);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      console.log("got here 2");
      this.formProcessingService.captureQuestionArrayOfCurrentFormInThread(questionArrayCombiningNewAndOld, this.threadNum);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      // console.log("form after re-making with questionArrayCombiningNewAndOld");
      // console.log(this.form);
      // console.log("objectPayLoad is:");
      // console.log(objectPayLoad);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);
    }
    addAnotherQuestionGroup(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      console.log("addAnotherQuestionGroup called");
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
      // console.log("got here 1");
      // console.log(renamedNewQuestionGroup);
      // console.log(questionArray);
      // console.log(newQuestionGroup);
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, renamedNewQuestionGroup, lastSiblingIndex);
      // console.log("got here 2");
      // console.log("questionArrayCombiningNewAndOld:")
      // console.log(questionArrayCombiningNewAndOld);
      // questionArray.splice(lastSiblingIndex+1, 0, ...renamedNewQuestionGroup); //TODO update this to insert newQuestionGroup using lastSiblingIndex
      // console.log(questionArray);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      this.formProcessingService.captureQuestionArrayOfCurrentFormInThread(questionArrayCombiningNewAndOld, this.threadNum);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      console.log("form after re-making with questionArrayCombiningNewAndOld");
      console.log(this.form);

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
      // console.log("payLoadKeys:");
      // console.log(payLoadKeys);
      let payLoadValues: string[] = Object.values(payLoad);
      // console.log("payLoadValues:");
      // console.log(payLoadValues);
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
          // console.log("required?: " + questionArray[correspondingQuestionIndex].required);
          let populatedFormControl: FormControl = questionArray[correspondingQuestionIndex].required ? new FormControl(payLoadValues[i] || '', Validators.required) :
          new FormControl(payLoadValues[i] || '');
          // console.log("populatedFormControl is: ");
          // console.log(populatedFormControl);
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
          // console.log("form before resetting controls");
          // console.log(form);
          form.setControl(payLoadKeys[i], populatedFormControl);
          console.log("form after resetting controls");
          console.log(form);
        }else{
          // console.log(payLoadKeys[i]);
          // console.log(payLoadValues[i]);
        }
      }
    }
}
