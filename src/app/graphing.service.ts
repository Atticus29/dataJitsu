import { reduce, get, orderBy, map } from "lodash";

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
  legendLabels?: {}[];
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
    const attemptFillColor = get(options, "attemptFillColor", "white");
    const successFillColor = get(options, "successFillColor", "black");
    const legendLabels: {}[] = get(options, "legendLabels", [
      { label: "Move attempts", color: attemptFillColor },
      { label: "Move successes", color: successFillColor },
    ]);
    const fontToPixelRatio: number = 12 / 16;
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
    const fontSize = Math.min(rectWidth * fontToPixelRatio, 32);
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
      fontSize * fontToPixelRatio * longestText,
      height * 0.25
    );
    const yOffsetTop: number =
      yOffsetBottom * get(options, "yOffsetTopAsFractionOfYoffsetBottom", 0.33);
    this.drawAxes(svgMap, width, height, xOffset, yOffsetBottom, yOffsetTop);
    this.drawVerticalStackedBarChart(
      legendLabels,
      fontToPixelRatio,
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
      attemptFillColor,
      successFillColor,
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

  drawVerticalStackedBarChart(
    legendLabels: {}[],
    fontToPixelRatio: number,
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
    // const yUnit: number = Math.min(
    //   (height - yOffsetBottom - yOffsetTop) / maxVal,
    //   height / 10
    // );
    // const yUnit: number = Math.min(
    //   (height - yOffsetBottom - yOffsetTop) / maxVal,
    //   (height - yOffsetBottom - yOffsetTop) / 8
    // );
    const yUnit: number = (height - yOffsetBottom - yOffsetTop) / maxVal;
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
      fontToPixelRatio,
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
      fontToPixelRatio,
      maxVal,
      xOffset,
      xPadding,
      height,
      yOffsetTop,
      yOffsetBottom,
      yUnit,
      svgMap,
      fontSize,
      textColor,
      yAxisLabel
    );
    this.drawLegend(
      svgMap,
      fontToPixelRatio,
      xOffset,
      width,
      yOffsetBottom,
      yOffsetTop,
      fontSize,
      legendLabels,
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
    console.log("deleteMe yOffsetBottom is: " + yOffsetBottom);
    console.log("deleteMe xPadding is: " + xPadding);
    const yPosition =
      height - yOffsetBottom + Math.min(xPadding, yOffsetBottom * 0.25);
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
    fontToPixelRatio: number,
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
    const xOffsetLeft = String(maxVal).length * (fontSize * fontToPixelRatio);
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
    fontToPixelRatio: number,
    maxVal: number,
    xOffset: number,
    xPadding: number,
    height: number,
    yOffsetTop: number,
    yOffsetBottom: number,
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    fontSize: number,
    textColor: string,
    yAxisLabel: string
  ) {
    const xOffsetLeft =
      (String(maxVal).length + 3) * (fontSize * fontToPixelRatio);
    const text: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const xPosition = Math.max(xOffset - xOffsetLeft - xPadding, 5);
    console.log("deleteMe xOffset is: " + xOffset);
    console.log("deleteMe xPadding is: " + xPadding);
    // const xPosition = Math.max(xOffset - xPadding, 0);
    console.log("deleteMe xPosition in drawYAxisLabel is: " + xPosition);
    text.setAttribute("x", String(xPosition));
    console.log("deleteMe maxVal is: " + maxVal);
    console.log("deleteMe yUnit is: " + yUnit);
    console.log("deleteMe height is: " + height);
    console.log("deleteMe yOffsetBottom is: " + yOffsetBottom);
    const yPosition = height - yOffsetBottom - (maxVal / 2) * yUnit;
    // const yPosition = height;
    const graphHeight: number = height - yOffsetBottom - yOffsetTop;
    console.log("deleteMe graphHeight is: " + graphHeight);
    const desiredPercentageOfTheGraphHeight: number = 1;
    console.log("deleteMe fontSize is: " + fontSize);
    const totalLengthOfLabel = yAxisLabel.length * fontSize * fontToPixelRatio;
    console.log("deletMe totalLengthOfLabel is " + totalLengthOfLabel);
    const isTooBig: boolean =
      graphHeight * desiredPercentageOfTheGraphHeight < totalLengthOfLabel;
    console.log("deleteMe isTooBig for drawYAxis is: " + isTooBig);
    const scaledHeight: number = isTooBig
      ? (graphHeight * desiredPercentageOfTheGraphHeight) / totalLengthOfLabel
      : 1;
    console.log("deleteMe yPosition is: " + yPosition);
    text.setAttribute("y", String(yPosition));
    text.setAttribute("fill", textColor);
    text.setAttribute(
      "font-size",
      String((fontSize * scaledHeight) / fontToPixelRatio)
    );
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
    fontToPixelRatio: number,
    xOffset: number,
    width: number,
    yOffsetBottom: number,
    yOffsetTop: number = yOffsetBottom,
    fontSize: number,
    legendLabels: {}[],
    textColor: string,
    yUnit: number,
    xPadding: number
  ) {
    legendLabels.forEach((legendLabel, idx) => {
      const legendUnit: number = 1 / (legendLabels.length + 1);
      const currentYLegendOffset: number = (idx + 1) * legendUnit;
      const yPosition: number = yOffsetTop * currentYLegendOffset;
      const yUnitScaledForLegend: number = Math.min(yUnit, 20);
      const textYPosition: number = yPosition + yUnitScaledForLegend;
      const desiredPercentageOfTheGraphWidth: number = 0.5;
      this.drawSingleLegendLabeledSquare(
        svgMap,
        fontToPixelRatio,
        xOffset,
        yPosition,
        width,
        yOffsetBottom,
        yOffsetTop,
        fontSize,
        get(legendLabel, "color"),
        textColor,
        yUnitScaledForLegend,
        xPadding,
        get(legendLabel, "label"),
        map(legendLabels, (legendLab: {}) => get(legendLab, "label")),
        String(textYPosition),
        desiredPercentageOfTheGraphWidth
      );
    });
  }

  drawSingleLegendLabeledSquare(
    svgMap: ElementRef<SVGSVGElement>,
    fontToPixelRatio: number,
    xOffset: number,
    yPosition: number,
    width: number,
    yOffsetBottom: number,
    yOffsetTop: number = yOffsetBottom,
    fontSize: number,
    fillColor: string,
    textColor: string,
    yUnitScaledForLegend: number,
    xPadding: number,
    textContent: string,
    textArray: string[],
    textYPosition: string,
    desiredPercentageOfTheGraphWidth: number
  ) {
    const legendFontSize: number = Math.min(fontSize, 24);
    const lengths: number[] = map(textArray, (item: string) => item.length);
    const maxLetterLength: number = Math.max(
      ...map(textArray, (item: string) => item.length)
    );
    console.log("deleteMe maxLetterLength is: " + maxLetterLength);
    console.log("deleteMe yUnitScaledForLegend is: " + yUnitScaledForLegend);
    const spaceBetweenSquareAndText: number = yUnitScaledForLegend; // TODO deleteMe  * 2
    const totalLengthOfLabeledSquare: number =
      yUnitScaledForLegend +
      spaceBetweenSquareAndText +
      legendFontSize * maxLetterLength * fontToPixelRatio;
    const graphWidth: number = width - 2 * xOffset;
    const isTooBig: boolean =
      graphWidth * desiredPercentageOfTheGraphWidth <
      totalLengthOfLabeledSquare;
    console.log("deleteMe isTooBig is: " + isTooBig);
    const scaledWeight: number = isTooBig
      ? (graphWidth * desiredPercentageOfTheGraphWidth) /
        totalLengthOfLabeledSquare
      : 1;
    console.log("deleteMe scaledWeight is: " + scaledWeight);
    // const scaledWeight: number = 1; // TODO deleteMe
    const rect: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect.setAttribute(
      "x",
      String(width - xOffset - totalLengthOfLabeledSquare * scaledWeight)
    );
    rect.setAttribute("width", String(yUnitScaledForLegend * scaledWeight));
    rect.setAttribute(
      "y",
      String(yPosition + (1 - scaledWeight) * yUnitScaledForLegend)
    );
    rect.setAttribute("height", String(yUnitScaledForLegend * scaledWeight));
    rect.setAttribute("stroke-width", String(1));
    rect.setAttribute("stroke", "black");
    rect.setAttribute("fill", fillColor);
    svgMap.nativeElement.appendChild(rect);

    const text: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    text.setAttribute(
      "x",
      String(
        width -
          xOffset -
          legendFontSize * maxLetterLength * fontToPixelRatio * scaledWeight
      ) //deleteMe + xPadding
    );
    text.setAttribute("y", textYPosition);
    text.setAttribute("fill", textColor);
    text.setAttribute("font-size", String(legendFontSize * scaledWeight));
    text.setAttribute("text-anchor", "start");
    text.textContent = textContent;
    svgMap.nativeElement.appendChild(text);
  }
}
