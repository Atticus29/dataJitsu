import { Component, OnInit, NgZone } from '@angular/core';
// import {MaterializeDirective,MaterializeAction} from "angular2-materialize";
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {Location} from "@angular/common";
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";

import { AngularFireDatabase,AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Subject ,  Observable } from 'rxjs';
import { takeUntil, take, switchMap, first } from 'rxjs/operators';

import { User } from '../user.model';
import { AuthorizationService } from '../authorization.service';
import { TrackerService } from '../tracker.service';
import { ProtectionGuard } from '../protection.guard';
import { VideoDetails } from '../videoDetails.model';
import { Video } from '../video.model';
import { EventInVideo } from '../eventInVideo.model';
import { DatabaseService } from '../database.service';
import { ValidationService } from '../validation.service';
import { TextTransformationService } from '../text-transformation.service';
import { BaseComponent } from '../base/base.component';
import { constants } from '../constants';

import { NewAthleteNameDialogComponent } from '../new-athlete-name-dialog/new-athlete-name-dialog.component';
import { NewTournamentNameDialogComponent } from '../new-tournament-name-dialog/new-tournament-name-dialog.component';
import { NewWeightClassDialogComponent } from '../new-weight-class-dialog/new-weight-class-dialog.component';
import { NewNoGiRankDialogComponent } from '../new-no-gi-rank-dialog/new-no-gi-rank-dialog.component';
import { NewAgeClassDialogComponent } from '../new-age-class-dialog/new-age-class-dialog.component';
import { NewLocationNameDialogComponent } from '../new-location-name-dialog/new-location-name-dialog.component';

declare var $:any;

@Component({
  selector: 'app-new-video',
  templateUrl: './new-video.component.html',
  styleUrls: ['./new-video.component.scss'],
})

export class NewVideoComponent extends BaseComponent implements OnInit {
    //@TODO add option to add new weight class, age class, etc. in the html here rather than on the db to keep in the bottom and isolate for special behavior
  private sub: any;
  private rankBound: string = ""; //has to be special because if left blank messes up because dynamically toggles between gi and nogi
  title: string = "Submit a New Match for Annotation";
  ageClasses: any[];
  ranks: any[];
  athleteNames: any[];
  tournamentNames: any[];
  giRanks: any[];
  nogiRanks: any[];
  rankType: string = "Nogi";
  genders: any[];
  weightClasses: any[];
  locationNames: any[];
  newMatchForm: FormGroup;
  currentUserId: any;
  currentUser: any = null;
  disabledGender: boolean = true;
  disabledAgeClass: boolean = false;
  disabledGiRank: boolean = false;
  disabledNoGiRank: boolean = false;
  disabledWeightClass: boolean = false;
  disabledLocationName: boolean = false;
  giStatus: boolean = false;
  checked: boolean = false;
  rankSelection: string;
  private hasPaid: boolean = false;
  private isAdmin: boolean = false;
  private localUser: any = null;

  // localMatchUrlBound: string = null;
  localAthlete1Name: string = null;
  localAthlete2Name: string = null;
  localTournamentName: string = null;
  localWeightClassName: string = null;
  localNoGiRankName: string = null;
  localAgeClassName: string = null;
  localLocationName: string = null;
  // localTournamentNameBound: string = null;
  // localLocationBound: string = null;
  // localTournamentDateBound: string = null;
  // localGiStatusBound: string = null;
  // localGenderBound: string = null;
  // localAgeClassBound: string = null;
  // localRankBound: string = null;
  // localWeightBound: string = null;

  newRankForm: FormGroup; //TODO what is this?
  private matchUrlBoundFc: FormControl = new FormControl('', [Validators.required]);
  private athlete1NameBoundFc: FormControl = new FormControl('', []);
  private athlete2NameBoundFc: FormControl = new FormControl('', []);
  private tournamentNameBoundFc: FormControl = new FormControl('', [Validators.required]);
  private locationBoundFc: FormControl = new FormControl('', [Validators.required]);
  private tournamentDateBoundFc: FormControl = new FormControl('', [Validators.required]);
  private giStatusBoundFc: FormControl = new FormControl('', [Validators.required]);
  private genderBoundFc: FormControl = new FormControl('', [Validators.required]);
  private ageClassBoundFc: FormControl = new FormControl('', [Validators.required]);
  private rankBoundFc: FormControl = new FormControl('', [Validators.required]);
  private weightBoundFc: FormControl = new FormControl('', [Validators.required]);
  private noGiRankBoundFc: FormControl = new FormControl('', [Validators.required]);

  constructor(private fb: FormBuilder, private db: DatabaseService, private router: Router, private as: AuthorizationService, private location: Location, private vs: ValidationService, private _snackBar: MatSnackBar, private trackerService: TrackerService, public ngZone: NgZone, public dialog: MatDialog, private textTransformationService: TextTransformationService) {
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
      // console.log("currentUser in new-match component:");
      // console.log(currentUser);
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

    this.genders = constants.genders;

    this.db.getIndividualNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(athleteNames =>{
      this.athleteNames = athleteNames.sort();
    });

    this.db.getTournamentNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(tournamentNames =>{
      this.tournamentNames = tournamentNames.sort();
    });

    this.db.getGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(giRanks=>{
      this.giRanks = giRanks; //.sort();
      this.ranks = giRanks; //.sort();
      // this.disabledGiRank = true;
    });

    this.db.getNoGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(noGiRanks=>{
      this.nogiRanks = noGiRanks; //.sort();
      this.ranks = noGiRanks; //.sort();
      // this.disabledNoGiRank = true;
    })

    this.db.getAgeClasses().pipe(takeUntil(this.ngUnsubscribe)).subscribe(ageClasses=>{
      this.ageClasses = ageClasses.sort();
      this.disabledAgeClass = true;
    });

    this.db.getWeightClasses().pipe(takeUntil(this.ngUnsubscribe)).subscribe(weightClasses=>{
      this.weightClasses = weightClasses.sort();
      this.disabledWeightClass = true;
    });

    this.db.getLocations().pipe(takeUntil(this.ngUnsubscribe)).subscribe(locationNames=>{
      this.locationNames = locationNames.sort();
      this.disabledLocationName = true;
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
    if(this.localAthlete1Name){
      console.log("localAthlete1Name exists");
      athlete1NameBound = this.localAthlete1Name;
      this.db.addCandidateNameToDb(athlete1NameBound, matchUrlBound);
    }
    if(this.localAthlete2Name){
      console.log("localAthlete2Name exists");
      athlete2NameBound = this.localAthlete2Name;
      this.db.addCandidateNameToDb(athlete2NameBound, matchUrlBound);
    }
    // console.log(athlete1NameBound);
    // console.log(athlete2NameBound);
    let tournamentNameBound = this.tournamentNameBoundFc.value;
    if(this.localTournamentName){
      console.log("localTournamentName exists");
      tournamentNameBound = this.localTournamentName;
      this.db.addCandidateTournamentNameToDb(tournamentNameBound, matchUrlBound);
    }

    let weightBound = this.weightBoundFc.value;
    if(this.localWeightClassName){
      console.log("localWeightClassName exists");
      weightBound = this.localWeightClassName;
      this.db.addGenericCandidateNameToDb('candidateWeightClasses', weightBound, matchUrlBound);
    }
    let locationBound = this.locationBoundFc.value;
    if(this.localLocationName){
      console.log("localLocationName exists");
      locationBound = this.localLocationName;
      this.db.addGenericCandidateNameToDb('candidateLocationNames', locationBound, matchUrlBound);
    }
    let tournamentDateBound = this.tournamentDateBoundFc.value;
    let giStatusBound = this.giStatusBoundFc.value;
    let genderBound = this.genderBoundFc.value;
    let ageClassBound = this.ageClassBoundFc.value;
    if(this.localAgeClassName){
      console.log("localAgeClassName exists");
      ageClassBound = this.localAgeClassName;
      this.db.addGenericCandidateNameToDb('candidateAgeClasses', ageClassBound, matchUrlBound);
    }
    let rankBound = this.rankBoundFc.value;
    if(this.localNoGiRankName){
      console.log("localNoGiRankName exists");
      rankBound = this.localNoGiRankName;
      this.db.addGenericCandidateNameToDb('candidateNoGiRanks', rankBound, matchUrlBound);
    }

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
    let videoDeets = new VideoDetails(tournamentNameBound, locationBound, tournamentDateBound.toString(), athlete1NameBound, athlete2NameBound, weightBound, this.rankBound, matchUrlBound, genderBound, giStatusBound, ageClassBound);
    let moves: Array<EventInVideo> = new Array<EventInVideo>();
    let createMatchObservable = Observable.create(function(observer){
      if(self.localUser != null){
        let match = new Video(videoDeets, self.localUser.id, moves);
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
      // this.localNoGiRankName = "";
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
          let videoId = this.db.addVideoToDb(result);
          this.openSnackBar("Match Successfully Created!", null);
          this.router.navigate([constants.allVideosPathName + videoId]);
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
    console.log(values);
    this.db.doesMatchExist(values.matchUrlBound).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
      console.log("does match exist result in submitFormAndReturnToMain");
      console.log(result);
      if(!result){
        let match = this.createMatchObj(values).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result=>{
          console.log("got into result for submitFormAndReturnToMain call:");
          console.log(result);
          this.db.addVideoToDb(result);
          this.openSnackBar("Match Successfully Created!", null);
          this.ngZone.run(() =>{
            if(this.hasPaid || this.isAdmin){
              this.router.navigate([constants.allVideosPathName]);
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

  pushToDb(match: Video){

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

  async openAgeClassNameDialog(){
    let dialogConfig = this.getGenericDialogConfig();
    const dialogRef = this.dialog.open(NewAgeClassDialogComponent, dialogConfig);
    this.localAgeClassName = await this.processGenericDialog(dialogRef, 'ageClasses', 'ageClassName');
  }

  async openWeightClassNameDialog(){
    let dialogConfig = this.getGenericDialogConfig();
    const dialogRef = this.dialog.open(NewWeightClassDialogComponent, dialogConfig);
    this.localWeightClassName = await this.processGenericDialog(dialogRef, 'weightClasses', 'weightClassName');
  }

  async openNoGiRankDialog(){
    let dialogConfig = this.getGenericDialogConfig();
    const dialogRef = this.dialog.open(NewNoGiRankDialogComponent, dialogConfig);
    this.localNoGiRankName = await this.processGenericDialog(dialogRef, 'noGiRanks', 'noGiRankName');

  }

  async openTournamentNameDialog(){
    let dialogConfig = this.getGenericDialogConfig();
    const dialogRef = this.dialog.open(NewTournamentNameDialogComponent, dialogConfig);
    this.localTournamentName = await this.processGenericDialog(dialogRef, 'tournamentNames', 'tournamentName');
  }

  async openLocationNameDialog(){
    let dialogConfig = this.getGenericDialogConfig();
    const dialogRef = this.dialog.open(NewLocationNameDialogComponent, dialogConfig);
    this.localLocationName = await this.processGenericDialog(dialogRef, 'locations', 'locationName');
  }

  openAddNameDialog(athleteNumber: number){
    // console.log("clicked!");
    console.log("athlete number is " + athleteNumber);
    let dialogConfig = this.getGenericDialogConfig();
    const dialogRef = this.dialog.open(NewAthleteNameDialogComponent, dialogConfig);
    dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => {
      console.log("got dialog data to new-match component?:");
      console.log(val);
      this.db.getIndividualNames().pipe(takeUntil(this.ngUnsubscribe)).subscribe(athleteNames =>{
        // console.log(athleteNames);
        val.last = this.textTransformationService.capitalizeFirstLetter(val.last);
        val.first = this.textTransformationService.capitalizeFirstLetter(val.first);

        let candidateName = val.last + ", " + val.first;
        // console.log(candidateName);
        if(athleteNames.includes(candidateName)){
          // console.log("name already exits");
          this.openSnackBar("Name already exists in dropdown menu!", null);
          this.localAthlete1Name = null;
          this.localAthlete2Name = null;

        }else{
          if(athleteNumber == 1){
            this.localAthlete1Name = val.last + ", " + val.first;
            console.log("localAthlete1Name added; it is " + this.localAthlete1Name);
          }
          if(athleteNumber == 2){
            this.localAthlete2Name = val.last + ", " + val.first;
            console.log("localAthlete2Name added; it is " + this.localAthlete2Name);
          }
        }
      });
      // this.authService.emailLogin(val.email, val.passwd);
    });
  }

  getGenericDialogConfig(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {};
    return dialogConfig;
  }

  async processGenericDialog(dialogRef: any, path: string, parameterFromForm: string) : Promise<any>{ //TODO Promise<any>
    console.log("entered processGenericDialog")
    let [val, genericStringNames] = await Promise.all([dialogRef.afterClosed().pipe(takeUntil(this.ngUnsubscribe)).toPromise(), this.db.getGenericStringNames(path).pipe(first()).toPromise()]);
      if(val){
        console.log("val");
        console.log(val);
        let candidateNameCapitalized = this.textTransformationService.capitalizeFirstLetter(val[parameterFromForm]);
        console.log("candidateNameCapitalized is " + candidateNameCapitalized);
        if(genericStringNames.includes(candidateNameCapitalized)){
          // debugger;
          this.openSnackBar(constants.alreadyExistsNotification, null);
          return null;
        }else{
          console.log("got here");
          return candidateNameCapitalized;
        }
      }else{
        return null;
      }
  }

}
