import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({
  selector: "[appWinDraw]",
})
export class WinDrawDirective implements OnInit {
  @Input("appWinDraw") isWinOrDraw: boolean;

  constructor(public el: ElementRef) {}

  ngOnInit() {
    if (this.isWinOrDraw) {
      this.el.nativeElement.style.backgroundColor = "#4A7CCE";
      //TODO fleshout styling change
    }
  }
}
