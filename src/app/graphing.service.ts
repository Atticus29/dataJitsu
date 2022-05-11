import { ElementRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GraphingService {
  constructor() {}

  drawGraph(svgMap: ElementRef<SVGSVGElement>) {
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
  }
}
