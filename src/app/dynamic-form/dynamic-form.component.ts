import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { QuestionControlService } from '../question-control.service';
import { DynamicFormConfiguration } from '../dynamicFormConfiguration.model';
import { DatabaseService } from '../database.service';
import { FormProcessingService } from '../form-processing.service';
import { FormQuestionBase } from '../formQuestionBase.model';
import { Collection } from '../collection.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit{
  @Input() questions: FormQuestionBase<string>[] = [];
  @Input() configOptions: DynamicFormConfiguration = null;
    form: FormGroup;
    payLoad: string = '';

    constructor(private qcs: QuestionControlService, private formProcessingService: FormProcessingService) { }

    ngOnInit() {
      this.form = this.qcs.toFormGroup(this.questions, this.configOptions);
    }

    processForm(){
      // console.log(this.form.getRawValue());
      this.payLoad = JSON.stringify(this.form.getRawValue());
      this.formProcessingService.captureFormResults(this.form.getRawValue());
    }
    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      let previousQuestionKeyLength = questionArray[index].key.length;
      let modifiedQuestion = question.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, true, index);
      let previousQuestionReplacement = question.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false, questionArray[index].key.split(/\D/)[previousQuestionKeyLength-1]);
      questionArray[index] = previousQuestionReplacement;
      questionArray.splice(index+1, 0, modifiedQuestion);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      this.form = this.qcs.toFormGroup(questionArray, new DynamicFormConfiguration(false,false));
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArray);
    }
    addAnotherQuestionGroup(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      console.log("addAnotherQuestionGroup called");
      let parentQuestion = question.findParentQuestion(question, questionArray, index);
      //TODO make a new question set spanning questions from parentQuestion all the way until current index question, inclusive
      //TODO insert the new question set into questionArray
      //TODO remove isThisQuestionTheLastOfAQuestionGroup status from previous lastQuestion and call makeNewQuestionAsTheLastOfAQuestionGroup on new question
      console.log("parent question is: ");
      console.log(parentQuestion);
    }

    repopulateFormWithPreviousPayload(form: FormGroup, payLoad: Object, questionArray: FormQuestionBase<string>[]){
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
