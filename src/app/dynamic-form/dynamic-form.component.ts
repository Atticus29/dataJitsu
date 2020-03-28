import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormQuestionBase } from '../formQuestionBase.model';
import { QuestionControlService } from '../question-control.service';
import { Collection } from '../collection.model';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit{
  @Input() questions: FormQuestionBase<string>[] = [];
    form: FormGroup;
    payLoad: string = '';

    constructor(private qcs: QuestionControlService ) { }

    ngOnInit() {
      this.form = this.qcs.toFormGroup(this.questions);
    }

    processForm(){
      console.log(this.form.getRawValue());
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let newCollection = Collection.fromJson(this.form.getRawValue());

    }
    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      // console.log("index entering addAnotherQuestion is: " + index);
      // console.log("question in question is");
      // console.log(question.key);
      // this.questions.push(question); //Can I do this?
      // console.log("new index is " + newIndex);
      let previousQuestionKeyLength = questionArray[index].key.length;
      // console.log("previousQuestionKeyLength is " + previousQuestionKeyLength);
      // let tmpSplitArray = questionArray[index].key.split(/\D/);
      // console.log("tmpSplitArray is: ");
      // console.log(tmpSplitArray);
      // let lastNum = questionArray[index].key.split(/\D/)[previousQuestionKeyLength-1];
      // console.log("lastNum is " + lastNum);
      let modifiedQuestion = question.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, true, index);
      let previousQuestionReplacement = question.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false, questionArray[index].key.split(/\D/)[previousQuestionKeyLength-1]);
      questionArray[index] = previousQuestionReplacement;
      // console.log(this.form);
      // console.log("questionArray before splice:");
      // console.log(questionArray[index]);
      questionArray.splice(index+1, 0, modifiedQuestion);
      // console.log("changed question array. Now it is:");
      // console.log(questionArray);
      this.payLoad = JSON.stringify(this.form.getRawValue());
      let objectPayLoad = this.form.getRawValue();
      // console.log("Payload before resetting: ");
      // console.log(this.payLoad);
      this.form = this.qcs.toFormGroup(questionArray);
      this.repopulateFormWithPreviousPayload(this.form, objectPayLoad, questionArray);
      // console.log(this.form);
    }

    repopulateFormWithPreviousPayload(form: FormGroup, payLoad: Object, questionArray: FormQuestionBase<string>[]){
      // console.log("payLoad upon entry into repopulateFormWithPreviousPayload");
      // console.log(payLoad);
      let payLoadKeys: string[] = Object.keys(payLoad);
      let payLoadValues: string[] = Object.values(payLoad);
      // console.log(payLoadKeys);
      // console.log(payLoadValues);
      for(let i=0; i<payLoadKeys.length; i++){
        // console.log(questionArray[i]);
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

    // keyPress(event: any){
    //   console.log("entered keyPress");
    //   console.log(event);
    //   return !(window.event && window.event.keyCode == 13);
    // }
}
