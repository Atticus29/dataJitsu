import { Directive, Input, ElementRef, Renderer2, OnInit } from "@angular/core";

@Directive({
  selector: "[appFlaggedAnnotation]",
})
export class FlaggedAnnotationDirective implements OnInit {
  @Input("appFlaggedAnnotation") isFlagged: boolean;

  constructor(public el: ElementRef, public renderer: Renderer2) {}
  ngOnInit() {
    if (this.isFlagged) {
      // this.el.nativeElement.style.borderColor = "green";
      // this.el.nativeElement.style.backgroundColor = "blue";
      // this.renderer.setStyle(this.el.nativeElement, 'background-color', '#D58A06');
      this.renderer.setStyle(this.el.nativeElement, "border-style", "solid");
      this.renderer.setStyle(this.el.nativeElement, "border-color", "#D58A06");
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }
}
