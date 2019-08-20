import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateCalculationsService {

  constructor() { }

  calculateDaysSinceLastAnnotation(date: Date) : number{
    let today: string = new Date().toJSON();
    // console.log("today");
    // console.log(today);
    let parsedToday = this.parseDate(today);
    // console.log("parsedToday");
    // console.log(parsedToday);
    let parsedAnnotationDate = this.parseDate(date.toJSON());
    let numDays = this.datediff(parsedAnnotationDate, parsedToday);
    // console.log("numDays: " + numDays);
    return numDays;
  }

  parseDate(str: string) {
    let mdy = str.split('-');
    return new Date(Number(mdy[0]), Number(mdy[1])-1, Number(mdy[2].substring(0,2)));
  }

  datediff(first, second) {
    // Take the difference between the dates and divide by milliseconds per day.
    // Round to nearest whole number to deal with DST.
    return Math.round((second-first)/(1000*60*60*24));
  }

}
