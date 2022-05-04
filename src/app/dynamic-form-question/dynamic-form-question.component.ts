import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";

import { Observable, of } from "rxjs";
import { map, startWith, takeUntil, first } from "rxjs/operators";

import { BaseComponent } from "../base/base.component";
import { FormQuestionBase } from "../formQuestionBase.model";
import { FormProcessingService } from "../form-processing.service";
import { TextTransformationService } from "../text-transformation.service";
import { DatabaseService } from "../database.service";
import { QuestionControlService } from "../question-control.service";
import { ValidationService } from "../validation.service";
import { NewItemNameDialogComponent } from "../new-item-name-dialog/new-item-name-dialog.component";
import { constants } from "../constants";

@Component({
  selector: "app-question",
  templateUrl: "./dynamic-form-question.component.html",
  styleUrls: ["./dynamic-form-question.component.scss"],
})
export class DynamicFormQuestionComponent
  extends BaseComponent
  implements OnInit
{
  @Input() question: FormQuestionBase<string>;
  @Input() form: FormGroup;
  @Input() isFormOwner: boolean;
  @Output() itemFromFormQuestion = new EventEmitter<any>();
  @Output() isValidFormQuestion = new EventEmitter<any>();
  public localDatePickerPrompt: string;
  public checked: boolean = true;
  public localAutocompleteOptions: any[] = null;
  public filteredOptions: Observable<string[]>;
  public localItemName: string = null;
  public hide: boolean = true;
  public isValidText: boolean = false;
  public isEmailValid: boolean = false;
  public isPasswordValidText: boolean = false;
  public isLongEnough: boolean = false;
  public isValidEmailText: boolean = false;
  public isValidDropdown: boolean = false;

  constructor(
    public databaseService: DatabaseService,
    public formProcessingService: FormProcessingService,
    public dialog: MatDialog,
    public textTransformationService: TextTransformationService,
    public _snackBar: MatSnackBar,
    public qcs: QuestionControlService,
    public validationService: ValidationService
  ) {
    super();
  }

  ngOnInit() {
    this.handleFormValidation(null);
    this.form.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((formResults) => {
        // console.log('deleteMe got here d1 and formResults have changed to: ');
        // console.log(formResults);
        this.handleFormValidation(formResults);
      });
    if (this.question.controlType === "toggle") {
      const questionKey = this.question.key;
      if (this.checked) {
        this.question.value = this.question.secondLabel;
      } else {
        this.question.value = this.question.label;
      }
      const objToEmit = {};
      objToEmit[questionKey] = this.question.value;
      this.itemFromFormQuestion.emit(objToEmit);
    }
    this.question.autocompleteOptions
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((autocompleteArray) => {
        this.localAutocompleteOptions = autocompleteArray;
        if (this.form) {
          this.filteredOptions = this.form
            .get(this.question.key)
            .valueChanges.pipe(
              startWith(""),
              map((value) => this._filter(value))
            );
        } else {
          this.form = this.qcs.toFormGroup([this.question]);
          this.filteredOptions = this.form
            .get(this.question.key)
            .valueChanges.pipe(
              startWith(""),
              map((value) => this._filter(value))
            );
        }
      });
    this.localDatePickerPrompt = this.constants.datePickerPrompt;
    const self = this;
    this.formProcessingService.actualForm
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((formResults) => {
        if (formResults) {
          self.formProcessingService.nextButtonClicked
            .pipe(takeUntil(self.ngUnsubscribe))
            .subscribe((nextButtonClick) => {
              if (nextButtonClick) {
                this.form = formResults;
              }
            });
        }
      });
  }

  public _filter(value: string): string[] {
    // console.log('deleteMe _filter is: ');
    // console.log(value);
    const filterValue = value.toLowerCase();
    // console.log('deleteMe filterValue is: ');
    // console.log(filterValue);
    // console.log('deleteMe this.localAutocompleteOptions are: ');
    // console.log(this.localAutocompleteOptions);
    if (filterValue) {
      return this.localAutocompleteOptions.filter((option) =>
        option.toLowerCase().includes(filterValue)
      );
    } else {
      return null;
    }
  }

  changed() {
    //Currently only for toggle switch
    if (this.question.controlType === "toggle") {
      this.checked = !this.checked;
      if (this.checked) {
        this.question.value = this.question.secondLabel;
      } else {
        this.question.value = this.question.label;
      }
      let questionKey = this.question.key;
      let objToEmit = {};
      objToEmit[questionKey] = this.question.value;
      this.itemFromFormQuestion.emit(objToEmit);
    }
  }

  handleFormValidation(formResults: any) {
    let returnVal = false;
    if (this.form) {
      if (this.question) {
        if (this.question.key) {
          if (this.form.controls[this.question.key] && formResults) {
            // console.log('quest is: ');
            // console.log(this.question);
            // textbox
            if (
              (this.question.controlType === "textbox" ||
                this.question.controlType === "autocomplete") &&
              this.question.required
            ) {
              if (!this.question.isEmailAddress) {
                if (!formResults[this.question.key]) {
                  this.isValidText = false;
                  returnVal = false; // for isValidFormQuestion emission at the end
                } else {
                  this.isValidText = true;
                  returnVal = true; // for isValidFormQuestion emission at the end
                }
              } else {
                this.isValidText = false; // because isValidEmail text or password text will supercede
                returnVal = false; // for isValidFormQuestion emission at the end
              }
              // special case where textbox is an email address
              if (this.question.isEmailAddress) {
                if (!formResults[this.question.key]) {
                  this.isValidEmailText = false;
                  returnVal = false; // for isValidFormQuestion emission at the end
                } else {
                  this.isValidEmailText = true;
                  returnVal = true; // for isValidFormQuestion emission at the end
                }
                if (
                  !this.validationService.validateEmail(
                    formResults[this.question.key]
                  )
                ) {
                  this.isEmailValid = false;
                  returnVal = false; // for isValidFormQuestion emission at the end
                } else {
                  this.isEmailValid = true;
                  returnVal = true; // for isValidFormQuestion emission at the end
                }
              }
            }

            // password text
            if (
              this.question.controlType === "passwordtext" &&
              this.question.required
            ) {
              if (!formResults[this.question.key]) {
                this.isPasswordValidText = false;
                returnVal = false; // for isValidFormQuestion emission at the end
              } else {
                this.isPasswordValidText = true;
                returnVal = true; // for isValidFormQuestion emission at the end
              }
              // console.log("passwordtext");
              if (
                formResults[this.question.key].length < this.question.minLength
              ) {
                this.isLongEnough = false;
                returnVal = false; // for isValidFormQuestion emission at the end
              }
              if (
                formResults[this.question.key].length >= this.question.minLength
              ) {
                this.isLongEnough = true;
                returnVal = true; // for isValidFormQuestion emission at the end
              }
            }

            // dropdown
            if (
              this.question.controlType === "dropdown" &&
              this.question.required
            ) {
              if (!formResults[this.question.key]) {
                this.isValidDropdown = false;
                returnVal = false; // for isValidFormQuestion emission at the end
              } else {
                this.isValidDropdown = true;
                returnVal = true; // for isValidFormQuestion emission at the end
              }
            }
          }
        }
      }
      this.isValidFormQuestion.emit({
        questionKey: this.question.key,
        isValid: returnVal,
      });
    } else {
      this.isValidFormQuestion.emit({
        questionKey: this.question.key,
        isValid: false,
      });
    }
  }

  // async openItemNameDialog(){ //Deprecated
  //   let dialogConfig = this.getGenericDialogConfig();
  //   const dialogRef = this.dialog.open(NewItemNameDialogComponent, dialogConfig);
  //   this.localItemName = await this.processGenericDialog(dialogRef, 'items', 'itemName');
  // }
  //
  // getGenericDialogConfig(){ //Deprecated
  //   const dialogConfig = new MatDialogConfig();
  //   dialogConfig.disableClose = true;
  //   dialogConfig.autoFocus = true;
  //   dialogConfig.data = {};
  //   return dialogConfig;
  // }
  //
  // async processGenericDialog(dialogRef: any, path: string, parameterFromForm: string) : Promise<any>{ //TODO Promise<any> //Deprecated
  //   console.log("entered processGenericDialog")
  //   console.log("parameterFromForm is: ");
  //   console.log(parameterFromForm);
  //   let [val, genericStringNames] = await Promise.all([dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).toPromise(), this.databaseService.getGenericStringNames(path).pipe(first()).toPromise()]);
  //     if(val){
  //       console.log("val[parameterFromForm]");
  //       console.log(val[parameterFromForm]);
  //       let candidateNameCapitalized = this.textTransformationService.capitalizeFirstLetter(val[parameterFromForm]);
  //       console.log("candidateNameCapitalized is " + candidateNameCapitalized);
  //       if(genericStringNames.includes(candidateNameCapitalized)){
  //         // debugger;
  //         this.openSnackBar(constants.alreadyExistsNotification, null);
  //         return null;
  //       }else{
  //         console.log("got here");
  //         this.question.value = candidateNameCapitalized;
  //         return candidateNameCapitalized;
  //       }
  //     }else{
  //       return null;
  //     }
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
