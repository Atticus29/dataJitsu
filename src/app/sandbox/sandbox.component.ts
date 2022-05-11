import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";

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
import { GraphingService } from "app/graphing.service";

@Component({
  selector: "app-sandbox",
  templateUrl: "./sandbox.component.html",
  styleUrls: ["./sandbox.component.scss"],
})
export class SandboxComponent extends BaseComponent implements OnInit {
  @ViewChild("graphSpace", { static: true })
  private svgMap: ElementRef<SVGSVGElement>;
  private localTestQuestionConfigOptions: DynamicFormConfiguration;
  private localTestQuestions: FormQuestionBase<any>[];

  constructor(
    private databaseService: DatabaseService,
    private questionService: QuestionService,
    private formProcessingService: FormProcessingService,
    public snackBar: MatSnackBar,
    private trackerService: TrackerService,
    private graphingService: GraphingService
  ) {
    super();
  }

  ngOnInit() {
    console.log("deleteMe svgMap is: ");
    console.log(this.svgMap);
    this.graphingService.drawGraph(this.svgMap);
    const testLine: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    // testLine.setAttribute("x1", "0");
    // testLine.setAttribute("y1", "0");
    // testLine.setAttribute("x2", "500");
    // testLine.setAttribute("y2", "500");
    // testLine.setAttribute("stroke", "black");
    // this.svgMap.nativeElement.appendChild(testLine);
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
