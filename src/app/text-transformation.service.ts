import { Injectable } from '@angular/core';
import * as moment from 'moment';

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
    if(dateString){
      let tmpDate = Date.parse(dateString);
      let tmpString = moment(tmpDate).format('LL');
      return tmpString;
    }
    if(date){
      let tmpString = moment(date).format('LL');
      return tmpString;
    } else{
      return null;
    }

  }

}
