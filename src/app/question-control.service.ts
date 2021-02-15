import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { FormQuestionBase } from './formQuestionBase.model';
import { DynamicFormConfiguration } from './dynamicFormConfiguration.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionControlService {

  constructor() { }

  toFormGroup (questions: FormQuestionBase<string>[]){
    if(questions){
      let group: any = {};
      questions.forEach(question =>{
        if(question.required && question.minLength && question.isEmailAddress){
            group[question.key] = new FormControl(question.value || '', [Validators.required, Validators.minLength(question.minLength), Validators.email]); //these are broken, but covered by other logic in the codebase. See github issue #98
        }
        if(!question.required && question.minLength && question.isEmailAddress){
            group[question.key] = new FormControl(question.value || '', [Validators.minLength(question.minLength), Validators.email]); //these are broken, but covered by other logic in the codebase. See github issue #98
        }
        if(question.required && !question.minLength && question.isEmailAddress){
          group[question.key] = new FormControl(question.value || '', [Validators.required, Validators.email]); //these are broken, but covered by other logic in the codebase. See github issue #98
        }
        if(question.required && question.minLength && !question.isEmailAddress){
            group[question.key] = new FormControl(question.value || '', [Validators.required, Validators.minLength(question.minLength), Validators.email]); //these are broken, but covered by other logic in the codebase. See github issue #98
        }
        if(!question.required && question.minLength && !question.isEmailAddress){
            group[question.key] = new FormControl(question.value || '', Validators.minLength(question.minLength));
        }
        if(question.required && !question.minLength && !question.isEmailAddress){
          group[question.key] = new FormControl(question.value || '', Validators.required);
        }
         else{
          group[question.key] = new FormControl(question.value || '');
        }
        if(question.required){ // part of the fix for the above brokenness
          group[question.key] = new FormControl(question.value || '', Validators.required);
        }
      });
      return new FormGroup(group);
    }
    return new FormGroup(null);
  }
}
