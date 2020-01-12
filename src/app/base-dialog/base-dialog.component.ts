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

  constructor(public snackBar: MatSnackBar, public fb: FormBuilder, public vs: ValidationService, public trackerService: TrackerService, public db: DatabaseService, public textTransformationService: TextTransformationService) {
    super();
  }

  ngOnInit() {
  }

  close(dialogRef: any){
    dialogRef.close();
  }

  openSnackBar(message: string) {
    // console.log("openSnackBar called");
    this.snackBar.open(message, '', {
      duration: 5000,
    });
  }

  processDialogData(vals: any, dialogRef: any){
    // let vals = this.getValues();
    console.log("processDialogData in base-dialog entered");
    console.log(vals);
    console.log(dialogRef);
    this.sendDataThroughDialog(vals, dialogRef);
    // this.db.addCandidateNameToDb(vals.last + ", " + vals.first);
  }

  sendDataThroughDialog(data: any, dialogRef: any){
    dialogRef.close(data);
  }

}
