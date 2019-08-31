import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";

import { EmailLoginDialog } from '../emailLoginDialog.model';
import { ValidationService } from '../validation.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-email-login-dialog',
  templateUrl: './email-login-dialog.component.html',
  styleUrls: ['./email-login-dialog.component.scss'],
  providers: [ValidationService]
})
export class EmailLoginDialogComponent extends BaseComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EmailLoginDialogComponent>, @Inject(MAT_DIALOG_DATA) {email, passwd}, private vs: ValidationService) {
    super();
    this.form = fb.group({
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



}
