import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { D3Service } from '../d3.service';
import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';
import * as firebase from 'firebase/app';
import { MatTableDataSource, MatSort, MatPaginator, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { MatchDataSource } from '../matchDataSource.model';
import { AuthorizationService } from '../authorization.service';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { merge } from 'rxjs/observable/merge';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit, OnDestroy, AfterViewInit {
  private dataSource: MatchDataSource;
  private columnsToDisplay = ['rank','weightClass', 'ageClass','athlete1Name', 'athlete2Name', 'gender','tournamentName','location', 'date', 'matchRating', 'videoUrl']; //TODO make this dynamic somehow
  private loading = true;
  user: any = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private matchCount: number;
  private pageSize: number;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private authService: AuthorizationService, private d3Service: D3Service, private dbService: DatabaseService, private textTransformationService: TextTransformationService) { }

  ngOnInit() {
    this.authService.getCurrentUser().takeUntil(this.ngUnsubscribe).subscribe(user=>{
      this.user = user;
    },err=>{
      console.log(err);
    });
    this.pageSize = 10; //TODO increase me to something reasonable
    this.dataSource = new MatchDataSource(this.dbService);
    this.dataSource.loadMatches('test', '', 'asc', 0, this.pageSize);
    this.dbService.getMatchCount().subscribe(results=>{
      this.matchCount = results;
    });
    }

    ngAfterViewInit(){
      this.sort.sortChange.subscribe(()=>{
        this.paginator.pageIndex = 0;
      });

      merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(()=>this.loadMatchesPage())
      )
      .subscribe();
      // this.paginator.page
      //   .pipe(
      //     tap(()=> this.loadMatchesPage())
      //   )
      //   .subscribe();
    }

    loadMatchesPage(){
      this.dataSource.loadMatches('TODO', '', this.sort.direction, this.paginator.pageIndex, this.paginator.pageSize);
    }

    ngOnDestroy(){
      console.log("onDestroy is called");
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
}
