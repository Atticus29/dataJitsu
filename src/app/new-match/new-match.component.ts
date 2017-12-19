import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';
import { DatabaseService } from '../database.service';
import { User } from '../user.model';
import { AngularFireDatabase,FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { Subject } from 'rxjs/Subject';
declare var $:any;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.css'],
  providers: [DatabaseService]
})

export class NewMatchComponent implements OnInit {
  title: string = "Submit a New Match for Annotation";
  ageClasses: any[];
  giRanks: any[];
  nogiRanks: any[];
  genders: any[];
  weightClasses: any[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  newMatchForm: FormGroup;
  currentUserId: any;
  currentUser: User;

  constructor(private fb: FormBuilder, private db: DatabaseService) { //TODO add userService
  }

  ngOnInit() {
    $('.modal').modal();
    this.genders = ["Female", "Male"];

    this.db.getGiRanks().takeUntil(this.ngUnsubscribe).subscribe(giRanks=>{
      this.giRanks = giRanks;
    })


    this.db.getNoGiRanks().takeUntil(this.ngUnsubscribe).subscribe(noGiRanks=>{
      this.nogiRanks = noGiRanks;
    })

    this.db.getAgeClasses().takeUntil(this.ngUnsubscribe).subscribe(ageClasses=>{
      this.ageClasses = ageClasses;
    });

    this.db.getWeightClasses().takeUntil(this.ngUnsubscribe).subscribe(weightClasses=>{
      this.weightClasses = weightClasses;
      this.weightClasses.forEach(weightClass=>{
        console.log(weightClass.$value);
      })
    });

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



    // this.currentUser = this.userService.getUser(this.currentUserId); //TODO mature this
  }

  getValues(){
    let result = this.newMatchForm.value;
    return result;
  }

  allValid(matchForm: FormGroup){
    let values = matchForm.value;
    if(this.urlValid(values.matchUrlBound) && values.athlete1NameBound !== "" && values.athlete2NameBound !== "" && values.tournamentNameBound !== "" && values.locationBound !== "" && values.tournamentDateBound !== "" && values.genderBound !== "" && values.ageClassBound !== "" && values.rankBound !== "" && values.weightBound !== "" && (values.giStatusBound == true || values.giStatusBound == false) && values.weightBound !== "" ){
      return true;
    } else{
      return false;
    }
  }

  urlValid(url: string){
    return true; //TODO make sure youtube only for now
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
