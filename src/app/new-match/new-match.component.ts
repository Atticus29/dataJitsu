import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
// import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';
// declare var jQuery:JQueryStatic;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css']
})
export class NewMatchComponent implements OnInit {
  modalActions1 = new EventEmitter<string|MaterializeAction>();
  modalActions2 = new EventEmitter<string|MaterializeAction>();

  params = []

  model1Params = [
    {
      dismissible: false,
      complete: () => {
        console.log('Closed');
        this.openModal2();
      }
    }
  ]

  constructor() {}

  ngOnInit() {
  }

  openModal1() {
    this.modalActions1.emit({action:"modal",params:['open']});
  }
  closeModal1() {
    this.modalActions1.emit({action:"modal",params:['close']});
  }
  openModal2() {
    this.modalActions2.emit({action:"modal",params:['open']});
  }
  closeModal2() {
    this.modalActions2.emit({action:"modal",params:['close']});
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
