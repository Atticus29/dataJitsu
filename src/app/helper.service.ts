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
            // console.log("category on list of ones with subcategories");
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

  // getSubcategory(category: string, move: string): string{
  //   // let tmpArray: Array<string> = constants.rootNodesWithSubcategories;
  //   // if(tmpArray.includes(category)){
  //   //   this.dbService.getSubcategoryFromMoveAndCategory(category, move).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
  //   //     console.log("results in getSubcategory call from helper service: ");
  //   //     console.log(result);
  //   //   });
  //   // }
  //   return '';
  //   //TODO
  //   //if hasSubcategories(category){return subcategory} else{ return ''}
  // }

  getSubcategories(category: string){
    this.dbService.getMovesSubsetAsObject(category).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
      console.log("results in getSubcategories call from helper service: ");
      console.log(result);
    });
  }

  renderFlatStringObjectAsArray(obj: Object){
    let returnArray = Object.values(obj);
    if(this.isFlatStringObj(obj)){
      console.log("renderFlatObjectAsArray from renderFlatObjectAsArray is: ");
      console.log(returnArray);
    } else{
      returnArray = null;
      alert("obj not flat! error!");
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
