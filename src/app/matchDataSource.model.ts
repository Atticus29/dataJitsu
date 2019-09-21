import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject ,  Observable , of } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { Match } from './match.model';
import { DatabaseService } from './database.service';
import { Injectable } from '@angular/core';

@Injectable()
export class MatchDataSource implements DataSource<Match> {

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
          // let localSuccessfulAnnotations =  individualMatchSuccessfulAnnotationsArray;
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
          // results[i].push(localSuccessfulAnnotationsArray[i]);
        }
        // console.log(results);
        // results.push(localSuccessfulAnnotations);
        this.matchesSubject.next(results);
        // console.log("loading done");
        this.loadingMatches.next(false);
        // matches.forEach(match =>{
        //   this.dbService.getSuccessfulAnnotationNamesSortedByStartTime(match.id, 'matches/' + match.id + '/moves/').pipe(take(1)).subscribe(successfulAnnotationsArray =>{
        //     let localSuccessfulAnnotations =  successfulAnnotationsArray;
        //     console.log(localSuccessfulAnnotations);
        //   });
        // });

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
