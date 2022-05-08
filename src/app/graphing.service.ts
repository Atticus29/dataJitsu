import { ElementRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GraphingService {
  constructor() {}

  drawArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    elementRef: ElementRef,
    color: string,
    fillStatus: boolean
  ) {
    const canvas = <HTMLCanvasElement>elementRef.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.arc(x, y, radius, startAngle, endAngle);
      if (fillStatus) {
        ctx.fillStyle = color;
        ctx.fill();
      } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = color;
        ctx.stroke();
      }
    }
  }

  drawTriangle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    elementRef: ElementRef,
    color: string,
    fillStatus: boolean
  ) {
    const canvasElement = <HTMLCanvasElement>elementRef.nativeElement;
    if (canvasElement) {
      const context = canvasElement.getContext("2d");
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.lineTo(x3, y3);
      context.closePath();
      context.lineWidth = 1;
      context.strokeStyle = color;
      context.stroke();
      if (fillStatus) {
        context.fillStyle = color;
        context.fill();
      }
    }
  }

  drawEllipse(
    x: number,
    y: number,
    radiusX: number,
    radiusY: number,
    rotation: number,
    startAngle: number,
    endAngle: number,
    elementRef: ElementRef,
    color: string,
    fillStatus: boolean
  ) {
    const canvas = <HTMLCanvasElement>elementRef.nativeElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.ellipse(
        x,
        y,
        radiusX,
        radiusY,
        rotation,
        startAngle,
        endAngle,
        false
      );
      ctx.stroke();
      if (fillStatus) {
        ctx.fillStyle = color;
        ctx.fill();
      }
      ctx.closePath();
    }
  }

  drawLine(
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    width: number,
    color: string
  ) {
    //TODO
  }
}
