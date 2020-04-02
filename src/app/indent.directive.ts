import { Directive, ElementRef, Renderer, OnInit, Input } from '@angular/core';

@Directive({
  selector: '[appIndent]'
})
export class IndentDirective {
  @Input('appIndent') indentThis: boolean;

  constructor(private el: ElementRef) { }
  ngOnInit(){
    if (this.indentThis) {
      this.el.nativeElement.style.marginLeft = "2em"; //0.2em
      //TODO fleshout styling change
    }
  }

}
