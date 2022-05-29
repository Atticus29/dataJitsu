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
    // const yOffset: number = height * 0.1;

    // const yOffset: number = height / longestText;
    const yOffset: number = ((fontSize * 12) / 16) * longestText;
    console.log("deleteMe longestText is: " + longestText);
    console.log("deleteMe yOffset is: " + yOffset);
    this.drawAxes(svgMap, width, height, xOffset, yOffset);
    this.drawStackedBarChart(
      svgMap,
      width,
      height,
      xOffset,
      yOffset,
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
    yOffset: number
  ) {
    const yAxis: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    yAxis.setAttribute("x1", String(0 + xOffset));
    yAxis.setAttribute("y1", String(0 + yOffset));
    yAxis.setAttribute("x2", String(0 + xOffset));
    yAxis.setAttribute("y2", String(0 + height - yOffset));
    yAxis.setAttribute("stroke", "black");
    svgMap.nativeElement.appendChild(yAxis);
    const xAxis: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    xAxis.setAttribute("x1", String(0 + xOffset));
    xAxis.setAttribute("y1", String(0 + height - yOffset));
    xAxis.setAttribute("x2", String(0 + width - xOffset));
    xAxis.setAttribute("y2", String(0 + height - yOffset));
    xAxis.setAttribute("stroke", "black");
    svgMap.nativeElement.appendChild(xAxis);
  }

  drawStackedBarChart(
    svgMap: ElementRef<SVGSVGElement>,
    width: number,
    height: number,
    xOffset: number,
    yOffset: number,
    finalHistogram: {}[],
    rectWidthPlusPadding: number,
    fontSize: number
  ) {
    // const formattedHistogram =
    //   this.dataFormattingService.tranformDataToHistogram(data, {
    //     appendSuccesses: true,
    //   });
    // const maxVal: number = reduce(
    //   formattedHistogram,
    //   (memo, entry) => {
    //     return get(entry, "attempts") > memo ? get(entry, "attempts") : memo;
    //   },
    //   0
    // );
    const maxVal: number = reduce(
      finalHistogram,
      (memo, entry) => {
        return get(entry, "attempts") > memo ? get(entry, "attempts") : memo;
      },
      0
    );
    // const numEvents = formattedHistogram ? formattedHistogram.length : 0;
    // let rectWidthPlusPadding: number = (width - 2 * xOffset) / numEvents;
    // const tooManyValues = rectWidthPlusPadding < minWidth;
    // const sortedHistogram = orderBy(formattedHistogram, ["attempts"], ["desc"]);
    // let truncatedLength: number;
    // if (tooManyValues) {
    //   rectWidthPlusPadding = minWidth;
    //   truncatedLength = Math.floor((width - 2 * xOffset) / minWidth);
    //   console.log("deleteMe truncatedLength: is");
    //   console.log(truncatedLength);
    // }
    // const finalHistogram = tooManyValues
    //   ? sortedHistogram.slice(0, truncatedLength)
    //   : sortedHistogram;
    // console.log("deleteMe rectWidthPlusPadding is: ");
    // console.log(rectWidthPlusPadding);
    const xPadding: number = rectWidthPlusPadding * 0.33;
    const rectWidth: number = rectWidthPlusPadding * 0.67;
    const yUnit: number = (height - 2 * yOffset) / maxVal;
    finalHistogram.forEach((entry, idx) => {
      this.drawAttemptRect(
        xOffset,
        idx,
        xPadding,
        rectWidth,
        height,
        yOffset,
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
        yOffset,
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
        yOffset,
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
    yOffset: number,
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
      String(height - yOffset - get(entry, "attempts") * yUnit)
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
    yOffset: number,
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
      String(height - yOffset - get(entry, "successes") * yUnit)
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
    yOffset: number,
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
    const yPosition = height - yOffset + xPadding;
    text.setAttribute("y", String(yPosition));
    text.setAttribute("fill", "black");
    // text.setAttribute("font-size", String(rectWidthPlusPadding / 2.5));
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
