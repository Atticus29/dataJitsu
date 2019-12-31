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
  selector: 'app-new-location-name-dialog',
  templateUrl: './new-location-name-dialog.component.html',
  styleUrls: ['./new-location-name-dialog.component.scss']
})
export class NewLocationNameDialogComponent extends BaseDialogComponent implements OnInit {
  form: FormGroup;
  private locationNameFc: FormControl = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<NewLocationNameDialogComponent>, @Inject(MAT_DIALOG_DATA) {locationNameFc}, public snackBar: MatSnackBar, public fb: FormBuilder, public vs: ValidationService, public trackerService: TrackerService, public db: DatabaseService, public textTransformationService: TextTransformationService) {
    super(snackBar, fb, vs, trackerService, db, textTransformationService);
  }

  ngOnInit() {
    this.form = this.fb.group({
      locationNameFc: ['', Validators.required],
    });
  }

  getValues(){
    let locationName = this.locationNameFc.value;
    console.log(locationName);
    return {locationName};
  }

  allValid(){
    let values = this.getValues();
    if(this.vs.validateString(values.locationName)){
      return true;
    } else{
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.locationNameFc.hasError('required')){
      errorMessage = 'Location name is required';
      return  errorMessage;
    }
    return  errorMessage;
  }

}
