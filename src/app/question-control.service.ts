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
    let group: any = {};
    questions.forEach(question =>{
      group[question.key] = question.required ? new FormControl(question.value || '', Validators.required) :
      new FormControl(question.value || '');
    });
    return new FormGroup(group);
  }
}
