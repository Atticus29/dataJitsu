import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Output() itemFromFormQuestion = new EventEmitter<any>();
  private localDatePickerPrompt: string;
  private checked: boolean = true;
  get isValid() {
    let returnVal = null;
    if(this.form){
      if(this.question){
        if(this.question.key){
          if(this.form.controls[this.question.key]){
            // console.log("got here in dynamic-form-question component");
            // console.log("this.form.controls[this.question.key] is:");
            // console.log(this.form.controls[this.question.key]);
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
    if(this.question.controlType==='toggle'){
      console.log("we have a toggle question");
      console.log("this.checked is: " + this.checked);
      let questionKey = this.question.key;
      if(this.checked){
        this.question.value = this.question.secondLabel;
      } else{
        this.question.value = this.question.label;
      }
      let objToEmit = {};
      objToEmit[questionKey]=this.question.value;
      console.log("objToEmit is: ");
      console.log(objToEmit);
      this.itemFromFormQuestion.emit(objToEmit);
    }
    this.localDatePickerPrompt = this.constants.datePickerPrompt;
    let self = this;
    this.formProcessingService.actualForm.pipe(takeUntil(this.ngUnsubscribe)).subscribe(formResults=>{
      // console.log("formResults in dynamic-form-question.component are:");
      // console.log(formResults);
      if(formResults){
        self.formProcessingService.nextButtonClicked.pipe(takeUntil(self.ngUnsubscribe)).subscribe(nextButtonClick =>{
          if(nextButtonClick){
            // console.log("nextButtonClick is: " + nextButtonClick + " in dynamic-form-question component");
            this.form = formResults;
            // console.log("this.form is:");
            // console.log(this.form);
          }
        });
      }
    });
  }

  changed(){
    //Currently only for toggle switch
    if(this.question.controlType==='toggle'){
      // console.log("toggle button change clicked");
      this.checked = !this.checked;
      // console.log("this.checked is: " + this.checked);
      if(this.checked){
        this.question.value = this.question.secondLabel;
      } else{
        this.question.value = this.question.label;
      }
      // console.log("value is: " + this.question.value);
      // this.checked = !this.checked;
      let questionKey = this.question.key;

      // this.form.patchValue({questionKey: this.question.value});
      console.log("got here 1");
      let objToEmit = {};
      objToEmit[questionKey]=this.question.value;
      console.log("objToEmit is: ");
      console.log(objToEmit);
      this.itemFromFormQuestion.emit(objToEmit);
    }
  }

}
