import { reduce, get, orderBy } from "lodash";

import { ElementRef, Injectable } from "@angular/core";
import { DataFormattingService } from "./data-formatting.service";
import { EventInVideo } from "./eventInVideo.model";

@Injectable({
  providedIn: "root",
})
export class GraphingService {
  constructor(private dataFormattingService: DataFormattingService) {}

  drawGraph(svgMap: ElementRef<SVGSVGElement>, data: EventInVideo[]) {
    const width: number = svgMap.nativeElement.viewBox.baseVal.width;
    const height: number = svgMap.nativeElement.viewBox.baseVal.height;
    const xOffset: number = width * 0.1;
    const minWidth: number = 13;
    const formattedHistogram =
      this.dataFormattingService.tranformDataToHistogram(data, {
        appendSuccesses: true,
      });
    const numEvents = formattedHistogram ? formattedHistogram.length : 0;
    let rectWidthPlusPadding: number = (width - 2 * xOffset) / numEvents;
    const tooManyValues: boolean = rectWidthPlusPadding < minWidth;
    const sortedHistogram = orderBy(formattedHistogram, ["attempts"], ["desc"]);
    let truncatedLength: number;
    if (tooManyValues) {
      rectWidthPlusPadding = minWidth;
      truncatedLength = Math.floor((width - 2 * xOffset) / minWidth);
    }
    const fontSize = rectWidthPlusPadding / 2.5;
    const finalHistogram = tooManyValues
      ? sortedHistogram.slice(0, truncatedLength)
      : sortedHistogram;
    const longestText = reduce(
      finalHistogram,
      (memo, entry) => {
        return get(entry, "name", "").length > memo
          ? get(entry, "name").length
          : memo;
      },
      0
    );
    const yOffsetBottom: number = ((fontSize * 12) / 16) * longestText;
    const yOffsetTop: number = (((fontSize * 12) / 16) * longestText) / 3;
    this.drawAxes(svgMap, width, height, xOffset, yOffsetBottom, yOffsetTop);
    this.drawStackedBarChart(
      svgMap,
      width,
      height,
      xOffset,
      yOffsetBottom,
      yOffsetTop,
      finalHistogram,
      rectWidthPlusPadding,
      fontSize
    );
  }

  drawAxes(
    svgMap: ElementRef<SVGSVGElement>,
    width: number,
    height: number,
    xOffset: number,
    yOffsetBottom: number,
    yOffsetTop: number
  ) {
    const yAxis: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    yAxis.setAttribute("x1", String(xOffset));
    yAxis.setAttribute("y1", String(yOffsetTop));
    yAxis.setAttribute("x2", String(xOffset));
    yAxis.setAttribute("y2", String(height - yOffsetBottom));
    yAxis.setAttribute("stroke", "black");
    svgMap.nativeElement.appendChild(yAxis);
    const xAxis: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    xAxis.setAttribute("x1", String(xOffset));
    xAxis.setAttribute("y1", String(height - yOffsetBottom));
    xAxis.setAttribute("x2", String(width - xOffset));
    xAxis.setAttribute("y2", String(height - yOffsetBottom));
    xAxis.setAttribute("stroke", "black");
    svgMap.nativeElement.appendChild(xAxis);
  }

  drawStackedBarChart(
    svgMap: ElementRef<SVGSVGElement>,
    width: number,
    height: number,
    xOffset: number,
    yOffsetBottom: number,
    yOffsetTop: number = yOffsetBottom,
    finalHistogram: {}[],
    rectWidthPlusPadding: number,
    fontSize: number
  ) {
    const maxVal: number = reduce(
      finalHistogram,
      (memo, entry) => {
        return get(entry, "attempts") > memo ? get(entry, "attempts") : memo;
      },
      0
    );
    const xPadding: number = rectWidthPlusPadding * 0.33;
    const rectWidth: number = rectWidthPlusPadding * 0.67;
    const yUnit: number = (height - yOffsetBottom - yOffsetTop) / maxVal;
    finalHistogram.forEach((entry, idx) => {
      this.drawAttemptRect(
        xOffset,
        idx,
        xPadding,
        rectWidth,
        height,
        yOffsetBottom,
        yOffsetTop,
        entry,
        yUnit,
        svgMap
      );
      this.drawSuccessRect(
        xOffset,
        idx,
        xPadding,
        rectWidth,
        height,
        yOffsetBottom,
        yOffsetTop,
        entry,
        yUnit,
        svgMap
      );
      // if (idx === 1)
      this.drawXLabel(
        xOffset,
        idx,
        xPadding,
        rectWidth,
        height,
        yOffsetBottom,
        yOffsetTop,
        entry,
        yUnit,
        svgMap,
        rectWidthPlusPadding,
        fontSize
      );
    });
  }

  drawAttemptRect(
    xOffset: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    yOffsetTop: number = yOffsetBottom,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>
  ) {
    const attemptRect: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    attemptRect.setAttribute(
      "x",
      String(xOffset + (idx + 1) * xPadding + idx * rectWidth)
    );
    attemptRect.setAttribute("width", String(rectWidth));
    attemptRect.setAttribute(
      "y",
      String(height - yOffsetBottom - get(entry, "attempts") * yUnit)
    );
    attemptRect.setAttribute("height", String(get(entry, "attempts") * yUnit));
    attemptRect.setAttribute("stroke", "black");
    svgMap.nativeElement.appendChild(attemptRect);
  }

  drawSuccessRect(
    xOffset: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    yOffsetTop: number = yOffsetBottom,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>
  ) {
    const successRect: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    successRect.setAttribute(
      "x",
      String(xOffset + (idx + 1) * xPadding + idx * rectWidth)
    );
    successRect.setAttribute("width", String(rectWidth));
    successRect.setAttribute(
      "y",
      String(height - yOffsetBottom - get(entry, "successes") * yUnit)
    );
    successRect.setAttribute("height", String(get(entry, "successes") * yUnit));
    successRect.setAttribute("fill", "grey");
    svgMap.nativeElement.appendChild(successRect);
  }

  drawXLabel(
    xOffset: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    yOffsetTop: number = yOffsetBottom,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    rectWidthPlusPadding: number,
    fontSize: number
  ) {
    const name = get(entry, "name");
    const text: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const xPosition = xOffset + (idx + 1) * xPadding + idx * rectWidth;
    text.setAttribute("x", String(xPosition));
    const yPosition = height - yOffsetBottom + xPadding;
    text.setAttribute("y", String(yPosition));
    text.setAttribute("fill", "black");
    text.setAttribute("font-size", String(fontSize));
    text.setAttribute("text-anchor", "start");
    text.setAttribute(
      "transform",
      "rotate(90," + String(xPosition) + "," + String(yPosition) + ")"
    );
    // text.setAttribute(
    //   "transform",
    //   "rotate(90," + String(xPosition) + "," + String(yPosition) + ")"
    // );
    text.textContent = name;
    svgMap.nativeElement.appendChild(text);
  }
}
