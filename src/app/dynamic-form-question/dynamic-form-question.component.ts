import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Observable } from 'rxjs';
import {map, startWith, takeUntil} from 'rxjs/operators';

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
  private localAutocompleteOptions: any[] = null;
  private filteredOptions: Observable<string[]>;
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
      let questionKey = this.question.key;
      if(this.checked){
        this.question.value = this.question.secondLabel;
      } else{
        this.question.value = this.question.label;
      }
      let objToEmit = {};
      objToEmit[questionKey]=this.question.value;
      this.itemFromFormQuestion.emit(objToEmit);
    }
    this.question.autocompleteOptions.pipe(takeUntil(this.ngUnsubscribe)).subscribe(autocompleteArray =>{
      console.log("autocompleteArray is: ");
      console.log(autocompleteArray);
      this.localAutocompleteOptions = autocompleteArray;
      this.filteredOptions = this.form.get(this.question.key).valueChanges.pipe(startWith(''), map(value=> this._filter(value)));
    });
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

  private _filter(value: string): string[] {
   const filterValue = value.toLowerCase();
   return this.localAutocompleteOptions.filter(option => option.toLowerCase().includes(filterValue));
 }

  changed(){
    console.log("changed called");
    //Currently only for toggle switch
    if(this.question.controlType==='toggle'){
      this.checked = !this.checked;
      if(this.checked){
        this.question.value = this.question.secondLabel;
      } else{
        this.question.value = this.question.label;
      }
      let questionKey = this.question.key;

      let objToEmit = {};
      objToEmit[questionKey]=this.question.value;
      console.log("objToEmit is: ");
      console.log(objToEmit);
      this.itemFromFormQuestion.emit(objToEmit);
    }
  }

}
