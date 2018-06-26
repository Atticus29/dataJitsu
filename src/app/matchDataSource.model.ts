import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Match } from './match.model';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, finalize } from 'rxjs/operators';

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
          this.loadingMatches.next(false);
          //TODO the tutorial here https://blog.angular-university.io/angular-material-data-table/ toggled the loading spinner off here, but it seemed to work better below for me?
        })
      )
      .subscribe(matches => {
        let results = this.makeIntoArray(matches);
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
