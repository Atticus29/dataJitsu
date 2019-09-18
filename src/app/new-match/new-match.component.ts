import { Component, OnInit, NgZone } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from "@angular/common";
import {MatSnackBar} from '@angular/material/snack-bar';

import { AngularFireDatabase,AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Subject ,  Observable } from 'rxjs';
import { takeUntil, take, switchMap } from 'rxjs/operators';

import { User } from '../user.model';
import { AuthorizationService } from '../authorization.service';
import { TrackerService } from '../tracker.service';
import { ProtectionGuard } from '../protection.guard';
import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';
import { DatabaseService } from '../database.service';
import { ValidationService } from '../validation.service';
import { BaseComponent } from '../base/base.component';

declare var $:any;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.scss'],
})

export class NewMatchComponent extends BaseComponent implements OnInit {
    //@TODO add option to add new weight class, age class, etc. in the html here rather than on the db to keep in the bottom and isolate for special behavior
  private sub: any;
  private rankBound: string = ""; //has to be special because if left blank messes up because dynamically toggles between gi and nogi
  title: string = "Submit a New Match for Annotation";
  ageClasses: any[];
  ranks: any[];
  giRanks: any[];
  nogiRanks: any[];
  rankType: string = "Nogi";
  genders: any[];
  weightClasses: any[];
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
  private hasPaid: boolean = false;
  private isAdmin: boolean = false;
  private localUser: any = null;

  newRankForm: FormGroup; //TODO what is this?
  private matchUrlBoundFc: FormControl = new FormControl('', [Validators.required]);
  private athlete1NameBoundFc: FormControl = new FormControl('', [Validators.required]);
  private athlete2NameBoundFc: FormControl = new FormControl('', [Validators.required]);
  private tournamentNameBoundFc: FormControl = new FormControl('', [Validators.required]);
  private locationBoundFc: FormControl = new FormControl('', [Validators.required]);
  private tournamentDateBoundFc: FormControl = new FormControl('', [Validators.required]);
  private giStatusBoundFc: FormControl = new FormControl('', [Validators.required]);
  private genderBoundFc: FormControl = new FormControl('', [Validators.required]);
  private ageClassBoundFc: FormControl = new FormControl('', [Validators.required]);
  private rankBoundFc: FormControl = new FormControl('', [Validators.required]);
  private weightBoundFc: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private db: DatabaseService, private router: Router, private as: AuthorizationService, private location: Location, private vs: ValidationService, private _snackBar: MatSnackBar, private trackerService: TrackerService, public ngZone: NgZone) {
    super();
    // let temp = this.as.isAuthenticated();
    // temp.subscribe(result =>{
    //   console.log(result);
    // });
  }

  getErrorMessage() {
    let errorMessage: string = "A form error has occurred";
    if(this.matchUrlBoundFc.hasError('required')){
      errorMessage = 'Match URL is required';
      return  errorMessage;
    }
    if(!this.vs.validateUrl(this.matchUrlBoundFc.value)){
      errorMessage = "Match URL must be a valid YouTube URL"; //TODO accommodate vimeo, etc?
      return  errorMessage;
    }
    //TODO custom url error
    return  errorMessage;
  }


  ngOnInit() {
    $('.modal').modal();

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(currentUser =>{
      console.log("currentUser in new-match component:");
      console.log(currentUser);
      if(currentUser && currentUser.uid){
        this.localUser = currentUser;
        this.db.getUserByUid(currentUser.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(dbUser =>{
          this.db.hasUserPaid(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(paymentStatus =>{
            this.hasPaid = paymentStatus;
          });
          this.db.isAdmin(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
            this.isAdmin = status;
          });
        });
      }
    });

    this.genders = ["Female", "Male"];

    this.db.getGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(giRanks=>{
      this.giRanks = giRanks;
      this.ranks = giRanks;
      // this.disabledGiRank = true;
    })

    this.db.getNoGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(noGiRanks=>{
      this.nogiRanks = noGiRanks;
      this.ranks = noGiRanks;
      // this.disabledNoGiRank = true;
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
    let matchUrlBound = this.matchUrlBoundFc.value;
    let athlete1NameBound = this.athlete1NameBoundFc.value;
    let athlete2NameBound = this.athlete2NameBoundFc.value;
    let tournamentNameBound = this.tournamentNameBoundFc.value;
    let locationBound = this.locationBoundFc.value;
    let tournamentDateBound = this.tournamentDateBoundFc.value;
    let giStatusBound = this.giStatusBoundFc.value;
    let genderBound = this.genderBoundFc.value;
    let ageClassBound = this.ageClassBoundFc.value;
    let rankBound = this.rankBoundFc.value;
    let weightBound = this.weightBoundFc.value;

    // let otherResults = this.newMatchForm.value;
    return {matchUrlBound, athlete1NameBound, athlete2NameBound, tournamentNameBound, locationBound, tournamentDateBound,giStatusBound, genderBound, ageClassBound, rankBound, weightBound};
  }

  allValid(matchForm: FormGroup){
    let matchUrlValidCheck = this.matchUrlBoundFc.value;
    if(this.vs.validateUrl(matchUrlValidCheck)){ //&& values.athlete1NameBound !== "" && values.athlete2NameBound !== "" && this.vs.validateDate(values.tournamentDateBound) && values.locationBound !== "" && values.tournamentNameBound !== "" && values.genderBound !== "" && values.ageClassBound !== "" && values.rankBound !== "" && values.weightBound !== ""  && values.weightBound !== ""
      return true;
    } else{
      return false;
    }
  }

  createMatchObj(result: any){
    let self = this;
    let {matchUrlBound, athlete1NameBound, athlete2NameBound, tournamentNameBound, locationBound, tournamentDateBound, rankBound, genderBound, ageClassBound, weightBound, giStatusBound} = result;
    this.rankBound = rankBound==undefined ? "" : rankBound;
    let matchDeets = new MatchDetails(tournamentNameBound, locationBound, tournamentDateBound.toString(), athlete1NameBound, athlete2NameBound, weightBound, this.rankBound, matchUrlBound, genderBound, giStatusBound, ageClassBound);
    let moves: Array<MoveInVideo> = new Array<MoveInVideo>();
    let createMatchObservable = Observable.create(function(observer){
      if(self.localUser != null){
        let match = new Match(matchDeets, self.localUser.id, moves);
        observer.next(match);
      }
    });
    return createMatchObservable;
  }

  onChange(val){
    // console.log(val);
    if(val === "addNew"){
      // console.log("contains add new!");
      //TODO new stuff here
    } else{
      //do nothing
    }
  }

  changed(){
    console.log("checked in changed: ");
    console.log(this.checked);
    if(this.checked){
      this.rankType = "Gi";
      this.ranks = this.giRanks;
      this.giStatus = true;
    } else{
      console.log("nogi selected");
      this.rankType = "Nogi";
      this.giStatus = false;
      this.ranks = this.nogiRanks;
    }
    // if(this.rankType === "Gi"){
    //   console.log("gi selected");
    // } else if(this.rankType === "Nogi"){
    // } else {
    //   console.log ("Something went wrong when toggling between gi and nogi");
    // }
  }

  submitFormAndAnnotate(){ //TODO can DRY this and combine with submitFormAndReturnToMain if you add a router parameter
    let values = this.getValues();
    this.db.doesMatchExist(values.matchUrlBound).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
      // console.log(result);
      if(!result){
        let match = this.createMatchObj(values).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result=>{
          // console.log(result)
          let matchId = this.db.addMatchToDb(result);
          this.openSnackBar("Match Successfully Created!", null);
          this.router.navigate(['matches/' + matchId]);
          //TODO navigate to annotation page??
        });
      } else{
        this.openSnackBar("Match Already Exists in the Database!", null);
      }
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  submitFormAndReturnToMain(){
    console.log("submitFormAndReturnToMain entered");
    let values = this.getValues();
    this.db.doesMatchExist(values.matchUrlBound).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
      console.log("does match exist result in submitFormAndReturnToMain");
      console.log(result);
      if(!result){
        let match = this.createMatchObj(values).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result=>{
          console.log("got into result for submitFormAndReturnToMain call:");
          console.log(result);
          this.db.addMatchToDb(result);
          this.openSnackBar("Match Successfully Created!", null);
          this.ngZone.run(() =>{
            if(this.hasPaid || this.isAdmin){
              this.router.navigate(['matches'])
            }else {
              this.router.navigate(['landing']);
            }
          });
        });
      } else{
        this.openSnackBar("Match Already Exists in the Database!", null);
      }
    });
  }

  pushToDb(match: Match){

  }

  annotateCurrentVideo(){
    // console.log("Annotate"); //@TODO flesh out
  }

  addToQueueAndReturnToMain(){
    // console.log("Queue"); //@TODO flesh out
  }

  submitRankFormAndAddToCandidateListAndAddRankTemporarilyToMatch(){
    //TODO flesh out
    // console.log("entered submitRankFormAndAddToCandidateListAndAddRankTemporarilyToMatch");
  }

  onDestroy(){

  }

}
