import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormGroupDirective, NgForm} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { constants } from '../constants';
import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { User } from '../user.model';
import { TrackerService } from '../tracker.service';
import { ValidationService } from '../validation.service';
import { AuthorizationService } from '../authorization.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  providers: [DatabaseService, ValidationService, AuthorizationService, TrackerService]
})
export class CreateAccountComponent extends BaseComponent implements OnInit {

  //@TODO add option to add new weight class, age class, etc. in the html here rather than on the db to keep in the bottom and isolate for special behavior
  newUserForm: FormGroup;
  title: string = "Create an Account";
  genders: Array<string> = constants.genders;
  weightClasses: any[];
  noGiRanks: any[];
  giRanks: any[];
  ageClasses: any[];
  ages: Array<number> = new Array<number>();
  disabledAge: boolean = true;
  disabledNoGiRank: boolean = false;
  disabledGiRank: boolean = false;
  disabledAgeClass: boolean = false;
  private passwordBoundFc: FormControl = new FormControl('', [Validators.required, Validators.minLength(7)]);
  private confirmPasswordBoundFc: FormControl = new FormControl('', [Validators.required, Validators.minLength(7)]);
  private userNameBoundFc: FormControl = new FormControl('', [Validators.required]);
  private userEmailBoundFc: FormControl = new FormControl('', [Validators.required, Validators.email]);
  private hide: boolean = true;
  private hideConfirm: boolean = true;
  private passwordsNotEqual: boolean = false;

  constructor(private fb: FormBuilder, private db: DatabaseService, private router: Router, private vs: ValidationService, private as: AuthorizationService, private trackerService: TrackerService, private defaultErrorStateMatcher: ErrorStateMatcher) {
    super();
  }

  ngOnInit() {
    for (var i = 3; i <= 110; i++) {
      this.ages.push(i);
    }
    this.newUserForm = this.fb.group({
      userAffiliationBound: ['', Validators.required],
      genderBound: ['', Validators.required],
      ageClassBound: ['', Validators.required],
      giRankBound: ['', Validators.required],
      noGiRankBound: ['', Validators.required],
      weightBound: ['', Validators.required],
      ageBound: ['', Validators.required]
    });

    this.db.getGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(giRanks=>{
      console.log("giRanks: ");
      console.log(giRanks);
      this.giRanks = giRanks;
      this.disabledGiRank = true;
    })

    this.db.getNoGiRanks().pipe(takeUntil(this.ngUnsubscribe)).subscribe(noGiRanks=>{
      console.log("noGiRanks are: ");
      console.log(noGiRanks);
      this.noGiRanks = noGiRanks;
      this.disabledNoGiRank = true;
    })

    this.db.getAgeClasses().pipe(takeUntil(this.ngUnsubscribe)).subscribe(ageClasses=>{
      console.log("ageClasses are:");
      console.log(ageClasses);
      this.ageClasses = ageClasses;
      this.disabledAgeClass = true;
    });
  }

  getErrorMessage() {
    let errorMessage: string = "A form error has occurred";
    if(this.passwordBoundFc.hasError('required')){
      errorMessage = 'Password required';
    }
    if(this.passwordBoundFc.hasError('minlength')){
      errorMessage = 'Password must be at least ' + constants.minPwLength + ' characters long';
    }
    if(this.userNameBoundFc.hasError('required')){
      errorMessage = 'User Name must have a value';
    }
    if(this.userEmailBoundFc.hasError('email')){
      errorMessage = 'Email must be a valid email address';
    }
    if(this.userEmailBoundFc.hasError('required')){
      errorMessage = 'Email address required';
    }
    if(this.confirmPasswordBoundFc.hasError('required')){
      errorMessage = 'Confirm password required';
    }
    if(this.confirmPasswordBoundFc.hasError('minlength')){
      errorMessage = 'Confirm password must be at least ' + constants.minPwLength + ' characters long';
    }
    return  errorMessage;
  }

  getValues(){
    let passwordBound = this.passwordBoundFc.value;
    // let confirmPasswordBound = this.confirmPasswordBoundFc.value;
    let userNameBound = this.userNameBoundFc.value;
    let userEmailBound = this.userEmailBoundFc.value;
    let otherResults = this.newUserForm.value;
    return {passwordBound, userNameBound, userEmailBound, ...otherResults};
  }

  createUserObj(result: any){
    let {userNameBound, userEmailBound, passwordBound, userAffiliationBound, genderBound, ageClassBound, giRankBound, noGiRankBound, weightBound, ageBound} = result;
    let newUser = new User(userNameBound, userEmailBound, passwordBound, giRankBound, noGiRankBound, userAffiliationBound, Number(ageBound), weightBound, 100, "", genderBound, new Date().toJSON());
    // console.log(newUser);
    return newUser;
  }

  //@TODO see whether you can get it to re-direct from here if you're logged in

  processFormInputsToDB(){
    // console.log("processFormInputsToDB entered");
    let result = this.getValues();
    console.log(result);
    let newUser: User = this.createUserObj(result);
    // console.log("newUser from processFormInputsToDB: ");
    // console.log(newUser);
    let self = this;

    //The signup and db add HAVE to happen before the subscription. You've made this mistake before
    this.as.emailSignUp(newUser.getEmail(), newUser.getPassword());
    this.db.addUserToDb(newUser).pipe(takeUntil(this.ngUnsubscribe)).subscribe((dbUserId: string) =>{
      // console.log("dbUserId in create-account component");
      // console.log(dbUserId);
      this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user =>{
        if(user){
          if(user.uid){
            // console.log("user uid in trackerService.currentUserBehaviorSubject in create-account component");
            // console.log(user.uid);
            // console.log(newUser.getId());
            this.db.addUidToUser(user.uid, dbUserId);
            // console.log("Oh hey! There's a uid, too!: " + user.uid);
          }
          this.as.emailLogin(newUser.getEmail(), newUser.getPassword()); //TODO I'm not sure where to put this... putting it below FUBARs it
        }
      });
    });

  }

  allValid(){
    let values = this.getValues();
    let confirmPasswordBound = this.confirmPasswordBoundFc.value;
    // console.log(confirmPasswordBound);
    // console.log(values)
    if(values.passwordBound !== confirmPasswordBound){
      // console.log("passwordsNotEqual");
      this.passwordsNotEqual = true;
    }
    if(values.passwordBound === confirmPasswordBound){
      // console.log("passwords Equal");
      this.passwordsNotEqual = false;
    }
    if(values.passwordBound===confirmPasswordBound && values.userNameBound && this.vs.validateEmail(values.userEmailBound) && this.vs.validatePassword(values.passwordBound) && values.genderBound && values.ageClassBound && this.vs.validateWeight(values.weightBound) && values.giRankBound && values.noGiRankBound && values.ageBound && values.userAffiliationBound){
      return true;
    } else{
      return false;
    }
  }

}
