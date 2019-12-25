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


@Component({
  selector: 'app-base-dialog',
  templateUrl: './base-dialog.component.html',
  styleUrls: ['./base-dialog.component.scss']
})
export class BaseDialogComponent extends BaseComponent implements OnInit {

  constructor(public snackBar: MatSnackBar, private fb: FormBuilder, private dialogRef: MatDialogRef<NewMoveDialogComponent>, @Inject(MAT_DIALOG_DATA) {moveNameFc}, private vs: ValidationService, private trackerService: TrackerService, private db: DatabaseService, private textTransformationService: TextTransformationService) {
    super();
  }

  ngOnInit() {
  }

  sendDataThroughDialog(data: any){
    this.dialogRef.close(data);
  }

  close(){
    this.dialogRef.close();
  }

  openSnackBar(message: string) {
    // console.log("openSnackBar called");
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }

}
