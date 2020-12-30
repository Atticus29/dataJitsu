import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appWinDraw]'
})
export class WinDrawDirective {
  @Input('appWinDraw') isWinOrDraw: boolean;

  constructor(private el: ElementRef) { }

  ngOnInit(){
    if (this.isWinOrDraw) {
      this.el.nativeElement.style.backgroundColor = "#4A7CCE";
      //TODO fleshout styling change
    }
  }

}
