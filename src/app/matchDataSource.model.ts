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

  loadMatches(filter = '', sortCol: string, sortDirection='asc', pageIndex: number, pageSize: number) {
    this.loadingMatches.next(true);
    this.dbService.getKeyOfMatchToStartWith(pageIndex, pageSize).subscribe(keyIndex=>{
      this.dbService.getMatchesPaginator(keyIndex, pageSize).pipe(
        catchError(()=> of([])),
        finalize(()=>{
          this.loadingMatches.next(false);
          //TODO the tutorial here https://blog.angular-university.io/angular-material-data-table/ toggled the loading spinner off here, but it seemed to work better below for me?
        })
      )
      .subscribe(matches => {
        let results = this.makeIntoArray(matches);
        results = results.sort(this.sort_array_by(sortCol, false, function(a){ //TODO need to sort before paginating
          return a;
        }));
        this.matchesSubject.next(results);
        this.loadingMatches.next(false);
      });
    });
  }

  sort_array_by = function(field, reverse, pr){
    reverse = (reverse) ? -1 : 1;
    return function(a,b){
      a = a[field];
      b = b[field];
      if (typeof(pr) != 'undefined'){
        a = pr(a);
        b = pr(b);
      }
      if (a<b) return reverse * -1;
      if (a>b) return reverse * 1;
      return 0;
    }
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
