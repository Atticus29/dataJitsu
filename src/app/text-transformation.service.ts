import { Injectable } from '@angular/core';

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

}
