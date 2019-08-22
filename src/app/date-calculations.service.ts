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

  roundToDecimal(number,decimal) {
    var zeros = new String( 1.0.toFixed(decimal) );
    zeros = zeros.substr(2);
    var mul_div = parseInt( "1"+zeros );
    var increment = parseFloat( "."+zeros+"01" );
    if( ( (number * (mul_div * 10)) % 10) >= 5 )
      { number += increment; }
    return Math.round(number * mul_div) / mul_div;
  }

  convertSecondsToMinutesAndSeconds(inputSeconds: number): string{
    // let convertedSeconds = Number(inputSeconds);
    let minutes = Math.floor(inputSeconds / 60);
    let seconds = Math.floor(inputSeconds - (minutes*60));
    return this.str_pad_left(minutes,'0',2)+':'+ this.str_pad_left(seconds,'0',2);
  }

  str_pad_left(string,pad,length) {
    return (new Array(length+1).join(pad)+string).slice(-length);
  }

}
