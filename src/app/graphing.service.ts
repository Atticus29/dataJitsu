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
  }
}
