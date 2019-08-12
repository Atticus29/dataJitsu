import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { EmailLoginDialog } from '../emailLoginDialog.model';
import {FormBuilder, Validators, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-email-login-dialog',
  templateUrl: './email-login-dialog.component.html',
  styleUrls: ['./email-login-dialog.component.scss']
})
export class EmailLoginDialogComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<EmailLoginDialogComponent>, @Inject(MAT_DIALOG_DATA) {email, passwd} ) {
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



}
