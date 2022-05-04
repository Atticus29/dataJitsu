import { Directive, ElementRef, Input, OnInit } from "@angular/core";

@Directive({
  selector: "[appSubmissionAnnotation]",
})
export class SubmissionAnnotationDirective implements OnInit {
  @Input("appSubmissionAnnotation") isSubmission: boolean;
  constructor(public el: ElementRef) {}

  ngOnInit() {
    if (this.isSubmission) {
      this.el.nativeElement.style.backgroundColor = "gold";
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }
}
