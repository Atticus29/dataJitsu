import { Directive, ElementRef, Renderer, OnInit, Input } from '@angular/core';

import { constants } from './constants';

@Directive({
  selector: '[appAnnotationScoredPoints]'
})
export class AnnotationScoredPointsDirective {
  @Input('appAnnotationScoredPoints') scoredPoints: boolean;
  constructor(private el: ElementRef) { }

  ngOnInit(){
    if (this.scoredPoints) {
      this.el.nativeElement.style.backgroundColor = constants.lightBlueHex;
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }

}
