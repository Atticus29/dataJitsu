import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';
import { DatabaseService } from '../database.service';
import { User } from '../user.model';
declare var $:any;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css'],
  providers: [DatabaseService]
})

export class NewMatchComponent implements OnInit {
  title: string = "Submit a New Match for Annotation";
  ages: Array<string>;
  giRanks: Array<string>;
  nogiRanks: Array<string>;
  genders: Array<string>;
  weightClasses: Array<string>;
  // matchUrlBound: string;
  newMatchForm: FormGroup;
  currentUserId: any;
  currentUser: User;

  constructor(private fb: FormBuilder, private db: DatabaseService) { //TODO add userService
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
      matchUrlBound: ['', Validators.required],
      athlete1NameBound: ['', Validators.required],
      athlete2NameBound: ['', Validators.required],
      tournamentNameBound: ['', Validators.required],
      locationBound: ['', Validators.required],
      tournamentDateBound: ['', Validators.required],
      giStatusBound: [true],
      genderBound: ['', Validators.required],
      ageClassBound: ['', Validators.required],
      rankBound: ['', Validators.required],
      weightBound: ['', Validators.required],
    });

    this.currentUser = this.userService.getUser(this.currentUserId); //TODO mature this
  }

  getValues(){
    let result = this.newMatchForm.value;
    return result;
  }

  allValid(matchForm: FormGroup){
    let values = matchForm.value;
    console.log(values);
    console.log(values.giStatusBound == true || values.giStatusBound == false);
    if(this.urlValid(values.matchUrlBound) && values.athlete1NameBound !== "" && values.athlete2NameBound !== "" && values.tournamentNameBound !== "" && values.locationBound !== "" && values.tournamentDateBound !== "" && values.genderBound !== "" && values.ageClassBound !== "" && values.rankBound !== "" && values.weightBound !== "" && (values.giStatusBound == true || values.giStatusBound == false) && values.weightBound !== "" ){
      return true;
    } else{
      return false;
    }
  }

  urlValid(url: string){
    return true; //TODO fix
  }

  createMatchObj(result: any){
    let {matchUrlBound, athlete1NameBound, athlete2NameBound, tournamentNameBound, locationBound, tournamentDateBound, giStatusBound, genderBound, ageClassBound, rankBound, weightBound} = result;
    let matchDeets = new MatchDetails("testId", tournamentNameBound, locationBound, new Date(tournamentDateBound), athlete1NameBound, athlete2NameBound, weightBound, rankBound, matchUrlBound, genderBound, giStatusBound === 'true', ageClassBound);
    let moves: Array<MoveInVideo> = new Array<MoveInVideo>();
    let match = new Match(matchDeets, this.currentUser, moves);
    return match;
  }

  submitFormAndAnnotate(){
    let values = this.getValues();
    let match = this.createMatchObj(values);
    this.db.addMatchToDb(match);
  }

  submitFormAndReturnToMain(){
    let values = this.getValues();
    let match = this.createMatchObj(values);
    this.db.addMatchToDb(match);
    //TODO return to main
  }

  pushToDb(match: Match){

  }

  annotateCurrentVideo(){
    console.log("Annotate"); //TODO flesh out
  }

  addToQueueAndReturnToMain(){
    console.log("Queue"); //TODO flesh out
  }

}
