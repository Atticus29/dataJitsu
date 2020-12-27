import { Injectable } from '@angular/core';

import { constants } from './constants';
import { DatabaseService } from './database.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  private ngUnsubscribe = new Subject<void>();

  constructor(private dbService: DatabaseService) { }

  hasSubcategories(opts: any){ //returns true if array is array of arrays
    if(opts){
      if(Array.isArray(opts)){
        return Array.isArray(opts[0]);
      } else{
        if (typeof opts === 'string'){
          // console.log(opts);
          // console.log(constants.rootNodesWithSubcategories);
          if(constants.rootNodesWithSubcategories.includes(opts)){ //TODO stop this from erroring
            return true;
          } else{
            return false;
          }
        }
      }
    } else{
      return false;
    }
  }

  // getSubcategories(category: string){
  //   this.dbService.getEventsSubsetAsObject(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
  //     console.log("results in getSubcategories call from helper service: ");
  //     console.log(result);
  //   });
  // }

  renderFlatStringObjectAsArray(obj: Object){
    let returnArray = Object.values(obj);
    if(this.isFlatStringObj(obj)){
    } else{
      returnArray = null;
      alert("obj not flat! error!"); //TODO this doesn't handle well. Fix
    }
    return returnArray;
  }

  isFlatStringObj(obj: Object){
    const flattenedArray = Object.values(obj);
    let stringTracker: number = 0;
    flattenedArray.forEach(elem =>{
      if(typeof elem !=="string"){
        stringTracker++;
      }
    });
    let returnVal = stringTracker>0? false: true;
    return returnVal;
  }

  convertObjectValuesToStrings(obj: Object){
    if(typeof obj === "string"){
      return obj;
    }
    let objKeys = Object.keys(obj);
    let objVals = Object.values(obj);
    let returnObj = {};
    for(let i=0; i<objKeys.length; i++){
      if(typeof objVals[i] !== "string"){
        returnObj[objKeys[i]] = objVals[i].toString();
      }else{
        returnObj[objKeys[i]] = objVals[i];
      }
    }
    return returnObj;
  }
}
