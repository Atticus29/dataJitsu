import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';

import { ValidationService } from '../validation.service';
import { BaseComponent } from '../base/base.component';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';


@Component({
  selector: 'app-new-athlete-name-dialog',
  templateUrl: './new-athlete-name-dialog.component.html',
  styleUrls: ['./new-athlete-name-dialog.component.scss']
})
export class NewAthleteNameDialogComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  private lastFc: FormControl = new FormControl('', [Validators.required]);
  private firstFc: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NewAthleteNameDialogComponent>, @Inject(MAT_DIALOG_DATA) {lastFc, firstFc}, private vs: ValidationService, private trackerService: TrackerService, private db: DatabaseService) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      lastFc: ['', Validators.required],
      firstFc: ['', Validators.required],
    });

  }

  getValues(){
    let last = this.lastFc.value;
    // console.log(last);
    let first = this.firstFc.value;
    // console.log(first);
    // let otherResults = this.newMatchForm.value;
    return {last, first};
  }

  processDialogData(){
    let vals = this.getValues();
    this.sendDataThroughDialog(vals);
    // this.db.addCandidateNameToDb(vals.last + ", " + vals.first);
  }

  sendDataThroughDialog(data: any){
    this.dialogRef.close(data);
  }

  // addCandidateNameToDb(name: string){
  //
  // }

  close(){
    this.dialogRef.close();
  }

  allValid(){
    let values = this.getValues();
    if(this.vs.validateString(values.last) && this.vs.validateString(values.first)){
      return true;
    } else{
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.lastFc.hasError('required')){
      errorMessage = 'Last name is required';
      return  errorMessage;
    }
    if(this.firstFc.hasError('required')){
      errorMessage = 'First name is required';
      return  errorMessage;
    }
    return  errorMessage;
  }



}
