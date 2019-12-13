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
  selector: 'app-new-move-dialog',
  templateUrl: './new-move-dialog.component.html',
  styleUrls: ['./new-move-dialog.component.scss']
})
export class NewMoveDialogComponent extends BaseComponent implements OnInit {
  form: FormGroup;
  private moveNameFc: FormControl = new FormControl('', [Validators.required]);
  private moveCategoryFc: FormControl = new FormControl('', [Validators.required]);
  private moveSubcategoryFc: FormControl = new FormControl('');
  private categories: any = constants.rootNodes;
  private subcategories: any = constants.subCategories;
  private localRootNodesWithSubcategories: Array<string> = constants.rootNodesWithSubcategories;
  private displaySubcategorySelect: boolean = false;
  private displayCategoryName: boolean = true;

  constructor(public snackBar: MatSnackBar, private fb: FormBuilder, private dialogRef: MatDialogRef<NewMoveDialogComponent>, @Inject(MAT_DIALOG_DATA) {moveNameFc}, private vs: ValidationService, private trackerService: TrackerService, private db: DatabaseService, private textTransformationService: TextTransformationService) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      moveNameFc: ['', Validators.required],
    });

    // this.moveNameFc.valueChanges.subscribe(moveCategory => {
    //   // console.log("moveCategory changed: " + moveCategory);
    //
    // });

    this.moveCategoryFc.valueChanges.subscribe(moveCategory => {
      if(this.localRootNodesWithSubcategories.includes(moveCategory)){
        this.displaySubcategorySelect = true;
      } else{
        this.displaySubcategorySelect = false;
      }
    });
  }

  getValues(){
    let move = this.textTransformationService.capitalizeFirstLetterOfEachWord(this.moveNameFc.value);
    let moveCategory = this.moveCategoryFc.value;
    let moveSubcategory = this.moveSubcategoryFc.value;
    if(!moveSubcategory){
      moveSubcategory = '';
    }
    return {move, moveCategory, moveSubcategory};
  }

  processDialogData(){
    let vals = this.getValues();
    // console.log(vals.move);
    this.db.doesMoveNameAlreadyExistInDb(vals.move, vals.moveCategory, vals.moveSubcategory).pipe(takeUntil(this.ngUnsubscribe)).subscribe(doesMoveNameAlreadyExistInDb =>{
      console.log("doesMoveNameAlreadyExistInDb?");
      console.log(doesMoveNameAlreadyExistInDb);
      if(doesMoveNameAlreadyExistInDb){
        this.openSnackBar("Move already exists in the database. Please find it in the dropdown menu");
      } else{
        console.log("this shouldn't happen if there's a match in the db");
        this.sendDataThroughDialog(vals);
      }
    })
  }

  sendDataThroughDialog(data: any){
    this.dialogRef.close(data);
  }

  close(){
    this.dialogRef.close();
  }

  allValid(){
    let values = this.getValues();
    if(this.displaySubcategorySelect){
      if(this.vs.validateString(values.move) && this.vs.validateString(values.moveCategory) && this.vs.validateString(values.moveSubcategory)){
        return true;
      } else{
        return false;
      }
    } else{
      if(this.vs.validateString(values.move) && this.vs.validateString(values.moveCategory)){
        return true;
      } else{
        return false;
      }
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
    if(this.moveSubcategoryFc.hasError('required')){
      errorMessage = 'Move subcategory is required';
      return  errorMessage;
    }
    return  errorMessage;
  }

  openSnackBar(message: string) {
    // console.log("openSnackBar called");
    this.snackBar.open(message, '', {
      duration: 3000,
    });
  }


}
