import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
// import { ViewChild, ElementRef, AfterViewInit} from '@angular/core';
declare var $:any;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css']
})
export class NewMatchComponent implements OnInit {

constructor() {
  $(document).ready(function() {
    // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
    /*$('.view').click(function (){
    $('#modal1').modal('open');
    alert('edskjcxnm');
  });*/
  /*$('.view').leanModal();*/
  $('#modal1').modal();
});
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
