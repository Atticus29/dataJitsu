import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';

import { takeUntil } from 'rxjs/operators';

import { ValidationService } from '../validation.service';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TextTransformationService } from '../text-transformation.service';

import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

@Component({
  selector: 'app-new-tournament-name-dialog',
  templateUrl: './new-tournament-name-dialog.component.html',
  styleUrls: ['./new-tournament-name-dialog.component.scss']
})
export class NewTournamentNameDialogComponent extends BaseDialogComponent implements OnInit {
  form: FormGroup;
  private tournamentNameFc: FormControl = new FormControl('', [Validators.required]);

  constructor(public dialogRef: MatDialogRef<NewTournamentNameDialogComponent>, @Inject(MAT_DIALOG_DATA) {tournamentNameFc}, public snackBar: MatSnackBar, public fb: FormBuilder, public vs: ValidationService, public trackerService: TrackerService, public db: DatabaseService, public textTransformationService: TextTransformationService) {
    super(snackBar, fb, vs, trackerService, db, textTransformationService);
  }

  ngOnInit() {
    this.form = this.fb.group({
      tournamentNameFc: ['', Validators.required],
    });
  }

  getValues(){
    let tournamentName = this.tournamentNameFc.value;
    console.log(tournamentName);
    return {tournamentName};
  }

  allValid(){
    let values = this.getValues();
    if(this.vs.validateString(values.tournamentName)){
      return true;
    } else{
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.tournamentNameFc.hasError('required')){
      errorMessage = 'Last name is required';
      return  errorMessage;
    }
    return  errorMessage;
  }


}
