import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject ,  Observable , of } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { Match } from './match.model';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';

@Injectable()
export class VideoDataSource implements DataSource<Match> {

  private matchesSubject = new BehaviorSubject<Match[]>([]);
  private loadingMatches = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingMatches.asObservable();

  constructor(private dbService: DatabaseService) {}

  connect(collectionViewer: CollectionViewer): Observable<Match[]> {
    return this.matchesSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.matchesSubject.complete();
    this.loadingMatches.complete();
  }

  filterPredicate(data: any, filter: string){
      const accumulator = (currentTerm, key) => {
        return this.accumulateNestedObjectContentsInSearch(currentTerm, data, key);
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
  }

  sortingDataAccessor(item: any, property: string){
      // console.log("sortingDataAccestor entered");
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

  accumulateNestedObjectContentsInSearch(search, data, key) {
    console.log("search is: " + search);
    console.log("data is:");
    console.log(data);
    console.log("key is " + key);
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
        }
      }
    }
  }

  loadMatches(matchId: string, filter = '',
  sortDirection='asc', pageIndex: number, pageSize: number) {
    this.loadingMatches.next(true);
    this.dbService.getKeyOfMatchToStartWith(pageIndex, pageSize).subscribe(keyIndex=>{
      this.dbService.getMatchesFilteredPaginator(keyIndex, pageSize).pipe(
        catchError(()=> of([])),
        finalize(()=>{
          //TODO the tutorial here https://blog.angular-university.io/angular-material-data-table/ toggled the loading spinner off here, but it seemed to work better below for me?
        })
      )
      .subscribe(matches => {
        // console.log("matches in loadMatches:");
        let matchObjKeys = Object.keys(matches);
        let localSuccessfulAnnotationsArray = new Array<string>();
        matchObjKeys.forEach(keyId =>{
          this.dbService.getSuccessfulAnnotationNamesSortedByStartTime(keyId, 'matches/' + keyId + '/moves/').pipe(take(1)).subscribe(individualMatchSuccessfulAnnotationsArray =>{
          localSuccessfulAnnotationsArray.push(individualMatchSuccessfulAnnotationsArray);
          // console.log(localSuccessfulAnnotations);
          });
        });
        let results = this.makeIntoArray(matches);
        for(let i=0; i<results.length; i++){
          // console.log(results[i]);
          let movesObj = {moves: localSuccessfulAnnotationsArray[i]};
          // console.log(movesObj);
          results[i] = Object.assign(movesObj, results[i]);
        }
        // console.log(results);
        this.matchesSubject.next(results);
        this.loadingMatches.next(false);

      });
    });
  }

  makeIntoArray(matches: any){
    let results = []; //TODO there should be a way to tighten the below up
    for(var i in matches){
      let obj1 = {id:matches[i].id};
      if(matches[i].matchDeets){
        let obj2 = matches[i].matchDeets;
        obj1 = Object.assign({}, obj1, obj2);
      }
      results.push(obj1);
    }
    // console.log(results);
    return results;
  }
}
