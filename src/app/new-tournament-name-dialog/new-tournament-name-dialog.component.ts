import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

import { ValidationService } from '../validation.service';
import { BaseComponent } from '../base/base.component';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';


@Component({
  selector: 'app-new-tournament-name-dialog',
  templateUrl: './new-tournament-name-dialog.component.html',
  styleUrls: ['./new-tournament-name-dialog.component.scss']
})
export class NewTournamentNameDialogComponent extends BaseComponent  implements OnInit {
  form: FormGroup;
  private tournamentNameFc: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<NewTournamentNameDialogComponent>, @Inject(MAT_DIALOG_DATA) {lastFc, firstFc}, private vs: ValidationService, private trackerService: TrackerService, private db: DatabaseService) {
    super();
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
