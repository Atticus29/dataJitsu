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
  @Input() isFormOwner: boolean;
  @Input() configOptions: DynamicFormConfiguration;
    form: FormGroup;
    payLoad = '';
    private localButtonDisplayName: String;
    checked = false;
    private nonRequiredIsInvalid = true;
    private totalNumberOfQuestions = 0;
    private uniqueQuestionKeys: string[] = [];
    private confirmMatchesOtherQuestionVal = true;
    // gridLengthsForButtons: number = null;
    // gridLengthsForInput: number = null;

    constructor(private qcs: QuestionControlService, private formProcessingService: FormProcessingService) {
      super();
    }

    ngOnInit() {
      const self = this;
      if (this.questions) {
        this.form = this.qcs.toFormGroup(this.questions);
        // console.log('deleteMe got here b0 and this.form is: ');
        // console.log(this.form);
        if (this.questions.length > -1) {
          // console.log('deleteMe got here b0.5');
          const requireds = this.questions.map(question => question.required).reduce((a, b) => Number(a) + Number(b), 0);
          // console.log('deleteMe got here b0.75 and requireds are: ');
          // console.log(requireds);
          this.totalNumberOfQuestions = requireds;
        }
        this.formProcessingService.actualForm.next(this.form);
        this.localButtonDisplayName = this.configOptions.getSubmitButtonDisplay();
        // console.log('deleteMe got here b0.8 localButtonDisplayName is: ' + this.localButtonDisplayName);
      }
      // this.gridLengthsForButtons = this.configOptions.getGridLengthsForButtons();
      // this.gridLengthsForInput = this.configOptions.getGridLengthsForInput();
      this.formProcessingService.questionArrayOfForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(questionArrayOfForm => {
        // console.log('deleteMe got here b1');
        if (!this.form) {
          // console.log('deleteMe got here b2');
          // console.log('getting new questionArray and no form currently exists');
          // console.log(questionArrayOfForm);
          // this.form = this.qcs.toFormGroup(this.questions);
          this.form = this.qcs.toFormGroup(questionArrayOfForm);
          this.formProcessingService.actualForm.next(this.form);
          this.repopulateFormWithPreviousPayload(this.form, {}, this.questions);
          // TODO button should be emitted as well
          self.formProcessingService.buttonDisplayName.pipe(takeUntil(self.ngUnsubscribe)).subscribe(buttonDisplayName => {
            self.localButtonDisplayName = buttonDisplayName;
          });
        }
        if (questionArrayOfForm) {
          // console.log('deleteMe got here b3');
          self.formProcessingService.buttonDisplayName.pipe(takeUntil(self.ngUnsubscribe)).subscribe(buttonDisplayName =>{
            // console.log('getting new questionArray and form currently exists and button display name is: ' + buttonDisplayName);
            // console.log(questionArrayOfForm);
            if (questionArrayOfForm[0] !== 'Stop' && buttonDisplayName !== 'Next') {
              this.questions = questionArrayOfForm;
              // console.log("this.questions is: ");
              // console.log(this.questions);
              // TODO if I add this in, the owned questions work, but the collection creation stepper 1 does not
              this.form = this.qcs.toFormGroup(this.questions);
              // console.log('deleteMe got here b4 this.form is: ');
              // console.log(this.form);
              // this.formProcessingService.actualForm.next(this.form);
              // this.repopulateFormWithPreviousPayload(this.form, {}, this.questions);
            } else {
              if (questionArrayOfForm[0] !== 'Stop') {
                // console.log('deleteMe got here b5');
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
      // console.log("this.payLoad in processForm or dynamic-form-component is:");
      // console.log(this.payLoad);
      // console.log("this.form.getRawValue() in the same call 1 is:");
      // console.log(this.form.getRawValue());
      this.formProcessingService.captureFormResults(this.form.getRawValue());
      // console.log("this.form.getRawValue() in the same call 2 is:");
      // console.log(this.form.getRawValue());
      // console.log("got here 2");
      // console.log("questions about to be captured are");
      // console.log(questions);
      this.formProcessingService.captureQuestionArrayOfCurrentForm(questions);
      // console.log("this.form.getRawValue() in the same call 3 is:");
      // console.log(this.form.getRawValue());
      this.formProcessingService.formSubmitted.next(true);

      //NOTE THAT IT IS WHATEVER IS MONITORING THE FORM PROCESSING SERVICE'S JOB TO RUN restartFormAndQuestions AFTER IT'S DONE WITH WHAT IT'S DONE WITH. THIS DOESN'T HAPPEN AUTOMATICALLY HERE FOR GOOD REASON
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
      console.log("repopulateFormWithPreviousPayload entered");
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

    processItemFromQuestion(itemFromFormQuestion: any){
      this.form.patchValue(itemFromFormQuestion);
      this.formProcessingService.captureFormResults(this.form);
    }

    proccessIsFormQuestionValid(isValidFormEmittedData: any){
      if(this.questions){
        let questionKeys = this.questions.map(currentQuestion => currentQuestion.key);
        let focalQuestionIndex = questionKeys.indexOf(isValidFormEmittedData.questionKey);

        // check confirm question
        let focalQuestion = this.questions[focalQuestionIndex];
        if(focalQuestion.keyOfOtherQuestionWhereMatchIsDesired){
          let focalQuestionVal = this.form.controls[isValidFormEmittedData.questionKey].value;
          let referencedQuestion = this.form.controls[focalQuestion.keyOfOtherQuestionWhereMatchIsDesired];
          let referencedQuestionVal = referencedQuestion.value;
          if(focalQuestionVal===referencedQuestionVal){
            this.confirmMatchesOtherQuestionVal = true;
          } else{
            this.confirmMatchesOtherQuestionVal = false;
          }
        }

        let isRequired = this.questions[focalQuestionIndex].required? this.questions[focalQuestionIndex].required: false;
        if(this.questions && isRequired && !this.uniqueQuestionKeys.includes(isValidFormEmittedData.questionKey) && isValidFormEmittedData.isValid){
          this.uniqueQuestionKeys.push(isValidFormEmittedData.questionKey);
        }
        if(this.uniqueQuestionKeys.length == this.totalNumberOfQuestions){
          this.nonRequiredIsInvalid = false; //everything valid
        }
        if(this.questions && isRequired && (!isValidFormEmittedData.isValid)){ //not valid
          let uniqueQuestionKeysIndex = this.uniqueQuestionKeys.indexOf(isValidFormEmittedData.questionKey);
          if(uniqueQuestionKeysIndex >-1){ //removing a question from the validated list
            this.uniqueQuestionKeys.splice(uniqueQuestionKeysIndex,1);
          }
          this.nonRequiredIsInvalid = true;
        }
      }
    }
}
