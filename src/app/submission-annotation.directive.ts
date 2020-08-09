import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appSubmissionAnnotation]'
})
export class SubmissionAnnotationDirective {
  @Input('appSubmissionAnnotation') isSubmission: boolean;
  constructor(private el: ElementRef) { }

  ngOnInit(){
    if (this.isSubmission) {
      this.el.nativeElement.style.backgroundColor = "gold";
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }
}
