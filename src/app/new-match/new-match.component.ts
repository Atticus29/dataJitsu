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
import { Router } from '@angular/router';
import { AuthorizationService } from '../authorization.service';
import {Location} from "@angular/common";
import { ProtectionGuard } from '../protection.guard';
import { Observable } from 'rxjs/Observable';
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

  constructor(private fb: FormBuilder, private db: DatabaseService, private router: Router, private as: AuthorizationService, private location: Location) {
    // let temp = this.as.isAuthenticated();
    // temp.subscribe(result =>{
    //   console.log(result);
    // });
  }

  ngOnInit() {
    $('.modal').modal();

    this.genders = ["Female", "Male"];

    this.db.getGiRanks().takeUntil(this.ngUnsubscribe).subscribe(giRanks=>{
      this.giRanks = giRanks;
      this.ranks = giRanks;
      this.disabledGiRank = true;
    })

    this.db.getNoGiRanks().takeUntil(this.ngUnsubscribe).subscribe(noGiRanks=>{
      this.nogiRanks = noGiRanks;
      this.disabledNoGiRank = true;
    })

    this.db.getAgeClasses().takeUntil(this.ngUnsubscribe).subscribe(ageClasses=>{
      this.ageClasses = ageClasses;
      this.disabledAgeClass = true;
    });

    this.db.getWeightClasses().takeUntil(this.ngUnsubscribe).subscribe(weightClasses=>{
      this.weightClasses = weightClasses;
      this.disabledWeightClass = true;
    });

    this.newMatchForm = this.fb.group({
      matchUrlBound: ['', Validators.required],
      athlete1NameBound: ['', Validators.required],
      athlete2NameBound: ['', Validators.required],
      tournamentNameBound: ['', Validators.required],
      locationBound: ['', Validators.required],
      tournamentDateBound: ['', Validators.required],
      genderBound: ['', Validators.required],
      ageClassBound: ['', Validators.required],
      rankBound: ['', Validators.required],
      weightBound: ['', Validators.required],
      giStatusBound: ['', Validators.required]
    });

    // this.currentUser = this.userService.getUser(this.currentUserId); //@TODO mature this
  }

  getValues(){
    let result = this.newMatchForm.value;
    return result;
  }

  allValid(matchForm: FormGroup){
    let values = matchForm.value;
    if(this.urlValid(values.matchUrlBound) && values.athlete1NameBound !== "" && values.athlete2NameBound !== "" && values.tournamentNameBound !== "" && values.locationBound !== "" && values.tournamentDateBound !== "" && values.genderBound !== "" && values.ageClassBound !== "" && values.rankBound !== "" && values.weightBound !== ""  && values.weightBound !== "" ){
      return true;
    } else{
      return false;
    }
  }

  urlValid(url: string){
    return true; //@TODO make sure youtube only for now
  }

  createMatchObj(result: any){
    let {matchUrlBound, athlete1NameBound, athlete2NameBound, tournamentNameBound, locationBound, tournamentDateBound, rankBound, genderBound, ageClassBound, weightBound} = result;
    let matchDeets = new MatchDetails(tournamentNameBound, locationBound, new Date(tournamentDateBound), athlete1NameBound, athlete2NameBound, weightBound, rankBound, matchUrlBound, genderBound, this.giStatus, ageClassBound);
    let moves: Array<MoveInVideo> = new Array<MoveInVideo>();
    return this.as.getCurrentUser().switchMap(userInfo => {
        // TODO fix this/make sure it's working
        // console.log("got into getCurrentUser");
        return Observable.create(obs=>{
        this.db.getNodeIdFromEmail(userInfo.email).on("child_added", snapshot=>{
          let match = new Match(matchDeets, snapshot.key, moves);
          // console.log(match);
          obs.next(match);
        });
        });
      });
    //
    // let userObservable = this.as.getCurrentUser();
    // let higherOrder = userObservable.map(userInfo =>{
    //   this.db.getNodeIdFromEmail(userInfo.email);
    // });
    // return Observable.create(obs =>{
    //   higherOrder.on("child_added", snapshot =>{
    //     let match = new Match(matchDeets, snapshot.key, moves);
    //     obs.next(match);
    //   });
    // });

    // return Observable.switchMap(obs=>{
    //   this.as.getCurrentUser().switchMap(userInfo =>{
    //     this.db.getNodeIdFromEmail(userInfo.email).on("child_added", snapshot =>{
    //       let match = new Match(matchDeets, snapshot.key, moves);
    //       obs.next(match);
    //     });
    //   });
    // });

    // this.as.getCurrentUser()
    //   .switchMap(userInfo => {
    //     console.log("got into getCurrentUser");
    //     return Observable.create(obs =>{
    //       this.db.getNodeIdFromEmail(userInfo.email).on("child_added", snapshot=>{
    //         let match = new Match(matchDeets, snapshot.key, moves);
    //         obs.next(match);
    //       });
    //     });
    //   });
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
    let match = this.createMatchObj(values).takeUntil(this.ngUnsubscribe).subscribe(result=>{
      console.log(result);
      this.db.addMatchToDb(result);
    });
  }

  submitFormAndReturnToMain(){
    let values = this.getValues();
    // console.log(values);
    let match = this.createMatchObj(values).takeUntil(this.ngUnsubscribe).subscribe(result=>{
      // console.log(result);
      this.db.addMatchToDb(result);
      this.router.navigate(['landing']);
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
  }

}
