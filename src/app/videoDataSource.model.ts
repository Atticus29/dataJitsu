// import {CollectionViewer} from "@angular/cdk/collections";
import {MatTableDataSource} from '@angular/material/table';
import { BehaviorSubject ,  Observable , of } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { Match } from './match.model';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';

@Injectable()
export class VideoDataSource extends MatTableDataSource<Match> {

  private matchesSubject = new BehaviorSubject<Match[]>([]);
  private loadingMatches = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingMatches.asObservable();

  constructor(private dbService: DatabaseService) {
    super();
  }
  filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm, key) => {
        return this.accumulateNestedObjectContentsInSearch(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
  }
  accumulateNestedObjectContentsInSearch(search, data, key) {
    // console.log("search is: " + search);
    // console.log("data is:");
    // console.log(data);
    // console.log("key is " + key);
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.accumulateNestedObjectContentsInSearch(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }

    sortingDataAccessor = (item, property) => {
      console.log("sortingDataAccestor entered");
      // console.log(item);
      // console.log(property);
      if(item[property]){
        console.log("item at the base level. Bam. should be done");
        return item[property];
      } else{
        console.log("no item at the base level.");
        //look through all of the objects that are elements of this object, and return any items that are properties of them
        const sortResult = this.lookDeepIntoObjForItem(item, property);
        console.log(sortResult);
        return sortResult;
      }
    }
    lookDeepIntoObjForItem(item: any, property:string){
    let result = null;
    const objKeys = Object.keys(item);
    const objVals = Object.keys(item).map(key => item[key]);
    for(let i=0; i<objVals.length; i++){
      if(typeof objVals[i]=== 'object'){
        console.log("object hit");
        console.log(objVals[i]);
        result = this.lookDeepIntoObjForItem(objVals[i], property);
        return result;
      } else{
        if(objKeys.includes(property)){
          console.log("oo property is included in our array! Result is:");
          console.log(item[property]);
          result = item[property];
          return result;
        }else{
          //skip?
        }
      }
    }
    // return result;
    }

  async loadMatches(): Promise<any>{
    // console.log("loadMatches entered");
    let results = await this.dbService.getMatchesV2();
    // console.log("results");
    // console.log(results);
    let dbMatches = results.map(Match.fromJson);
    // console.log("dbMatches in loadMatches of videoDataSource show:");
    // console.log(dbMatches);
    return dbMatches;
  }

  makeIntoArray(matches: any){
    let results = []; //TODO there should be a way to tighten the below up
    for(var i in matches){
      let obj1 = {id:matches[i].id};
      if(matches[i].videoDeets){
        let obj2 = matches[i].videoDeets;
        obj1 = Object.assign({}, obj1, obj2);
      }
      results.push(obj1);
    }
    return results;
  }
}
