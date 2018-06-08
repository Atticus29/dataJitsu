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
                  this.dbService.getMatchesFiltered(matchId, filter, sortDirection, pageIndex, pageSize).pipe(
                    catchError(()=> of([])),
                    finalize(()=>this.loadingMatches.next(false))
                  )
                  .subscribe(matches => {
                    // console.log(matches);
                    let results = [];
                    let json_data = matches;
                    for(var i in json_data){
                      if(json_data[i].matchDeets){
                        // console.log(json_data[i].matchDeets);
                        results.push([i, json_data[i].matchDeets][1]);
                      }
                    }
                    console.log(results);
                    // let matchDeets = matches.map(function(match){
                    //   return match.matchCreated;
                    // });
                    this.matchesSubject.next(results);
                  });
    }
}
