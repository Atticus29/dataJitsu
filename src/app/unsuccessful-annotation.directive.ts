import { Directive, ElementRef, Renderer, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appUnsuccessfulAnnotation]'
})
export class UnsuccessfulAnnotationDirective {
  @Input('appUnsuccessfulAnnotation') isUnsuccessful: boolean;
  constructor(private el: ElementRef, private renderer: Renderer) {
         // el.nativeElement.style.backgroundColor = "red";
  }

  ngOnInit(){
    if (this.isUnsuccessful) {
      this.el.nativeElement.style.backgroundColor = "#D27E91";
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }

}
