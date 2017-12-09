import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
declare var $:any;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css']
})

export class NewMatchComponent implements OnInit {
  ages: Array<string>;
  giRanks: Array<string>;
  nogiRanks: Array<string>;
  genders: Array<string>;
  weightClasses: Array<string>;
  // matchUrlBound: string;
  newMatchForm: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    $('.modal').modal();
    this.genders = ["Female", "Male"];
    this.ages = ["Youth", "Juvenile1", "Juvenile2", "Adult", "Master 1", "Master 2", "Master 3", "Master 4", "Master 5", "Master 6"];
    this.giRanks = ["White belt", "Grey belt", "Yellow belt", "Orange belt", "Green belt", "Blue belt", "Purple belt", "Brown belt", "Black belt"];
    this.nogiRanks = ["Beginner", "Intermediate", "Advanced", "Elite"];
    // this.ranks.push("Elite");
    this.weightClasses = ["Rooster", "Bantam", "Light-feather", "Feather", "Light", "Middle", "Medium-heavy", "Heavy", "Super-heavy", "Ultra-heavy", "Absolute"];
    // console.log("matchURL is " + this.matchURL);
    this.newMatchForm = this.fb.group({
      matchUrlBound: ['', Validators.required]
    });
  }


  submitForm() {
    let test = this.newMatchForm.value;
    console.log(test);
  }

  annotateCurrentVideo(){
    console.log("Annotate"); //TODO flesh out
  }

  addToQueueAndReturnToMain(){
    console.log("Queue"); //TODO flesh out
  }

}
