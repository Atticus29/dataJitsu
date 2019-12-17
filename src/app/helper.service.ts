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
  //   this.dbService.getMovesSubsetAsObject(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
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
}
