import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';

import { takeUntil } from 'rxjs/operators';

import { ValidationService } from '../validation.service';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';
import { constants } from '../constants';
import { TextTransformationService } from '../text-transformation.service';
import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

@Component({
  selector: 'app-new-move-dialog',
  templateUrl: './new-move-dialog.component.html',
  styleUrls: ['./new-move-dialog.component.scss']
})
export class NewMoveDialogComponent extends BaseDialogComponent implements OnInit {
  form: FormGroup;
  private eventNameFc: FormControl = new FormControl('', [Validators.required]);
  private eventCategoryFc: FormControl = new FormControl('', [Validators.required]);
  private moveSubcategoryFc: FormControl = new FormControl('');
  private categories: any = constants.rootNodes.sort();
  private subcategories: any = constants.subCategories.sort();
  private localRootNodesWithSubcategories: Array<string> = constants.rootNodesWithSubcategories.sort();
  private displaySubcategorySelect: boolean = false;
  private displayCategoryName: boolean = true;

  constructor(public snackBar: MatSnackBar, public fb: FormBuilder, public dialogRef: MatDialogRef<NewMoveDialogComponent>, @Inject(MAT_DIALOG_DATA) {eventNameFc}, public vs: ValidationService, public trackerService: TrackerService, public db: DatabaseService, public textTransformationService: TextTransformationService) {
    super(snackBar, fb, vs, trackerService, db, textTransformationService);
  }

  ngOnInit() {
    this.form = this.fb.group({
      eventNameFc: ['', Validators.required],
    });

    // this.eventNameFc.valueChanges.subscribe(eventCategory => {
    //   // console.log("eventCategory changed: " + eventCategory);
    //
    // });

    this.eventCategoryFc.valueChanges.subscribe(eventCategory => {
      if(this.localRootNodesWithSubcategories.includes(eventCategory)){
        this.displaySubcategorySelect = true;
      } else{
        this.displaySubcategorySelect = false;
      }
    });
  }

  getValues(){
    let move = this.textTransformationService.capitalizeFirstLetterOfEachWord(this.eventNameFc.value);
    let eventCategory = this.eventCategoryFc.value;
    let moveSubcategory = this.moveSubcategoryFc.value;
    if(!moveSubcategory){
      moveSubcategory = '';
    }
    return {move, eventCategory, moveSubcategory};
  }

  processDialogData(){
    let vals = this.getValues();
    // console.log(vals.move);
    this.db.doesMoveNameAlreadyExistInDb(vals.move, vals.eventCategory, vals.moveSubcategory).pipe(takeUntil(this.ngUnsubscribe)).subscribe(doesMoveNameAlreadyExistInDb =>{
      console.log("doesMoveNameAlreadyExistInDb?");
      console.log(doesMoveNameAlreadyExistInDb);
      if(doesMoveNameAlreadyExistInDb){
        this.openSnackBar(constants.eventNameAlreadyExistsNotification);
      } else{
        console.log("this shouldn't happen if there's a match in the db");
        this.sendDataThroughDialog(vals, this.dialogRef);
      }
    })
  }

  // sendDataThroughDialog(data: any){
  //   this.dialogRef.close(data);
  // }

  // close(){
  //   this.dialogRef.close();
  // }

  allValid(){
    let values = this.getValues();
    if(this.displaySubcategorySelect){
      if(this.vs.validateString(values.move) && this.vs.validateString(values.eventCategory) && this.vs.validateString(values.moveSubcategory)){
        return true;
      } else{
        return false;
      }
    } else{
      if(this.vs.validateString(values.move) && this.vs.validateString(values.eventCategory)){
        return true;
      } else{
        return false;
      }
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if(this.eventNameFc.hasError('required')){
      errorMessage = 'Move name is required';
      return  errorMessage;
    }
    if(this.eventCategoryFc.hasError('required')){
      errorMessage = 'Move category is required';
      return  errorMessage;
    }
    if(this.moveSubcategoryFc.hasError('required')){
      errorMessage = 'Move subcategory is required';
      return  errorMessage;
    }
    return  errorMessage;
  }

  // openSnackBar(message: string) {
  //   // console.log("openSnackBar called");
  //   this.snackBar.open(message, '', {
  //     duration: 3000,
  //   });
  // }


}
