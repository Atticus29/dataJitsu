import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';
import { DatabaseService } from '../database.service';
import { ValidationService } from '../validation.service';
import { User } from '../user.model';
import { AngularFireDatabase,AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Subject ,  Observable } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthorizationService } from '../authorization.service';
import {Location} from "@angular/common";
import { ProtectionGuard } from '../protection.guard';
declare var $:any;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.scss'],
  providers: [DatabaseService, AuthorizationService, ProtectionGuard]
})

export class NewMatchComponent implements OnInit {
    //@TODO add option to add new weight class, age class, etc. in the html here rather than on the db to keep in the bottom and isolate for special behavior
  private sub: any;
  private rankBound: string = ""; //has to be special because if left blank messes up because dynamically toggles between gi and nogi
  title: string = "Submit a New Match for Annotation";
  ageClasses: any[];
  ranks: any[];
  giRanks: any[];
  nogiRanks: any[];
  rankType: string = "Gi";
  genders: any[];
  weightClasses: any[];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  newMatchForm: FormGroup;
  currentUserId: any;
  currentUser: any = null;
  disabledGender: boolean = true;
  disabledAgeClass: boolean = false;
  disabledGiRank: boolean = false;
  disabledNoGiRank: boolean = false;
  disabledWeightClass: boolean = false;
  giStatus: boolean = false;
  checked: boolean = false;
  rankSelection: string;

  newRankForm: FormGroup; //TODO what is this?

  constructor(private fb: FormBuilder, private db: DatabaseService, private router: Router, private as: AuthorizationService, private location: Location, private vs: ValidationService) {
    // let temp = this.as.isAuthenticated();
    // temp.subscribe(result =>{
    //   console.log(result);
    // });
  }

  ngOnInit() {
    $('.modal').modal();

    this.genders = ["Female", "Male"];

    this.db.getGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(giRanks=>{
      this.giRanks = giRanks;
      this.ranks = giRanks;
      this.disabledGiRank = true;
    })

    this.db.getNoGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(noGiRanks=>{
      this.nogiRanks = noGiRanks;
      this.disabledNoGiRank = true;
    })

    this.db.getAgeClasses().pipe(takeUntil(this.ngUnsubscribe)).subscribe(ageClasses=>{
      this.ageClasses = ageClasses;
      this.disabledAgeClass = true;
    });

    this.db.getWeightClasses().pipe(takeUntil(this.ngUnsubscribe)).subscribe(weightClasses=>{
      this.weightClasses = weightClasses;
      this.disabledWeightClass = true;
    });

    this.newMatchForm = this.fb.group({
      matchUrlBound: ['', Validators.required],
      athlete1NameBound: [''],
      athlete2NameBound: [''],
      tournamentNameBound: [''],
      locationBound: [''],
      tournamentDateBound: [''],
      genderBound: [''],
      ageClassBound: [''],
      rankBound: [''],
      weightBound: [''],
      giStatusBound: ['']
    });

    this.newRankForm = this.fb.group({
      newRankBound: ['', Validators.required]
    });
    // this.currentUser = this.userService.getUser(this.currentUserId); //@TODO mature this
  }

  getNewRankValues(){
      let result = this.newRankForm.value;
      return result;
  }

  getValues(){
    let result = this.newMatchForm.value;
    return result;
  }

  allValid(matchForm: FormGroup){
    let values = matchForm.value;
    if(this.vs.validateUrl(values.matchUrlBound)){ //&& values.athlete1NameBound !== "" && values.athlete2NameBound !== "" && this.vs.validateDate(values.tournamentDateBound) && values.locationBound !== "" && values.tournamentNameBound !== "" && values.genderBound !== "" && values.ageClassBound !== "" && values.rankBound !== "" && values.weightBound !== ""  && values.weightBound !== ""
      return true;
    } else{
      return false;
    }
  }

  createMatchObj(result: any){
    console.log("result in createMatchObj:");
    console.log(result);
    let {matchUrlBound, athlete1NameBound, athlete2NameBound, tournamentNameBound, locationBound, tournamentDateBound, rankBound, genderBound, ageClassBound, weightBound} = result;
    this.rankBound = rankBound==undefined ? "" : rankBound;
    // athlete1NameBound = athlete1NameBound==undefined ? "" : athlete1NameBound;
    // console.log(athlete1NameBound);
    let matchDeets = new MatchDetails(tournamentNameBound, locationBound, tournamentDateBound.toString(), athlete1NameBound, athlete2NameBound, weightBound, this.rankBound, matchUrlBound, genderBound, this.giStatus, ageClassBound);
    let moves: Array<MoveInVideo> = new Array<MoveInVideo>();
    return this.as.getCurrentUser().pipe(switchMap(userInfo => {
        // TODO fix this/make sure it's working
        return Observable.create(obs=>{
        // this.db.getNodeIdFromEmail(userInfo.email).on("child_added", snapshot=>{
        this.db.getNodeIdFromEmail(userInfo.email).on("value", snapshot=>{
          let match = new Match(matchDeets, snapshot.key, moves);
          console.log("this happened");
          obs.next(match);
        });
        });
      }));
  }

  onChange(val){
    console.log(val);
    if(val === "addNew"){
      console.log("contains add new!");

    } else{
      //do nothing
    }
  }

  changed(){
    if(this.rankType === "Gi"){
      this.rankType = "No gi";
      this.ranks = this.nogiRanks;
      this.giStatus = false;
    } else if(this.rankType === "No gi"){
      this.rankType = "Gi";
      this.giStatus = true;
      this.ranks = this.giRanks;
    } else {
      console.log ("Something went wrong when toggling between gi and nogi");
    }
  }

  submitFormAndAnnotate(){
    let values = this.getValues();
    let match = this.createMatchObj(values).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result=>{
      console.log(result);
      this.db.addMatchToDb(result);
      //TODO navigate to annotation page??
    });
  }

  submitFormAndReturnToMain(){
    console.log("submitFormAndReturnToMain entered");
    let values = this.getValues();
    // console.log(values);
    let match = this.createMatchObj(values).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result=>{
      console.log(result);
      this.db.addMatchToDb(result);
      this.router.navigate(['']);
    });
  }

  pushToDb(match: Match){

  }

  annotateCurrentVideo(){
    console.log("Annotate"); //@TODO flesh out
  }

  addToQueueAndReturnToMain(){
    console.log("Queue"); //@TODO flesh out
  }

  submitRankFormAndAddToCandidateListAndAddRankTemporarilyToMatch(){
    //TODO flesh out
    console.log("entered submitRankFormAndAddToCandidateListAndAddRankTemporarilyToMatch");
  }

}
