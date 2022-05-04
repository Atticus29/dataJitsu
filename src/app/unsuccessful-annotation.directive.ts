import { Directive, ElementRef, Renderer2, OnInit, Input } from "@angular/core";

@Directive({
  selector: "[appUnsuccessfulAnnotation]",
})
export class UnsuccessfulAnnotationDirective implements OnInit {
  @Input("appUnsuccessfulAnnotation") isUnsuccessful: boolean;
  constructor(public el: ElementRef, public renderer: Renderer2) {
    // el.nativeElement.style.backgroundColor = "red";
  }

  ngOnInit() {
    if (this.isUnsuccessful) {
      this.el.nativeElement.style.backgroundColor = "#D27E91";
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }
}
