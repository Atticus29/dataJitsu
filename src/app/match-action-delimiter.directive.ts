import { Directive,Input, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[appMatchActionDelimiter]'
})
export class MatchActionDelimiterDirective {
  @Input('appMatchActionDelimiter') isMatchActionDelimiter: boolean;
  constructor(private el: ElementRef, private renderer: Renderer) { }

  ngOnInit(){
    if (this.isMatchActionDelimiter) {
      // this.el.nativeElement.style.borderColor = "green";
      // this.el.nativeElement.style.backgroundColor = "blue";
      this.renderer.setElementStyle(this.el.nativeElement, 'background-color', '#eb7434');
      // this.renderer.setElementStyle(this.el.nativeElement, 'border-style', 'solid');
      // this.renderer.setElementStyle(this.el.nativeElement, 'border-color', '#eb9234');
      // this.renderer.setElementClass(this.el.nativeElement, 'no-longer-eligible',true);
      //TODO fleshout styling change
    }
  }
}
