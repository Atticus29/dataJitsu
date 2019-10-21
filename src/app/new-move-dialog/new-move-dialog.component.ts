import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';

import { ValidationService } from '../validation.service';
import { BaseComponent } from '../base/base.component';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';


@Component({
  selector: 'app-new-move-dialog',
  templateUrl: './new-move-dialog.component.html',
  styleUrls: ['./new-move-dialog.component.scss']
})
export class NewMoveDialogComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  private moveNameFc: FormControl = new FormControl('', [Validators.required]);
  private moveCategoryFc: FormControl = new FormControl('', [Validators.required]);
  private categories: any = constants.rootNodes;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NewMoveDialogComponent>, @Inject(MAT_DIALOG_DATA) {moveNameFc}, private vs: ValidationService, private trackerService: TrackerService, private db: DatabaseService) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      moveNameFc: ['', Validators.required],
    });
  }

  getValues(){
    let move = this.moveNameFc.value;
    let moveCategory = this.moveCategoryFc.value;
    return {move, moveCategory};
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
    if(this.vs.validateString(values.move) && this.vs.validateString(values.moveCategory)){
      return true;
    } else{
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.moveNameFc.hasError('required')){
      errorMessage = 'Move name is required';
      return  errorMessage;
    }
    if(this.moveCategoryFc.hasError('required')){
      errorMessage = 'Move category is required';
      return  errorMessage;
    }
    return  errorMessage;
  }


}
