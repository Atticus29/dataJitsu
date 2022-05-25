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
    //TODO deleteMe un-any this
    // const width: number = svgMap.nativeElement.getBBox().x;
    const width: number = svgMap.nativeElement.viewBox.baseVal.width;
    const height: number = svgMap.nativeElement.viewBox.baseVal.height;
    const xOffset: number = width * 0.1;
    const yOffset: number = height * 0.1;
    console.log("deleteMe this.width is: ");
    console.log(width);
    console.log("deleteMe this.height is: ");
    console.log(height);
    this.drawAxes(svgMap, width, height, xOffset, yOffset);
    this.drawStackedBarChart(svgMap, width, height, xOffset, yOffset, data);
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
    data: EventInVideo[]
  ) {
    const formattedHistogram =
      this.dataFormattingService.tranformDataToHistogram(data, {
        appendSuccesses: true,
      });
    const maxVal: number = reduce(
      formattedHistogram,
      (memo, entry) => {
        return get(entry, "attempts") > memo ? get(entry, "attempts") : memo;
      },
      0
    );
    const numEvents = formattedHistogram ? formattedHistogram.length : 0;
    const rectWidthPlusPadding: number = (width - 2 * xOffset) / numEvents;
    console.log("deleteMe rectWidthPlusPadding is: ");
    console.log(rectWidthPlusPadding);
    const xPadding: number = rectWidthPlusPadding * 0.33;
    // const xPadding: number = 0.007 * width; //TODO make it so that this and the rectWidth can be dynamicall figured out together
    // const rectWidth: number =
    //   (width - 2 * xOffset - (numEvents - 1) * xPadding) / numEvents;
    const rectWidth: number = rectWidthPlusPadding * 0.67;
    const sortedHistogram = orderBy(formattedHistogram, ["attempts"], ["desc"]);
    const yUnit: number = (height - 2 * yOffset) / maxVal;
    sortedHistogram.forEach((entry, idx) => {
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
        svgMap
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
    successRect.setAttribute("stroke", "grey");
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
    svgMap: ElementRef<SVGSVGElement>
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
    // text.setAttribute("rotate", "-90");
    console.log("deleteMe yUnit is: " + yUnit);
    text.setAttribute("font-size", String(0.25 * yUnit));
    text.setAttribute("text-anchor", "start");
    // const xPosition = xOffset + (idx + 1) * xPadding + idx * rectWidth;
    // const yPosition = height - yOffset;
    // text.setAttribute(
    //   "rotate",
    //   "90," + String(xPosition) + "," + String(yPosition)
    // );
    text.setAttribute(
      "transform",
      "rotate(90," + String(xPosition) + "," + String(yPosition) + ")"
    );
    // text.setAttribute("transform", "rotate(90)");
    // text.setAttribute("rotate", "45");
    // text.setAttribute(
    //   "transform",
    //   "translate(" + xPosition + "," + yPosition + ") rotate(90)"
    // );
    text.textContent = name;
    svgMap.nativeElement.appendChild(text);
  }
}
