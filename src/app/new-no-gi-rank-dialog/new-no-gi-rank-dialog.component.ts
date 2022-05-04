import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  FormArray,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

import { takeUntil } from "rxjs/operators";

import { ValidationService } from "../validation.service";
import { BaseComponent } from "../base/base.component";
import { TrackerService } from "../tracker.service";
import { DatabaseService } from "../database.service";
import { constants } from "../constants";
import { TextTransformationService } from "../text-transformation.service";

import { BaseDialogComponent } from "../base-dialog/base-dialog.component";

@Component({
  selector: "app-new-no-gi-rank-dialog",
  templateUrl: "./new-no-gi-rank-dialog.component.html",
  styleUrls: ["./new-no-gi-rank-dialog.component.scss"],
})
export class NewNoGiRankDialogComponent
  extends BaseDialogComponent
  implements OnInit
{
  form: FormGroup;
  public noGiRankNameFc: FormControl = new FormControl("", [
    Validators.required,
  ]);

  constructor(
    public dialogRef: MatDialogRef<NewNoGiRankDialogComponent>,
    @Inject(MAT_DIALOG_DATA) { noGiRankNameFc },
    public snackBar: MatSnackBar,
    public fb: FormBuilder,
    public vs: ValidationService,
    public trackerService: TrackerService,
    public db: DatabaseService,
    public textTransformationService: TextTransformationService
  ) {
    super(snackBar, fb, vs, trackerService, db, textTransformationService);
  }

  ngOnInit() {
    this.form = this.fb.group({
      noGiRankNameFc: ["", Validators.required],
    });
  }
  getValues() {
    let noGiRankName = this.noGiRankNameFc.value;
    console.log(noGiRankName);
    return { noGiRankName };
  }

  allValid() {
    let values = this.getValues();
    if (this.vs.validateString(values.noGiRankName)) {
      return true;
    } else {
      return false;
    }
  }

  getErrorMessage() {
    console.log("getErrorMessage entered");
    let errorMessage: string = "";
    if (this.noGiRankNameFc.hasError("required")) {
      errorMessage = "No gi rank name is required";
      return errorMessage;
    }
    return errorMessage;
  }
}
