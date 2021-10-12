import { Component, OnInit, Input } from "@angular/core";

import { Video } from "../video.model";

@Component({
  selector: "app-full-analysis-display",
  templateUrl: "./full-analysis-display.component.html",
  styleUrls: ["./full-analysis-display.component.scss"],
})
export class FullAnalysisDisplayComponent implements OnInit {
  @Input() dataForD3: Video[] = [];

  constructor() {}

  ngOnInit() {
    console.log("deleteMe got here and dataForD3 is: ");
    console.log(this.dataForD3);
  }
}
