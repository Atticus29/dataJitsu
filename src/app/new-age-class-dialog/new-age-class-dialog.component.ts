import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import { takeUntil } from 'rxjs/operators';

import { ValidationService } from '../validation.service';
import { BaseComponent } from '../base/base.component';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TextTransformationService } from '../text-transformation.service';

import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

@Component({
  selector: 'app-new-age-class-dialog',
  templateUrl: './new-age-class-dialog.component.html',
  styleUrls: ['./new-age-class-dialog.component.scss']
})
export class NewAgeClassDialogComponent extends BaseDialogComponent implements OnInit {
  form: FormGroup;
  private ageClassNameFc: FormControl = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<NewAgeClassDialogComponent>, @Inject(MAT_DIALOG_DATA) {ageClassNameFc}, public snackBar: MatSnackBar, public fb: FormBuilder, public vs: ValidationService, public trackerService: TrackerService, public db: DatabaseService, public textTransformationService: TextTransformationService) {
    super(snackBar, fb, vs, trackerService, db, textTransformationService);
  }

  ngOnInit() {
    this.form = this.fb.group({
      ageClassNameFc: ['', Validators.required],
    });
  }

  getValues(){
    let ageClassName = this.ageClassNameFc.value;
    console.log(ageClassName);
    return {ageClassName};
  }

  allValid(){
    let values = this.getValues();
    if(this.vs.validateString(values.ageClassName)){
      return true;
    } else{
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.ageClassNameFc.hasError('required')){
      errorMessage = 'Age class name is required';
      return  errorMessage;
    }
    return  errorMessage;
  }


}
