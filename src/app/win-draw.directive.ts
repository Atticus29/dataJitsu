import { Directive, ElementRef, Renderer2, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appWinDraw]'
})
export class WinDrawDirective {
  @Input('appWinDraw') isWinOrDraw: boolean;

  constructor(private el: ElementRef) { }

  ngOnInit(){
    if (this.isWinOrDraw) {
      this.el.nativeElement.style.backgroundColor = "blue";
      //TODO fleshout styling change
    }
  }

}
