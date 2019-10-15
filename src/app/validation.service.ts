import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

  constructor() { }

  validateString(str: string){
    if(str){
      console.log("str exists and is ");
      console.log(str);
      return str.length > 0;
    } else{
      console.log("str doesn't exist");
      return false;
    }
  }

  validateEmail(email: string) {
    if(email){
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase()) && email;
    } else {
      return false;
    }
  }

  validatePassword(password: string){
    if(password){
      return password.length > 6;
    } else {
      return false;
    }
  }

  validateWeight(weight: number){
    return weight > 8 && weight < 1000; //@TODO extend as kilos and lbs accommodated
  }

  validateDate(date: any){
    let dateString = '';
    try{
      dateString = date.toString();
    } catch(err){
      console.log(err);
    }

    let re = /^\w*\s\w*\s\d*\s\d*.*?$/;
    let re2 = /^\d+\/\d+\/\d+$/;
    return (re.test(dateString.toLowerCase())|| re2.test(dateString.toLowerCase())) && dateString;
  }

  validateUrl(url: string){
    let re = /^https:\/\/youtu.*?$/;
    return re.test(url.toLowerCase()) && url;
  }

  //@TODO add validUserName method that checks whether the username is unique or not

}
