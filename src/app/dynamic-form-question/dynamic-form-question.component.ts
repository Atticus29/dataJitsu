import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { FormQuestionBase } from '../formQuestionBase.model';
import { FormProcessingService } from '../form-processing.service';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent extends BaseComponent implements OnInit {
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

  constructor(private formProcessingService: FormProcessingService) {
    super();
  }

  ngOnInit() {
    let self = this;
    this.formProcessingService.actualForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formResults=>{
      // console.log("formResults in dynamic-form-question.component are:");
      // console.log(formResults);
      if(formResults){
        self.formProcessingService.nextButtonClicked.pipe(takeUntil(self.ngUnsubscribe)).subscribe(nextButtonClick =>{
          if(nextButtonClick){
            console.log("nextButtonClick is: " + nextButtonClick + " in dynamic-form-question component");
            this.form = formResults;
          }
        });
      }
    });
  }

}
