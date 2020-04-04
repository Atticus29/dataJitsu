import { Component, Input, OnInit } from '@angular/core';
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

export class DynamicFormComponent extends BaseComponent implements OnInit{
  @Input() questions: FormQuestionBase<string>[] = [];
  @Input() configOptions: DynamicFormConfiguration;
    form: FormGroup;
    payLoad: string = '';

    constructor(private qcs: QuestionControlService, private formProcessingService: FormProcessingService) {
      super();
    }

    ngOnInit() {
      this.form = this.qcs.toFormGroup(this.questions);
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
      // console.log("processForm called");
      // console.log(this.form.getRawValue());
      this.payLoad = JSON.stringify(this.form.getRawValue());
      this.formProcessingService.captureFormResults(this.form.getRawValue());
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questions); //TODO decide if needed/necessary
    }
    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      // console.log("addAnotherQuestion called")
      let previousQuestionKeyLength = questionArray[index].key.length;
      let newQuestionToBeAdded: FormQuestionBase<string> = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, true);
      let baseKey: string = question.key.split(/\d+/)[0];
      let newIndex: number = FormQuestionBase.calculateCurrentHighestIndexWithThisBaseKey(baseKey,questionArray) + 1;
      newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingKeyOfExistingQuestion(newQuestionToBeAdded, baseKey+newIndex);
      // newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(newQuestionToBeAdded, question.isThisQuestionTheLastOfAQuestionGroup);
      //TODO change modified question's index? Change its isThisQuestionTheLastOfAQuestionGroup?
      let previousQuestionModified = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false);
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
      let updatedQuestion: FormQuestionBase<string> = FormQuestionBase.createNewQuestionModifyingIsThisQuestionTheLastOfAQuestionGroupStatusOfExistingQuestion(question, false, index);
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
      // console.log("entered repopulateFormWithPreviousPayload")
      // console.log("form");
      // console.log(form);
      // console.log("payLoad");
      // console.log(payLoad);
      // console.log("questionArray");
      // console.log(questionArray);
      let payLoadKeys: string[] = Object.keys(payLoad);
      let payLoadValues: string[] = Object.values(payLoad);
      for(let i=0; i<payLoadKeys.length; i++){
        if(questionArray[i]){
          let populatedFormControl: FormControl = questionArray[i].required ? new FormControl(payLoadKeys[i] || '', Validators.required) :
          new FormControl(payLoadKeys[i] || '');
          form.setControl(payLoadKeys[i], new FormControl(payLoadValues[i]|| '', Validators.required));
        }else{
          // console.log(payLoadKeys[i]);
          // console.log(payLoadValues[i]);
        }
      }
    }
}
