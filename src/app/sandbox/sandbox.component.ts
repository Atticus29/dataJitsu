import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from "@angular/core";

import { MatSnackBar } from "@angular/material";
import { takeUntil, withLatestFrom, take } from "rxjs/operators";
import { get, reduce } from "lodash";

import { constants } from "../constants";
import { DynamicFormConfiguration } from "../dynamicFormConfiguration.model";
import { FormQuestionBase } from "../formQuestionBase.model";
import { QuestionService } from "../question.service";
import { FormProcessingService } from "../form-processing.service";
import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { TrackerService } from "../tracker.service";
import { GraphingService } from "app/graphing.service";
import { EventInVideo } from "app/eventInVideo.model";
import { DataFormattingService } from "../data-formatting.service";
import { Video } from "app/video.model";

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
  private scrollDesired: boolean;

  constructor(
    private databaseService: DatabaseService,
    private questionService: QuestionService,
    private formProcessingService: FormProcessingService,
    public snackBar: MatSnackBar,
    private trackerService: TrackerService,
    private graphingService: GraphingService,
    private dataFormattingService: DataFormattingService
  ) {
    super();
    this.scrollDesired = true;
  }

  ngOnInit() {
    this.databaseService
      .getVideos()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((videoObjs) => {
        const videos: Video[] = Object.values(videoObjs).map(Video.fromJson);
        const eventsInVideo: EventInVideo[] = reduce(
          videos,
          (memo, video) => {
            const currentEventsInVideo = get(video, "eventsInVideo");
            return [...memo, ...currentEventsInVideo];
          },
          []
        );
        const movesToGraph =
          this.dataFormattingService.removeUnimportantMoves(eventsInVideo);
        const formattedHistogram =
          this.dataFormattingService.tranformDataToHistogram(movesToGraph, {
            appendSuccesses: true,
          });
        const maxVal: number = reduce(
          formattedHistogram,
          (memo, entry) => {
            return get(entry, "attempts") > memo
              ? get(entry, "attempts")
              : memo;
          },
          0
        );
        this.graphingService.drawGraph(this.svgMap, movesToGraph, {
          minWidthOfBarPlusPadding: 20,
          yLabIncrement: Math.min(maxVal, 10),
          yOffsetTopAsFractionOfYoffsetBottom: 0.75,
          horizontalDesired: true,
          attemptFillColor: "grey",
          // successFillColor: "#69F0AE",
        });
      });

    // this.questionService
    //   .getTestQuestions()
    //   .pipe(takeUntil(this.ngUnsubscribe))
    //   .subscribe((questionResults) => {
    //     this.localTestQuestionConfigOptions = new DynamicFormConfiguration(
    //       questionResults,
    //       [],
    //       "Done"
    //     );
    //     this.localTestQuestions = questionResults;
    //   });
  }
}
