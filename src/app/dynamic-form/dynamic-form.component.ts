import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormQuestionBase } from '../formQuestionBase.model';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html'
})

export class DynamicFormQuestionComponent {
  @Input() question: FormQuestionBase<string>;
  @Input() form: FormGroup;
  get isValid() { return this.form.controls[this.question.key].valid;}
}
