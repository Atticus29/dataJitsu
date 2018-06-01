import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Match } from './match.model';
import { DatabaseService } from './database.service';
import { Observable } from 'rxjs/Observable';

export class MatchDataSource implements DataSource<Match> {

    private lessonsSubject = new BehaviorSubject<Match[]>([]);

    constructor(private dbService: DatabaseService) {}

    connect(collectionViewer: CollectionViewer): Observable<Match[]> {
      //TODO flesh out
    }

    disconnect(collectionViewer: CollectionViewer): void {
      //TODO flesh out
    }

    loadMatches(courseId: number, filter: string,
                sortDirection: string, pageIndex: number, pageSize: number) {
      //TODO flesh out
    }
}
