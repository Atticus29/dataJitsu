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
  selector: 'app-email-login-dialog',
  templateUrl: './email-login-dialog.component.html',
  styleUrls: ['./email-login-dialog.component.scss'],
  providers: [ValidationService]
})
export class EmailLoginDialogComponent extends BaseDialogComponent implements OnInit {
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<EmailLoginDialogComponent>, @Inject(MAT_DIALOG_DATA) {email, passwd}, public snackBar: MatSnackBar, public fb: FormBuilder, public vs: ValidationService, public trackerService: TrackerService, public db: DatabaseService, public textTransformationService: TextTransformationService) {
    super (snackBar, fb, vs, trackerService, db, textTransformationService);
    this.form = this.fb.group({
      email: [email, Validators.required],
      passwd: [passwd, Validators.required],
    });
  }

  ngOnInit() {
  }

  loginEmailProxy(){
    this.dialogRef.close(this.form.value);
  }

  close(){
    this.dialogRef.close();
  }

  allValid(){
    let values = this.form.value;
    if(this.vs.validateEmail(values.email) && this.vs.validatePassword(values.passwd)){
      return true;
    } else{
      return false;
    }
  }

  keyDownFunction(event) {
  if(event.keyCode == 13 && this.allValid()) {
    console.log('you just clicked enter');
    this.dialogRef.close(this.form.value);
  }
}
}
