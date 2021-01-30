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
  selector: 'app-new-item-name-dialog',
  templateUrl: './new-item-name-dialog.component.html',
  styleUrls: ['./new-item-name-dialog.component.scss']
})
export class NewItemNameDialogComponent extends BaseDialogComponent implements OnInit {
  form: FormGroup;
  private itemNameFc: FormControl = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<NewItemNameDialogComponent>, @Inject(MAT_DIALOG_DATA) {itemNameFc}, public snackBar: MatSnackBar, public fb: FormBuilder, public vs: ValidationService, public trackerService: TrackerService, public db: DatabaseService, public textTransformationService: TextTransformationService) {
    super(snackBar, fb, vs, trackerService, db, textTransformationService);
  }

  ngOnInit() {
    this.form = this.fb.group({
      itemNameFc: ['', Validators.required],
    });
  }

  getValues(){
    let itemName = this.itemNameFc.value;
    console.log(itemName);
    return {itemName};
  }

  allValid(){
    let values = this.getValues();
    if(this.vs.validateString(values.itemName)){
      return true;
    } else{
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.itemNameFc.hasError('required')){
      errorMessage = 'Item name is required';
      return  errorMessage;
    }
    return  errorMessage;
  }
}
