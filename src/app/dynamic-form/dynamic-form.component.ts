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

    onSubmit(){
      this.payLoad = JSON.stringify(this.form.getRawValue());
    }
}
