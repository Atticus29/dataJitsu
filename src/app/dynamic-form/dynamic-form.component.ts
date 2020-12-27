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
      let self = this;
      this.form = this.qcs.toFormGroup(this.questions);
      if(this.questions){
        this.formProcessingService.actualForm.next(this.form);
        this.localButtonDisplayName = this.configOptions.getSubmitButtonDisplay();
      }
      // this.gridLengthsForButtons = this.configOptions.getGridLengthsForButtons();
      // this.gridLengthsForInput = this.configOptions.getGridLengthsForInput();
      this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionArrayOfForm =>{
        if(!this.form){
          this.form = this.qcs.toFormGroup(this.questions);
          this.formProcessingService.actualForm.next(this.form);
          this.repopulateFormWithPreviousPayload(this.form, {}, this.questions);
          //TODO button should be emitted as well
          self.formProcessingService.buttonDisplayName.pipe(takeUntil(self.ngUnsubscribe)).subscribe(buttonDisplayName =>{
            self.localButtonDisplayName = buttonDisplayName;
          });
        }
        if(questionArrayOfForm){
          self.formProcessingService.buttonDisplayName.pipe(takeUntil(self.ngUnsubscribe)).subscribe(buttonDisplayName =>{
            if(questionArrayOfForm[0]!== "Stop" && buttonDisplayName !== "Next"){
              this.questions = questionArrayOfForm;
              // console.log("this.questions is: ");
              // console.log(this.questions);
              this.form = this.qcs.toFormGroup(this.questions); //TODO if I add this in, the owned questions work, but the collection creation stepper 1 does not
              // this.formProcessingService.actualForm.next(this.form);
              // this.repopulateFormWithPreviousPayload(this.form, {}, this.questions);
            } else{
              if(questionArrayOfForm[0]!== "Stop"){
                this.questions = questionArrayOfForm;
                // console.log("this.questions is: ");
                // console.log(this.questions);
              }
            }
          });
        }
      });
    }

    processForm(questions: FormQuestionBase<string>[]){
      this.payLoad = JSON.stringify(this.form.getRawValue());
      console.log("this.payLoad in processForm or dynamic-form-component is:");
      console.log(this.payLoad);
      console.log("this.form.getRawValue() in the same call 1 is:");
      console.log(this.form.getRawValue());
      this.formProcessingService.captureFormResults(this.form.getRawValue());
      console.log("this.form.getRawValue() in the same call 2 is:");
      console.log(this.form.getRawValue());
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questions);
      console.log("this.form.getRawValue() in the same call 3 is:");
      console.log(this.form.getRawValue());
      this.formProcessingService.formSubmitted.next(true);
    }

    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number, submitAfterThisQuestion: boolean){
      let newQuestionToBeAdded: FormQuestionBase<string> = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, true, true, submitAfterThisQuestion); //TODO last argument true??
      let baseKey: string = question.key.split(/\d+/)[0];
      let newIndex: number = FormQuestionBase.calculateCurrentHighestIndexWithThisBaseKey(baseKey,questionArray) + 1;
      newQuestionToBeAdded = FormQuestionBase.createNewQuestionModifyingKeyOfExistingQuestion(newQuestionToBeAdded, baseKey+newIndex);
      let previousQuestionModified = FormQuestionBase.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false, false, false);
      previousQuestionModified = FormQuestionBase.createNewQuestionByModifyingExistingQuestion(previousQuestionModified, false, false);
      questionArray[index] = previousQuestionModified;
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, [newQuestionToBeAdded], index);
      let objectPayLoad = this.form.getRawValue();
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questionArrayCombiningNewAndOld);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      this.formProcessingService.actualForm.next(this.form);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);
    }
    addAnotherQuestionGroup(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      let lastSiblingIndex = question.findLastSiblingQuestionIndex(question, questionArray, index);
      let updatedQuestion: FormQuestionBase<string> = FormQuestionBase.createNewQuestionByModifyingExistingQuestion(question, false, false);
      questionArray[index] = updatedQuestion;
      let newQuestionGroup = this.configOptions.getSupplementaryQuestionGroup();
      let renamedNewQuestionGroup = FormQuestionBase.renameNewQuestionGroup(questionArray, newQuestionGroup);
      let questionArrayCombiningNewAndOld = FormQuestionBase.spliceWithoutManipulatingOriginal(questionArray, renamedNewQuestionGroup, lastSiblingIndex);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questionArrayCombiningNewAndOld);
      let tmp = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      this.form = this.qcs.toFormGroup(questionArrayCombiningNewAndOld);
      this.formProcessingService.actualForm.next(this.form);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArrayCombiningNewAndOld);
    }

    repopulateFormWithPreviousPayload(form: FormGroup, payLoad: Object, questionArray: FormQuestionBase<string>[]){
      let payLoadKeys: string[] = Object.keys(payLoad);
      let payLoadValues: string[] = Object.values(payLoad);
      for(let i=0; i<payLoadKeys.length; i++){
        if(questionArray.findIndex(q => q.key === payLoadKeys[i])>-1){
          let correspondingQuestionIndex = questionArray.findIndex(q => q.key === payLoadKeys[i]);
          let populatedFormControl: any = questionArray[correspondingQuestionIndex]&&questionArray[correspondingQuestionIndex].required ? new FormControl(payLoadValues[i] || '', Validators.required) : new FormControl(payLoadValues[i] || '');
          if(questionArray[correspondingQuestionIndex].type === 'dropdown'){
            populatedFormControl.setValue(payLoadValues[i]);
          }
          form.setControl(payLoadKeys[i], populatedFormControl);
          this.form.setControl(payLoadKeys[i], populatedFormControl);
        }else{
          console.log("ack hit a bad else...");
        }
      }
    }
}
