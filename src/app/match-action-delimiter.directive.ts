import { Directive, Input, ElementRef, Renderer2, OnInit } from "@angular/core";

@Directive({
  selector: "[appMatchActionDelimiter]",
})
export class MatchActionDelimiterDirective implements OnInit {
  @Input("appMatchActionDelimiter") isMatchActionDelimiter: boolean;
  constructor(public el: ElementRef, public renderer: Renderer2) {}

  ngOnInit() {
    if (this.isMatchActionDelimiter) {
      // this.el.nativeElement.style.borderColor = "green";
      // this.el.nativeElement.style.backgroundColor = "blue";
      this.renderer.setStyle(
        this.el.nativeElement,
        "background-color",
        "#eb7434"
      );
      // this.renderer.setStyle(this.el.nativeElement, 'border-style', 'solid');
      // this.renderer.setStyle(this.el.nativeElement, 'border-color', '#eb9234');
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }
}
