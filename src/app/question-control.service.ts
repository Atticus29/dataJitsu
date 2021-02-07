import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormQuestionBase } from './formQuestionBase.model';
import { DynamicFormConfiguration } from './dynamicFormConfiguration.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionControlService {

  constructor() { }

  toFormGroup (questions: FormQuestionBase<string>[]){ //TODO maybe a toFormGroup with payLoad should be added to replace the repopulateFormWithPreviousPayload method in dynamic-form.component?
    //TODO add configurationDetails here? Eventually?
    // console.log("toFormGroup entered");
    // console.log("questions in question-control-service");
    // console.log(questions);
    if(questions){
      let group: any = {};
      questions.forEach(question =>{
        if(question.required && question.minLength){
            group[question.key] = new FormControl(question.value || '', [Validators.required, Validators.minLength(question.minLength)]);
        }
        if(!question.required && question.minLength){
            group[question.key] = new FormControl(question.value || '', Validators.minLength(question.minLength));
        }
        if(question.required && !question.minLength){
          group[question.key] = new FormControl(question.value || '', Validators.required);
        } else{
          group[question.key] = new FormControl(question.value || '');
        }
        // group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) :
        // new FormControl(question.value || '');
      });
      return new FormGroup(group);
    }
    return new FormGroup(null);
  }
}
