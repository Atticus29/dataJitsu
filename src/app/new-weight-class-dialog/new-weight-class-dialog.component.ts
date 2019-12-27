import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import { takeUntil } from 'rxjs/operators';

import { ValidationService } from '../validation.service';
import { BaseComponent } from '../base/base.component';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TextTransformationService } from '../text-transformation.service';

import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

@Component({
  selector: 'app-new-weight-class-dialog',
  templateUrl: './new-weight-class-dialog.component.html',
  styleUrls: ['./new-weight-class-dialog.component.scss']
})
export class NewWeightClassDialogComponent extends BaseDialogComponent implements OnInit {
  form: FormGroup;
  private weightClassNameFc: FormControl = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<NewWeightClassDialogComponent>, @Inject(MAT_DIALOG_DATA) {weightClassNameFc}, public snackBar: MatSnackBar, public fb: FormBuilder, public vs: ValidationService, public trackerService: TrackerService, public db: DatabaseService, public textTransformationService: TextTransformationService) {
    super(snackBar, fb, vs, trackerService, db, textTransformationService);
  }

  ngOnInit() {
    this.form = this.fb.group({
      weightClassNameFc: ['', Validators.required],
    });
  }
  getValues(){
    let weightClassName = this.weightClassNameFc.value;
    console.log(weightClassName);
    return {weightClassName};
  }

  allValid(){
    let values = this.getValues();
    if(this.vs.validateString(values.weightClassName)){
      return true;
    } else{
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.weightClassNameFc.hasError('required')){
      errorMessage = 'Last name is required';
      return  errorMessage;
    }
    return  errorMessage;
  }


}
