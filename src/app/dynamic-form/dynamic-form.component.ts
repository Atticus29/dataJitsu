import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormQuestionBase } from '../formQuestionBase.model';
import { QuestionControlService } from '../question-control.service';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html'
})

export class DynamicFormComponent implements OnInit{
  @Input() questions: FormQuestionBase<string>[] = [];
    form: FormGroup;
    payLoad = '';

    constructor(private qcs: QuestionControlService ) { }

    ngOnInit() {
      this.form = this.qcs.toFormGroup(this.questions);
    }

    processForm(){
      this.payLoad = JSON.stringify(this.form.getRawValue());
    }
    addAnotherQuestion(question: FormQuestionBase<string>, questionArray: FormQuestionBase<string>[], index: number){
      // this.questions.push(question); //Can I do this?
      let modifiedQuestion = question.makeNewQuestionWithGiveOptionToAnswerThisQuestionMultipleTimesAs(question, false);
      console.log(this.form);
      questionArray.splice(index, 0, modifiedQuestion);
      // console.log("changed question array. Now it is:");
      // console.log(questionArray);
      this.form = this.qcs.toFormGroup(questionArray);
      console.log(this.form);
    }
}
