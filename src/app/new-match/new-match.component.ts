import { Component, OnInit, EventEmitter } from '@angular/core';
import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from "@angular/common";
import {MatSnackBar} from '@angular/material/snack-bar';

import { AngularFireDatabase,AngularFireList, AngularFireObject } from 'angularfire2/database';
import { Subject ,  Observable } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';

import { User } from '../user.model';
import { AuthorizationService } from '../authorization.service';
import { TrackerService } from '../tracker.service';
import { ProtectionGuard } from '../protection.guard';
import { MatchDetails } from '../matchDetails.model';
import { Match } from '../match.model';
import { MoveInVideo } from '../moveInVideo.model';
import { DatabaseService } from '../database.service';
import { ValidationService } from '../validation.service';

declare var $:any;

@Component({
  selector: 'app-new-match',
  templateUrl: './new-match.component.html',
  styleUrls: ['./new-match.component.scss'],
  providers: [DatabaseService, AuthorizationService, ProtectionGuard, TrackerService]
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
  private hasPaid: boolean = false;
  private isAdmin: boolean = false;

  newRankForm: FormGroup; //TODO what is this?

  constructor(private fb: FormBuilder, private db: DatabaseService, private router: Router, private as: AuthorizationService, private location: Location, private vs: ValidationService, private _snackBar: MatSnackBar, private trackerService: TrackerService) {
    // let temp = this.as.isAuthenticated();
    // temp.subscribe(result =>{
    //   console.log(result);
    // });
  }

  ngOnInit() {
    $('.modal').modal();

    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user: User) =>{
      this.db.getUserByUid(user.getUid()).pipe(takeUntil(this.ngUnsubscribe)).subscribe(dbUser =>{
        this.db.hasUserPaid(dbUser.id).subscribe(paymentStatus =>{
          this.hasPaid = paymentStatus;
        });
        this.db.isAdmin(dbUser.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(status =>{
          this.isAdmin = status;
        });
      });
    });

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
    let {matchUrlBound, athlete1NameBound, athlete2NameBound, tournamentNameBound, locationBound, tournamentDateBound, rankBound, genderBound, ageClassBound, weightBound} = result;
    this.rankBound = rankBound==undefined ? "" : rankBound;
    let matchDeets = new MatchDetails(tournamentNameBound, locationBound, tournamentDateBound.toString(), athlete1NameBound, athlete2NameBound, weightBound, this.rankBound, matchUrlBound, genderBound, this.giStatus, ageClassBound);
    let moves: Array<MoveInVideo> = new Array<MoveInVideo>();
    return this.trackerService.currentUserBehaviorSubject.pipe(switchMap((userInfo: User) => {
      console.log("got userInfo in new-match component. Looking for email from here");
      console.log(userInfo.getEmail());
        return Observable.create(obs=>{
        this.db.getNodeIdFromEmail(userInfo.email).on("value", snapshot=>{ //TODO make robust
          let match = new Match(matchDeets, snapshot.key, moves);
          obs.next(match);
        });
        });
      }));
  }

  onChange(val){
    // console.log(val);
    if(val === "addNew"){
      console.log("contains add new!");
      //TODO new stuff here
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

  submitFormAndAnnotate(){ //TODO can DRY this and combine with submitFormAndReturnToMain if you add a router parameter
    let values = this.getValues();
    this.db.doesMatchExist(values.matchUrlBound).subscribe(result =>{
      console.log(result);
      if(!result){
        let match = this.createMatchObj(values).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result=>{
          console.log(result)
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
    this.db.doesMatchExist(values.matchUrlBound).subscribe(result =>{
      console.log(result);
      if(!result){
        let match = this.createMatchObj(values).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result=>{
          this.db.addMatchToDb(result);
          this.openSnackBar("Match Successfully Created!", null);
          (this.hasPaid||this.isAdmin) ? this.router.navigate(['matches']) : this.router.navigate(['landing']);
        });
      } else{
        this.openSnackBar("Match Already Exists in the Database!", null);
      }
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

  // onDestroy(){
  //
  // }

}
