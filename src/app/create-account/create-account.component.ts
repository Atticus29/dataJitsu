import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators} from '@angular/forms';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  providers: [DatabaseService]
})
export class CreateAccountComponent implements OnInit {
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  newUserForm: FormGroup;
  title: string = "Create an Account";
  genders: Array<string> = ["Female", "Male"];
  weightClasses: any[];
  noGiRanks: any[];
  giRanks: any[];
  ageClasses: any[];
  ages: Array<number>;


  constructor(private fb: FormBuilder, private db: DatabaseService) { }

  ngOnInit() {
    for (var i = 3; i <= 110; i++) {
       this.ages.push(i);
    }
    this.newUserForm = this.fb.group({
      userNameBound: ['', Validators.required],
      userEmailBound: ['', Validators.required],
      genderBound: ['', Validators.required],
      ageClassBound: ['', Validators.required],
      giRankBound: ['', Validators.required],
      noGiRankBound: ['', Validators.required],
      weightClassBound: ['', Validators.required],
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
    let {userNameBound, userEmailBound, genderBound, ageClassBound, giRankBound, noGiRankBound, weightClassBound, ageBound} = result;
    let newUser = new User()
  }

  allValid(){
    console.log("entered allValid");
    let values = this.newUserForm.value;
    console.log(values);
    if(values.userNameBound !== "" && values.userEmailBound !== "" && values.genderBound !== "" && values.ageClassBound !== "" && values.weightClassBound !== "" && values.giRankBound !== "" && values.noGiRankBound !== "" && values.ageBound !== ""){
      console.log("allValid valid");
      return true;
    } else{
      console.log("allValid not valid");
      return false;
    }
  }
}
