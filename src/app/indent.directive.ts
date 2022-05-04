import { Directive, ElementRef, OnInit, Input } from "@angular/core";

@Directive({
  selector: "[appIndent]",
})
export class IndentDirective implements OnInit {
  @Input("appIndent") indentThis: boolean;

  constructor(public el: ElementRef) {}
  ngOnInit() {
    if (this.indentThis) {
      this.el.nativeElement.style.marginLeft = "2em"; //0.2em
      //TODO fleshout styling change
    }
  }
}
