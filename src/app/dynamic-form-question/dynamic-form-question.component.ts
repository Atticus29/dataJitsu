import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {MatSnackBar} from '@angular/material/snack-bar';

import { Observable } from 'rxjs';
import {map, startWith, takeUntil, first} from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { FormQuestionBase } from '../formQuestionBase.model';
import { FormProcessingService } from '../form-processing.service';
import { TextTransformationService } from '../text-transformation.service';
import { DatabaseService } from '../database.service';
import { QuestionControlService } from '../question-control.service';
import { NewItemNameDialogComponent } from '../new-item-name-dialog/new-item-name-dialog.component';
import { constants } from '../constants';

@Component({
  selector: 'app-question',
  templateUrl: './dynamic-form-question.component.html',
  styleUrls: ['./dynamic-form-question.component.scss']
})
export class DynamicFormQuestionComponent extends BaseComponent implements OnInit {
  @Input() question: FormQuestionBase<string>;
  @Input() form: FormGroup;
  @Input() isFormOwner: boolean;
  @Output() itemFromFormQuestion = new EventEmitter<any>();
  private localDatePickerPrompt: string;
  private checked: boolean = true;
  private localAutocompleteOptions: any[] = null;
  private filteredOptions: Observable<string[]>;
  private localItemName: string = null;
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

  constructor(private databaseService: DatabaseService, private formProcessingService: FormProcessingService, public dialog: MatDialog, private textTransformationService: TextTransformationService, private _snackBar: MatSnackBar, private qcs: QuestionControlService) {
    super();
  }

  ngOnInit() {
    console.log("this.question in dynamic-form-question is: ");
    console.log(this.question);
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
      // console.log("autocompleteArray is: ");
      // console.log(autocompleteArray);
      this.localAutocompleteOptions = autocompleteArray;
      if(this.form){
        this.filteredOptions = this.form.get(this.question.key).valueChanges.pipe(startWith(''), map(value=> this._filter(value)));
      }else{
        this.form = this.qcs.toFormGroup([this.question]);
        this.filteredOptions = this.form.get(this.question.key).valueChanges.pipe(startWith(''), map(value=> this._filter(value)));
      }
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

  async openItemNameDialog(){
    let dialogConfig = this.getGenericDialogConfig();
    const dialogRef = this.dialog.open(NewItemNameDialogComponent, dialogConfig);
    this.localItemName = await this.processGenericDialog(dialogRef, 'items', 'itemName');
  }

  getGenericDialogConfig(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    return dialogConfig;
  }

  async processGenericDialog(dialogRef: any, path: string, parameterFromForm: string) : Promise<any>{ //TODO Promise<any>
    console.log("entered processGenericDialog")
    console.log("parameterFromForm is: ");
    console.log(parameterFromForm);
    let [val, genericStringNames] = await Promise.all([dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).toPromise(), this.databaseService.getGenericStringNames(path).pipe(first()).toPromise()]);
      if(val){
        console.log("val[parameterFromForm]");
        console.log(val[parameterFromForm]);
        let candidateNameCapitalized = this.textTransformationService.capitalizeFirstLetter(val[parameterFromForm]);
        console.log("candidateNameCapitalized is " + candidateNameCapitalized);
        if(genericStringNames.includes(candidateNameCapitalized)){
          // debugger;
          this.openSnackBar(constants.alreadyExistsNotification, null);
          return null;
        }else{
          console.log("got here");
          this.question.value = candidateNameCapitalized;
          return candidateNameCapitalized;
        }
      }else{
        return null;
      }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
