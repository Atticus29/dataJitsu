import { Directive, Input, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appAdvantage]'
})
export class AdvantageDirective {
  @Input('appAdvantage') isAdvantage: boolean;
  constructor(private el: ElementRef, private renderer: Renderer) {
         // el.nativeElement.style.backgroundColor = "red";
  }

  ngOnInit(){
    if (this.isAdvantage) {
      this.el.nativeElement.style.backgroundColor = "#BDCADA";
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }

}
