import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

  constructor() { }

  validateEmail(email: string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase()) && email;
  }

  validatePassword(password: string){
    return password.length > 6 && password;
  }

  validateWeight(weight: number){
    return weight > 8 && weight < 1000; //@TODO extend as kilos and lbs accommodated
  }

  validateDate(date: string){
    let re = /^\w*\s\w*\s\d*\s\d*.*?$/;
    let re2 = /^\d+\/\d+\/\d+$/;
    return (re.test(date.toLowerCase())|| re2.test(date.toLowerCase())) && date;
  }

  validateUrl(url: string){
    let re = /^https:\/\/youtu.*?$/;
    return re.test(url.toLowerCase()) && url;
  }

  //@TODO add validUserName method that checks whether the username is unique or not

}
