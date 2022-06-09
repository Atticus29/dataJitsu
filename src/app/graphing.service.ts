import { reduce, get, orderBy, map } from "lodash";

import { ElementRef, Injectable } from "@angular/core";
import { DataFormattingService } from "./data-formatting.service";
import { EventInVideo } from "./eventInVideo.model";

export interface Options {
  xOffsetLeftWidthFraction?: number;
  minWidthOfBarPlusPadding?: number;
  yOffsetTopAsFractionOfYoffsetBottom?: number;
  xRightAsFractionOfXLeft?: number;
  fractionOfxPaddingInRectWidthPlusPadding?: number;
  attemptFillColor?: string;
  successFillColor?: string;
  textColor?: string;
  yLabIncrement?: number;
  yAxisLabel?: string;
  legendLabels?: {}[];
  horizontalDesired?: boolean;
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
    const horizontalDesired = get(options, "horizontalDesired", false);
    console.log("deleteMe horizontalDesired is: " + horizontalDesired);
    if (horizontalDesired) {
      this.drawHorizontalGraph(svgMap, data, options);
    } else {
      this.drawVerticalGraph(svgMap, data, options);
    }
  }
  drawVerticalGraph(
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
    const xOffsetLeft: number =
      width * get(options, "xOffsetLeftWidthFraction", 0.1);
    const xOffsetRight: number =
      xOffsetLeft * get(options, "xRightAsFractionOfXLeft", 0.33);
    const graphWidth = width - xOffsetLeft - xOffsetRight;
    const formattedHistogram =
      this.dataFormattingService.tranformDataToHistogram(data, {
        appendSuccesses: true,
      });
    const numEvents = formattedHistogram ? formattedHistogram.length : 0;
    let rectWidthPlusPadding: number = graphWidth / numEvents;
    console.log("deleteMe rectWidthPlusPadding is: " + rectWidthPlusPadding);
    const tooManyValues: boolean =
      rectWidthPlusPadding < get(options, "minWidthOfBarPlusPadding", 13);
    const sortedHistogram = orderBy(formattedHistogram, ["attempts"], ["desc"]);
    let truncatedLength: number;
    if (tooManyValues) {
      rectWidthPlusPadding = get(options, "minWidthOfBarPlusPadding", 13);
      truncatedLength = Math.floor(
        graphWidth / get(options, "minWidthOfBarPlusPadding", 13)
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
    const graphHeight = height - yOffsetBottom - yOffsetTop;
    this.drawAxes(
      svgMap,
      width,
      height,
      xOffsetLeft,
      yOffsetBottom,
      yOffsetTop
    );
    this.drawVerticalStackedBarChart(
      legendLabels,
      fontToPixelRatio,
      svgMap,
      height,
      graphHeight,
      width,
      graphWidth,
      xOffsetLeft,
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

  drawHorizontalGraph(
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
    const width: number = svgMap.nativeElement.viewBox.baseVal.width;
    const xOffsetLeft: number =
      width * get(options, "xOffsetLeftWidthFraction", 0.1);
    const xOffsetRight: number =
      xOffsetLeft * get(options, "xRightAsFractionOfXLeft", 0.33);
    const graphWidth = width - xOffsetLeft - xOffsetRight;
    const fontToPixelRatio: number = 12 / 16;
    const formattedHistogram =
      this.dataFormattingService.tranformDataToHistogram(data, {
        appendSuccesses: true,
      });
    const numEvents = formattedHistogram ? formattedHistogram.length : 0;
    const fractionOfxPaddingInRectWidthPlusPadding = get(
      options,
      "fractionOfxPaddingInRectWidthPlusPadding",
      0.33
    );
    let fontSize = 32; //breaks a circularity
    const height: number = svgMap.nativeElement.viewBox.baseVal.height;
    const yOffsetBottom: number = Math.min(
      fontSize * fontToPixelRatio * 3,
      height * 0.25
    );
    const yOffsetTop: number =
      yOffsetBottom * get(options, "yOffsetTopAsFractionOfYoffsetBottom", 0.33);
    const graphHeight = height - yOffsetBottom - yOffsetTop;
    let rectWidthPlusPadding: number = graphHeight / numEvents;
    const rectWidth: number =
      rectWidthPlusPadding * (1 - fractionOfxPaddingInRectWidthPlusPadding);
    fontSize = Math.min(rectWidth * fontToPixelRatio, 32);
    const xPadding: number =
      rectWidthPlusPadding * fractionOfxPaddingInRectWidthPlusPadding;
    const tooManyValues: boolean =
      rectWidthPlusPadding < get(options, "minWidthOfBarPlusPadding", 13);
    const sortedHistogram = orderBy(formattedHistogram, ["attempts"], ["desc"]);
    let truncatedLength: number;
    if (tooManyValues) {
      rectWidthPlusPadding = get(options, "minWidthOfBarPlusPadding", 13);
      const horizontalTruncatedLength = Math.floor(
        (height - yOffsetBottom - yOffsetTop) /
          get(options, "minWidthOfBarPlusPadding", 13)
      );
      truncatedLength = horizontalTruncatedLength;
    }
    const finalHistogram = tooManyValues
      ? sortedHistogram.slice(0, truncatedLength)
      : sortedHistogram;

    this.drawAxes(
      svgMap,
      width,
      height,
      xOffsetLeft,
      yOffsetBottom,
      yOffsetTop
    );
    this.drawHorizontalStackedBarChart(
      legendLabels,
      fontToPixelRatio,
      svgMap,
      height,
      graphHeight,
      width,
      graphWidth,
      xOffsetLeft,
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
    xOffsetLeft: number,
    yOffsetBottom: number,
    yOffsetTop: number
  ) {
    const yAxis: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    yAxis.setAttribute("x1", String(xOffsetLeft));
    yAxis.setAttribute("y1", String(yOffsetTop));
    yAxis.setAttribute("x2", String(xOffsetLeft));
    yAxis.setAttribute("y2", String(height - yOffsetBottom));
    yAxis.setAttribute("stroke", "black");
    svgMap.nativeElement.appendChild(yAxis);
    const xAxis: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    xAxis.setAttribute("x1", String(xOffsetLeft));
    xAxis.setAttribute("y1", String(height - yOffsetBottom));
    xAxis.setAttribute("x2", String(width - xOffsetLeft));
    xAxis.setAttribute("y2", String(height - yOffsetBottom));
    xAxis.setAttribute("stroke", "black");
    svgMap.nativeElement.appendChild(xAxis);
  }

  drawHorizontalStackedBarChart(
    legendLabels: {}[],
    fontToPixelRatio: number,
    svgMap: ElementRef<SVGSVGElement>,
    height: number,
    graphHeight: number,
    width: number,
    graphWidth: number,
    xOffsetLeft: number,
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
    const maxValInChart: number = reduce(
      finalHistogram,
      (memo, entry) => {
        return get(entry, "attempts") > memo ? get(entry, "attempts") : memo;
      },
      0
    );
    const yUnit: number = graphHeight / maxValInChart;
    const desiredPercentageOfTheGraphHeight: number = 1;
    const totalLengthOfLabel = yAxisLabel.length * fontSize * fontToPixelRatio;
    const isTooBig: boolean =
      graphHeight * desiredPercentageOfTheGraphHeight < totalLengthOfLabel;
    const scaledHeight: number = isTooBig
      ? (graphHeight * desiredPercentageOfTheGraphHeight) / totalLengthOfLabel
      : 1;
    finalHistogram.forEach((entry, idx) => {
      this.drawHorizontalAttemptRect(
        xOffsetLeft,
        idx,
        xPadding,
        rectWidth,
        yOffsetTop,
        entry,
        yUnit,
        svgMap,
        attemptFillColor
      );
      this.drawHorizontalSuccessRect(
        xOffsetLeft,
        idx,
        xPadding,
        rectWidth,
        yOffsetTop,
        entry,
        yUnit,
        svgMap,
        successFillColor
      );
      // this.drawXLabelForVerticalChart(
      //   xOffsetLeft,
      //   idx,
      //   xPadding,
      //   rectWidth,
      //   height,
      //   yOffsetBottom,
      //   entry,
      //   svgMap,
      //   fontSize,
      //   textColor,
      //   scaledHeight,
      //   fontToPixelRatio
      // );
    });
    const isHorizontal: Boolean = true;
    this.drawChartScale(
      fontToPixelRatio,
      maxValInChart,
      xOffsetLeft,
      xPadding,
      height,
      yOffsetBottom,
      yUnit,
      svgMap,
      fontSize,
      yLabIncrement,
      textColor,
      scaledHeight,
      isHorizontal
    );
    this.drawYAxisLabel(
      fontToPixelRatio,
      maxValInChart,
      xOffsetLeft,
      xPadding,
      height,
      yOffsetBottom,
      yUnit,
      svgMap,
      fontSize,
      textColor,
      yAxisLabel,
      scaledHeight
    );
    this.drawLegend(
      svgMap,
      fontToPixelRatio,
      xOffsetLeft,
      width,
      graphWidth,
      yOffsetBottom,
      yOffsetTop,
      fontSize,
      legendLabels,
      textColor,
      yUnit,
      xPadding
    );
  }

  drawVerticalStackedBarChart(
    legendLabels: {}[],
    fontToPixelRatio: number,
    svgMap: ElementRef<SVGSVGElement>,
    height: number,
    graphHeight: number,
    width: number,
    graphWidth: number,
    xOffsetLeft: number,
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
    const maxValInChart: number = reduce(
      finalHistogram,
      (memo, entry) => {
        return get(entry, "attempts") > memo ? get(entry, "attempts") : memo;
      },
      0
    );
    const yUnit: number = graphHeight / maxValInChart;
    const desiredPercentageOfTheGraphHeight: number = 1;
    const totalLengthOfLabel = yAxisLabel.length * fontSize * fontToPixelRatio;
    const isTooBig: boolean =
      graphHeight * desiredPercentageOfTheGraphHeight < totalLengthOfLabel;
    const scaledHeight: number = isTooBig
      ? (graphHeight * desiredPercentageOfTheGraphHeight) / totalLengthOfLabel
      : 1;
    finalHistogram.forEach((entry, idx) => {
      this.drawVerticalAttemptRect(
        xOffsetLeft,
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
      this.drawVerticalSuccessRect(
        xOffsetLeft,
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
      this.drawXLabelForVerticalChart(
        xOffsetLeft,
        idx,
        xPadding,
        rectWidth,
        height,
        yOffsetBottom,
        entry,
        svgMap,
        fontSize,
        textColor,
        scaledHeight,
        fontToPixelRatio
      );
    });

    this.drawChartScale(
      fontToPixelRatio,
      maxValInChart,
      xOffsetLeft,
      xPadding,
      height,
      yOffsetBottom,
      yUnit,
      svgMap,
      fontSize,
      yLabIncrement,
      textColor,
      scaledHeight
    );
    this.drawYAxisLabel(
      fontToPixelRatio,
      maxValInChart,
      xOffsetLeft,
      xPadding,
      height,
      yOffsetBottom,
      yUnit,
      svgMap,
      fontSize,
      textColor,
      yAxisLabel,
      scaledHeight
    );
    this.drawLegend(
      svgMap,
      fontToPixelRatio,
      xOffsetLeft,
      width,
      graphWidth,
      yOffsetBottom,
      yOffsetTop,
      fontSize,
      legendLabels,
      textColor,
      yUnit,
      xPadding
    );
  }

  drawVerticalAttemptRect(
    xOffsetLeft: number,
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
    this.drawVerticalRectCore(
      "attempts",
      xOffsetLeft,
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

  drawHorizontalAttemptRect(
    xOffsetLeft: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    yOffsetTop: number,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    attemptFillColor: string
  ) {
    this.drawHorizontalRectCore(
      "attempts",
      xOffsetLeft,
      idx,
      xPadding,
      rectWidth,
      yOffsetTop,
      entry,
      yUnit,
      svgMap,
      attemptFillColor
    );
  }

  drawHorizontalSuccessRect(
    xOffsetLeft: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    yOffsetTop: number,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    successFillColor: string
  ) {
    this.drawHorizontalRectCore(
      "successes",
      xOffsetLeft,
      idx,
      xPadding,
      rectWidth,
      yOffsetTop,
      entry,
      yUnit,
      svgMap,
      successFillColor
    );
  }

  drawVerticalSuccessRect(
    xOffsetLeft: number,
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
    this.drawVerticalRectCore(
      "successes",
      xOffsetLeft,
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

  drawHorizontalRectCore(
    entryAccessor: string,
    xOffsetLeft: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    yOffsetTop: number,
    entry: {},
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    fillColor: string
  ) {
    const rect: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );

    rect.setAttribute("x", String(xOffsetLeft));
    rect.setAttribute("width", String(get(entry, entryAccessor) * yUnit));
    rect.setAttribute(
      "y",
      String(yOffsetTop + (idx + 1) * xPadding + idx * rectWidth)
    );
    rect.setAttribute("height", String(rectWidth));
    rect.setAttribute("stroke-width", String(1));
    rect.setAttribute("stroke", "black");
    rect.setAttribute("fill", fillColor);
    svgMap.nativeElement.appendChild(rect);
  }

  drawVerticalRectCore(
    entryAccessor: string,
    xOffsetLeft: number,
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
    const rect: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect"
    );
    rect.setAttribute(
      "x",
      String(xOffsetLeft + (idx + 1) * xPadding + idx * rectWidth)
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

  drawXLabelForVerticalChart(
    xOffsetLeft: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    entry: {},
    svgMap: ElementRef<SVGSVGElement>,
    fontSize: number,
    textColor: string,
    scaledHeight: number,
    fontToPixelRatio: number
  ) {
    const name = get(entry, "name");
    const text: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const xPosition = xOffsetLeft + (idx + 1) * xPadding + idx * rectWidth;
    text.setAttribute("x", String(xPosition));
    console.log("deleteMe yOffsetBottom is: " + yOffsetBottom);
    console.log("deleteMe xPadding is: " + xPadding);
    const yPosition =
      height - yOffsetBottom + Math.min(xPadding, yOffsetBottom * 0.25);
    text.setAttribute("y", String(yPosition));
    text.setAttribute("fill", textColor);
    text.setAttribute(
      "font-size",
      String((fontSize * scaledHeight) / fontToPixelRatio)
    );
    text.setAttribute("text-anchor", "start");
    text.setAttribute(
      "transform",
      "rotate(45," + String(xPosition) + "," + String(yPosition) + ")"
    );
    text.textContent = name;
    svgMap.nativeElement.appendChild(text);
  }

  drawXLabelForHorizontalChart(
    maxValInChart: number,
    xOffsetLeft: number,
    yUnit: number,
    numDelimiters: number,
    idx: number,
    xPadding: number,
    rectWidth: number,
    height: number,
    yOffsetBottom: number,
    entry: {},
    svgMap: ElementRef<SVGSVGElement>,
    fontSize: number,
    textColor: string,
    scaledHeight: number,
    fontToPixelRatio: number
  ) {
    const isHorizontal: boolean = true;
    this.drawChartScale(
      fontToPixelRatio,
      maxValInChart,
      xOffsetLeft,
      xPadding,
      height,
      yOffsetBottom,
      yUnit,
      svgMap,
      fontSize,
      numDelimiters,
      textColor,
      scaledHeight,
      isHorizontal
    );
    // const name = get(entry, "name");
    // const text: SVGElement = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "text"
    // );
    // const xPosition = xOffsetLeft + (idx + 1) * xPadding + idx * rectWidth;
    // text.setAttribute("x", String(xPosition));
    // console.log("deleteMe yOffsetBottom is: " + yOffsetBottom);
    // console.log("deleteMe xPadding is: " + xPadding);
    // const yPosition =
    //   height - yOffsetBottom + Math.min(xPadding, yOffsetBottom * 0.25);
    // text.setAttribute("y", String(yPosition));
    // text.setAttribute("fill", textColor);
    // text.setAttribute(
    //   "font-size",
    //   String((fontSize * scaledHeight) / fontToPixelRatio)
    // );
    // text.setAttribute("text-anchor", "start");
    // text.setAttribute(
    //   "transform",
    //   "rotate(45," + String(xPosition) + "," + String(yPosition) + ")"
    // );
    // text.textContent = name;
    // svgMap.nativeElement.appendChild(text);
  }

  drawChartScale(
    fontToPixelRatio: number,
    maxValInChart: number,
    xOffsetLeft: number,
    xPadding: number,
    height: number,
    yOffsetBottom: number,
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    fontSize: number,
    numDelimiters: number = maxValInChart,
    textColor: string,
    scaledHeight: number,
    isHorizontal?: Boolean
  ) {
    const incrementBy = Math.floor(maxValInChart / numDelimiters);
    const pxlCountOfScaleNumbers =
      String(maxValInChart).length * (fontSize * fontToPixelRatio);
    for (let i = 0; i < maxValInChart + 1; i += incrementBy) {
      const text: SVGElement = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      // const xPosition =
      //   xOffsetLeft - pxlCountOfScaleNumbers - xPadding > 0
      //     ? xOffsetLeft - pxlCountOfScaleNumbers - xPadding
      //     : xOffsetLeft - pxlCountOfScaleNumbers;
      const xPosition = isHorizontal
        ? xOffsetLeft + i * yUnit
        : xOffsetLeft - pxlCountOfScaleNumbers;
      text.setAttribute("x", String(xPosition));
      const yPosition = isHorizontal
        ? height - yOffsetBottom + pxlCountOfScaleNumbers
        : height - yOffsetBottom - i * yUnit;
      text.setAttribute("y", String(yPosition));
      text.setAttribute("fill", textColor);
      text.setAttribute(
        "font-size",
        String((fontSize * scaledHeight) / fontToPixelRatio)
      );
      text.setAttribute("text-anchor", "start");
      text.textContent = String(Math.floor(i));
      svgMap.nativeElement.appendChild(text);
    }
  }

  drawYAxisLabel(
    fontToPixelRatio: number,
    maxValInChart: number,
    xOffsetLeft: number,
    xPadding: number,
    height: number,
    // yOffsetTop: number,
    yOffsetBottom: number,
    yUnit: number,
    svgMap: ElementRef<SVGSVGElement>,
    fontSize: number,
    textColor: string,
    yAxisLabel: string,
    scaledHeight: number
  ) {
    const pxlCountOfScaleNumbers =
      (String(maxValInChart).length + 3) * (fontSize * fontToPixelRatio);
    const text: SVGElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    const xPosition = Math.max(
      xOffsetLeft - pxlCountOfScaleNumbers - xPadding,
      5
    );
    text.setAttribute("x", String(xPosition));
    const yPosition = height - yOffsetBottom - (maxValInChart / 2) * yUnit;
    // const graphHeight: number = height - yOffsetBottom - yOffsetTop;
    // const desiredPercentageOfTheGraphHeight: number = 1;
    // const totalLengthOfLabel = yAxisLabel.length * fontSize * fontToPixelRatio;
    // const isTooBig: boolean =
    //   graphHeight * desiredPercentageOfTheGraphHeight < totalLengthOfLabel;
    // const scaledHeight: number = isTooBig
    //   ? (graphHeight * desiredPercentageOfTheGraphHeight) / totalLengthOfLabel
    //   : 1;
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
    xOffsetLeft: number,
    width: number,
    graphWidth: number,
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
        xOffsetLeft,
        yPosition,
        width,
        graphWidth,
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
    xOffsetLeft: number,
    yPosition: number,
    width: number,
    graphWidth: number,
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
      String(width - xOffsetLeft - totalLengthOfLabeledSquare * scaledWeight)
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
          xOffsetLeft -
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
