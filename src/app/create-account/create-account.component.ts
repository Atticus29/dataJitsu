import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';
import { User } from '../user.model';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  providers: [DatabaseService]
})
export class CreateAccountComponent implements OnInit {

  //TODO add option to add new weight class, age class, etc. in the html here rather than on the db to keep in the bottom and isolate for special behavior
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  newUserForm: FormGroup;
  title: string = "Create an Account";
  genders: Array<string> = ["Female", "Male"];
  weightClasses: any[];
  noGiRanks: any[];
  giRanks: any[];
  ageClasses: any[];
  ages: Array<number> = new Array<number>();


  constructor(private fb: FormBuilder, private db: DatabaseService) { }

  ngOnInit() {
    for (var i = 3; i <= 110; i++) {
       this.ages.push(i);
    }
    console.log(this.ages);
    this.newUserForm = this.fb.group({
      userNameBound: ['', Validators.required],
      userEmailBound: ['', Validators.required],
      userAffiliationBound: ['', Validators.required],
      genderBound: ['', Validators.required],
      ageClassBound: ['', Validators.required],
      giRankBound: ['', Validators.required],
      noGiRankBound: ['', Validators.required],
      weightBound: ['', Validators.required],
      ageBound: ['', Validators.required]
    });

    this.db.getGiRanks().takeUntil(this.ngUnsubscribe).subscribe(giRanks=>{
      this.giRanks = giRanks;
    })

    this.db.getNoGiRanks().takeUntil(this.ngUnsubscribe).subscribe(noGiRanks=>{
      this.noGiRanks = noGiRanks;
    })

    this.db.getAgeClasses().takeUntil(this.ngUnsubscribe).subscribe(ageClasses=>{
      this.ageClasses = ageClasses;
    });

    this.db.getWeightClasses().takeUntil(this.ngUnsubscribe).subscribe(weightClasses=>{
      this.weightClasses = weightClasses;
    });
  }

  getValues(){
    let result = this.newUserForm.value;
    return result;
  }

  createUserObj(result: any){
    let {userNameBound, userEmailBound, userAffiliationBound, genderBound, ageClassBound, giRankBound, noGiRankBound, weightBound, ageBound} = result;
    let newUser = new User(userNameBound, userEmailBound, giRankBound, noGiRankBound, userAffiliationBound, ageBound, weightBound, 100, null, false, genderBound);
  }

  allValid(){
    console.log("entered allValid");
    let values = this.newUserForm.value;
    console.log(values);
    if(values.userNameBound !== "" && values.userEmailBound !== "" && values.genderBound !== "" && values.ageClassBound !== "" && this.validWeight(values.weightBound) && values.giRankBound !== "" && values.noGiRankBound !== "" && values.ageBound !== "" && values.userAffiliationBound !== ""){
      console.log("allValid valid");
      return true;
    } else{
      console.log("allValid not valid");
      return false;
    }
  }

  validWeight(weight: number){
    return weight > 8 && weight < 1000;
  }
}
