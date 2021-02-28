import { Injectable } from '@angular/core';
// import * as moment from 'moment';
import moment from 'moment';

@Injectable()
export class TextTransformationService {

  constructor() { }

  convertCamelCaseToSentenceCase(camelCaseString: string){
    var result = camelCaseString.replace( /([A-Z])/g, " $1" );
    var finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  }

  capitalizeFirstLetter(word: string){
    const wordCapitalized = word.charAt(0).toUpperCase() + word.slice(1);
    return wordCapitalized;
  }

  capitalizeFirstLetterOfEachWord(phrase: string){
    const words = phrase.split(' ');
    const newWords = words.map(this.capitalizeFirstLetter);
    return newWords.join(' ');
  }

  simplifyDateString(dateString?: string, date?: Date){
    // console.log("entered simplifyDateString");
    if(dateString){
      // console.log("formatted as dateString");
      // console.log(dateString);
      let tmpDate = Date.parse(dateString);
      let tmpString = moment(tmpDate).format('LL');
      // console.log("return tmpString: " + tmpString);
      return tmpString === "Invalid date"? dateString: tmpString;
    }
    if(date){
      // console.log("formatted as date");
      // console.log(date);
      let tmpString = moment(date).format('LL');
      // console.log("return tmpString: " + tmpString);
      return tmpString;
    } else{
      // console.log("formatted as neither");
      return null;
    }

  }

}
