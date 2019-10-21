import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';

import { ValidationService } from '../validation.service';
import { BaseComponent } from '../base/base.component';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';


@Component({
  selector: 'app-new-move-dialog',
  templateUrl: './new-move-dialog.component.html',
  styleUrls: ['./new-move-dialog.component.scss']
})
export class NewMoveDialogComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  private moveFc: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NewMoveDialogComponent>, @Inject(MAT_DIALOG_DATA) {moveFc}, private vs: ValidationService, private trackerService: TrackerService, private db: DatabaseService) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      moveFc: ['', Validators.required],
    });
  }

  getValues(){
    let move = this.moveFc.value;
    return {move};
  }

  processDialogData(){
    let vals = this.getValues();
    this.sendDataThroughDialog(vals);
  }

  sendDataThroughDialog(data: any){
    this.dialogRef.close(data);
  }

  close(){
    this.dialogRef.close();
  }

  allValid(){
    let values = this.getValues();
    if(this.vs.validateString(values.move)){
      return true;
    } else{
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.moveFc.hasError('required')){
      errorMessage = 'Move name is required';
      return  errorMessage;
    }
    return  errorMessage;
  }


}
