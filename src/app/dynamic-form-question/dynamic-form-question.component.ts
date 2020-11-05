import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormQuestionBase } from '../formQuestionBase.model';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent implements OnInit {
  @Input() question: FormQuestionBase<string>;
  @Input() form: FormGroup;
  get isValid() {
    let returnVal = null;
    if(this.form){
      if(this.question){
        if(this.question.key){
          if(this.form.controls[this.question.key]){
              returnVal = this.form.controls[this.question.key].valid? this.form.controls[this.question.key].valid: null;
              return returnVal;
          } else{
            return returnVal;
          }
        }else{
          return returnVal;
        }
      }else{
        return returnVal;
      }
    } else{
      return returnVal;
    }

  }

  constructor() { }

  ngOnInit() {
  }

}
