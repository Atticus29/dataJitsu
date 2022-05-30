import { reduce, get, orderBy } from "lodash";

import { ElementRef, Injectable } from "@angular/core";
import { DataFormattingService } from "./data-formatting.service";
import { EventInVideo } from "./eventInVideo.model";

export interface Options {
  xOffsetWidthFraction?: number;
  minWidthOfBarPlusPadding?: number;
  yOffsetTopAsFractionOfYoffsetBottom?: number;
  fractionOfxPaddingInRectWidthPlusPadding?: number;
  attemptFillColor?: string;
  successFillColor?: string;
  textColor?: string;
  yLabIncrement?: number;
  yAxisLabel?: string;
}

@Injectable({
  providedIn: "root",
})
export class GraphingService {
  constructor(private dataFormattingService: DataFormattingService) {}

  drawGraph(
    svgMap: ElementRef<SVGSVGElement>,
    data: EventInVideo[],
    options: Options
  ) {
    const width: number = svgMap.nativeElement.viewBox.baseVal.width;
    const height: number = svgMap.nativeElement.viewBox.baseVal.height;
    const xOffset: number = width * get(options, "xOffsetWidthFraction", 0.1);
    const formattedHistogram =
      this.dataFormattingService.tranformDataToHistogram(data, {
        appendSuccesses: true,
      });
    const numEvents = formattedHistogram ? formattedHistogram.length : 0;
    let rectWidthPlusPadding: number = (width - 2 * xOffset) / numEvents;
    console.log("deleteMe rectWidthPlusPadding is: " + rectWidthPlusPadding);
    const tooManyValues: boolean =
      rectWidthPlusPadding < get(options, "minWidthOfBarPlusPadding", 13);
    const sortedHistogram = orderBy(formattedHistogram, ["attempts"], ["desc"]);
    let truncatedLength: number;
    if (tooManyValues) {
      rectWidthPlusPadding = get(options, "minWidthOfBarPlusPadding", 13);
      truncatedLength = Math.floor(
        (width - 2 * xOffset) / get(options, "minWidthOfBarPlusPadding", 13)
      );
    }
    const fractionOfxPaddingInRectWidthPlusPadding = get(
      options,
      "fractionOfxPaddingInRectWidthPlusPadding",
      0.33
    );
    const xPadding: number =
      rectWidthPlusPadding * fractionOfxPaddingInRectWidthPlusPadding;
    const rectWidth: number =
      rectWidthPlusPadding * (1 - fractionOfxPaddingInRectWidthPlusPadding);
    const fontSize = Math.min((rectWidth * 12) / 16, 32);
    console.log("deleteMe fontSize is: " + fontSize);
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
    const yOffsetBottom: number = Math.min(
      ((fontSize * 10) / 16) * longestText,
      height * 0.25
    );
    const yOffsetTop: number =
      yOffsetBottom * get(options, "yOffsetTopAsFractionOfYoffsetBottom", 0.33);
    this.drawAxes(svgMap, width, height, xOffset, yOffsetBottom, yOffsetTop);
    this.drawStackedBarChart(
      svgMap,
      height,
      width,
      xOffset,
      yOffsetBottom,
      yOffsetTop,
      finalHistogram,
      fontSize,
      xPadding,
      rectWidth,
      get(options, "attemptFillColor", "black"),
      get(options, "successFillColor", "grey"),
      get(options, "textColor", "black"),
      get(options, "yLabIncrement", 10),
      get(
        options,
        "yAxisLabel",
        "Number of attempted/successful moves in the current data set"
      )
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
    height: number,
    width: number,
    xOffset: number,
    yOffsetBottom: number,
    yOffsetTop: number = yOffsetBottom,
    finalHistogram: {}[],
    fontSize: number,
    xPadding: number,
    rectWidth: number,
    attemptFillColor: string,
    successFillColor: string,
    textColor: string,
    yLabIncrement: number,
    yAxisLabel: string
  ) {
    const maxVal: number = reduce(
      finalHistogram,
      (memo, entry) => {
        return get(entry, "attempts") > memo ? get(entry, "attempts") : memo;
      },
      0
    );
    // const xPadding: number =
    //   rectWidthPlusPadding * fractionOfxPaddingInRectWidthPlusPadding;
    // const rectWidth: number =
    //   rectWidthPlusPadding * (1 - fractionOfxPaddingInRectWidthPlusPadding);
    console.log("deleteMe height is: " + height);
    console.log("deleteMe yOffsetBottom is: " + yOffsetBottom);
    console.log("deleteMe yOffsetTop is: " + yOffsetTop);
    console.log("deleteMe maxVal is: " + maxVal);
    const yUnit: number = Math.min(
      (height - yOffsetBottom - yOffsetTop) / maxVal,
      height / 10
    );
    console.log("deleteMe yUnit up here is: ");
    console.log(yUnit);
    finalHistogram.forEach((entry, idx) => {
      this.drawAttemptRect(
        xOffset,
        idx,
        xPadding,
        rectWidth,
        height,
        yOffsetBottom,
        entry,
        yUnit,
        svgMap,
        attemptFillColor
      );
      this.drawSuccessRect(
        xOffset,
        idx,
        xPadding,
        rectWidth,
        height,
        yOffsetBottom,
        entry,
        yUnit,
        svgMap,
        successFillColor
      );
      this.drawXLabel(
        xOffset,
        idx,
        xPadding,
        rectWidth,
        height,
        yOffsetBottom,
        entry,
        svgMap,
        fontSize,
        textColor
      );
    });
    this.drawYScale(
      maxVal,
      xOffset,
      xPadding,
      height,
      yOffsetBottom,
      yUnit,
      svgMap,
      fontSize,
      yLabIncrement,
      textColor
    );
    this.drawYAxisLabel(
      maxVal,
      xOffset,
      xPadding,
      height,
      yOffsetBottom,
      yUnit,
      svgMap,
      fontSize,
      textColor,
      yAxisLabel
    );
    this.drawLegend(
      svgMap,
      width,
      yOffsetBottom,
      yOffsetTop,
      fontSize,
      attemptFillColor,
      successFillColor,
      textColor,
      yUnit,
      xPadding
    );
  }

  drawAttemptRect(
    xOffset: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    attemptFillColor: string
  ) {
    this.drawRectCore(
      "attempts",
      xOffset,
      idx,
      xPadding,
      rectWidth,
      height,
      yOffsetBottom,
      entry,
      yUnit,
      svgMap,
      attemptFillColor
    );
  }

  drawSuccessRect(
    xOffset: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    successFillColor: string
  ) {
    this.drawRectCore(
      "successes",
      xOffset,
      idx,
      xPadding,
      rectWidth,
      height,
      yOffsetBottom,
      entry,
      yUnit,
      svgMap,
      successFillColor
    );
  }

  drawRectCore(
    entryAccessor: string,
    xOffset: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    fillColor: string
  ) {
    console.log("deleteMe yUnit is: ");
    console.log(yUnit);
    const rect: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect.setAttribute(
      "x",
      String(xOffset + (idx + 1) * xPadding + idx * rectWidth)
    );
    rect.setAttribute("width", String(rectWidth));
    rect.setAttribute(
      "y",
      String(height - yOffsetBottom - get(entry, entryAccessor) * yUnit)
    );
    rect.setAttribute("height", String(get(entry, entryAccessor) * yUnit));
    rect.setAttribute("stroke-width", String(1));
    rect.setAttribute("stroke", "black");
    rect.setAttribute("fill", fillColor);
    svgMap.nativeElement.appendChild(rect);
  }

  drawXLabel(
    xOffset: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    entry: {},
    svgMap: ElementRef<SVGSVGElement>,
    fontSize: number,
    textColor: string
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
    text.setAttribute("fill", textColor);
    text.setAttribute("font-size", String(fontSize));
    text.setAttribute("text-anchor", "start");
    text.setAttribute(
      "transform",
      "rotate(45," + String(xPosition) + "," + String(yPosition) + ")"
    );
    text.textContent = name;
    svgMap.nativeElement.appendChild(text);
  }

  drawYScale(
    maxVal: number,
    xOffset: number,
    xPadding: number,
    height: number,
    yOffsetBottom: number,
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    fontSize: number,
    numDelimiters: number = maxVal,
    textColor: string
  ) {
    const incrementBy = maxVal / numDelimiters;
    const xOffsetLeft = String(maxVal).length * ((fontSize * 12) / 16);
    for (let i = 0; i < maxVal + 1; i += incrementBy) {
      const text: SVGElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      const xPosition = xOffset - xOffsetLeft - xPadding;
      text.setAttribute("x", String(xPosition));
      const yPosition = height - yOffsetBottom - i * yUnit;
      text.setAttribute("y", String(yPosition));
      text.setAttribute("fill", textColor);
      text.setAttribute("font-size", String(fontSize));
      text.setAttribute("text-anchor", "start");
      text.textContent = String(Math.floor(i));
      svgMap.nativeElement.appendChild(text);
    }
  }

  drawYAxisLabel(
    maxVal: number,
    xOffset: number,
    xPadding: number,
    height: number,
    yOffsetBottom: number,
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    fontSize: number,
    textColor: string,
    yAxisLabel: string
  ) {
    const xOffsetLeft = (String(maxVal).length + 3) * ((fontSize * 12) / 16);
    const text: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const xPosition = xOffset - xOffsetLeft - xPadding;
    text.setAttribute("x", String(xPosition));
    const yPosition = height - yOffsetBottom - (maxVal / 2) * yUnit;
    text.setAttribute("y", String(yPosition));
    text.setAttribute("fill", textColor);
    text.setAttribute("font-size", String(fontSize));
    text.setAttribute("text-anchor", "middle");
    text.setAttribute(
      "transform",
      "rotate(90," + String(xPosition) + "," + String(yPosition) + ")"
    );
    text.textContent = yAxisLabel;
    svgMap.nativeElement.appendChild(text);
  }

  drawLegend(
    svgMap: ElementRef<SVGSVGElement>,
    width: number,
    yOffsetBottom: number,
    yOffsetTop: number = yOffsetBottom,
    fontSize: number,
    attemptFillColor: string,
    successFillColor: string,
    textColor: string,
    yUnit: number,
    xPadding: number
  ) {
    const rect: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect.setAttribute("x", String(0.75 * width));
    rect.setAttribute("width", String(yUnit));
    rect.setAttribute("y", String(yOffsetTop * 0.33));
    rect.setAttribute("height", String(yUnit));
    rect.setAttribute("stroke-width", String(1));
    rect.setAttribute("stroke", "black");
    rect.setAttribute("fill", attemptFillColor);
    svgMap.nativeElement.appendChild(rect);

    const text: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    text.setAttribute("x", String(0.75 * width + yUnit + xPadding));
    text.setAttribute("y", String(yOffsetTop * 0.33 + yUnit * 0.75));
    text.setAttribute("fill", textColor);
    text.setAttribute("font-size", String(fontSize));
    text.setAttribute("text-anchor", "start");
    text.textContent = "Move attempts";
    svgMap.nativeElement.appendChild(text);

    const rect2: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect2.setAttribute("x", String(0.75 * width));
    rect2.setAttribute("width", String(yUnit));
    rect2.setAttribute("y", String(yOffsetTop * 0.67));
    rect2.setAttribute("height", String(yUnit));
    rect2.setAttribute("stroke-width", String(1));
    rect2.setAttribute("stroke", "black");
    rect2.setAttribute("fill", successFillColor);
    svgMap.nativeElement.appendChild(rect2);

    const text2: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    text2.setAttribute("x", String(0.75 * width + yUnit + xPadding));
    text2.setAttribute("y", String(yOffsetTop * 0.67 + yUnit * 0.75));
    text2.setAttribute("fill", textColor);
    text2.setAttribute("font-size", String(fontSize));
    text2.setAttribute("text-anchor", "start");
    text2.textContent = "Move successes";
    svgMap.nativeElement.appendChild(text2);
  }
}
