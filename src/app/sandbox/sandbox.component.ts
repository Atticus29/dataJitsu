import { Component, OnInit, OnDestroy } from "@angular/core";

import { MatSnackBar } from "@angular/material";
import { takeUntil, withLatestFrom, take } from "rxjs/operators";

import { constants } from "../constants";
import { DynamicFormConfiguration } from "../dynamicFormConfiguration.model";
import { FormQuestionBase } from "../formQuestionBase.model";
import { QuestionService } from "../question.service";
import { FormProcessingService } from "../form-processing.service";
import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { TrackerService } from "../tracker.service";

@Component({
  selector: "app-sandbox",
  templateUrl: "./sandbox.component.html",
  styleUrls: ["./sandbox.component.scss"],
})
export class SandboxComponent extends BaseComponent implements OnInit {
  public localTestQuestionConfigOptions: DynamicFormConfiguration;
  public localTestQuestions: FormQuestionBase<any>[];

  constructor(
    public databaseService: DatabaseService,
    public questionService: QuestionService,
    public formProcessingService: FormProcessingService,
    public snackBar: MatSnackBar,
    public trackerService: TrackerService
  ) {
    super();
  }

  ngOnInit() {
    this.questionService
      .getTestQuestions()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((questionResults) => {
        this.localTestQuestionConfigOptions = new DynamicFormConfiguration(
          questionResults,
          [],
          "Done"
        );
        this.localTestQuestions = questionResults;
      });
  }
}
