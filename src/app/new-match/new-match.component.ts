import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';
declare var $:JQueryStatic;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css']
})
export class NewMatchComponent implements OnInit {
  @ViewChild('selectElem') el:ElementRef;

  constructor() {
     $('.modal').modal();
   }

  ngOnInit() {
  }

  submitForm(){
    console.log("Hi!");
    //push results to database(match) (as service??) //TODO
    //send a little dialog box
    //if they chose to annotate, go to annotation page
    //else
    //go back to main page
  }

}
