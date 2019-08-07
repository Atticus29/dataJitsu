import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { D3Service } from '../d3.service';
import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';
import * as firebase from 'firebase/app';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatchDataSource } from '../matchDataSource.model';
import { AuthorizationService } from '../authorization.service';
import { Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit, OnDestroy, AfterViewInit {
  // private dataSource: MatchDataSource;
  private columnsToDisplay = ['rank','weightClass', 'ageClass','athlete1Name', 'athlete2Name', 'gender','tournamentName','location', 'date', 'matchRating', 'annotationRating','videoUrl']; //TODO make this dynamic somehow
  private loading = true;
  private showLoader: any;
  user: any = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private matchCount: number;
  private pageSize: number;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;

  constructor(private authService: AuthorizationService, private d3Service: D3Service, private dbService: DatabaseService, private textTransformationService: TextTransformationService, private dataSource: MatchDataSource, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.authService.getCurrentUser().pipe(takeUntil(this.ngUnsubscribe)).subscribe(user=>{
      this.user = user;
      this.dbService.getUserByUid(user.uid).subscribe(dbUser =>{
        // console.log(dbUser.isAdmin);
        if(dbUser.isAdmin){
          this.columnsToDisplay.push('deleteMatch');
        }
      });
    },err=>{
      console.log(err);
    });
    this.pageSize = 10; //TODO increase me to something reasonable
    this.dataSource = new MatchDataSource(this.dbService);
    this.dataSource.loadMatches('test', '', '', 0, this.pageSize);
    this.dbService.getMatchCount().subscribe(results=>{
      this.matchCount = results;
    });
    console.log(this.dataSource);
    // this.dataSource.loading$.subscribe(result =>{
    //   console.log(result);
    // });

      this.dataSource.loading$.subscribe(result =>{
        this.showLoader = result;
        this.cdr.detectChanges();
      });
    }

    ngAfterViewInit(){
      this.paginator.page
        .pipe(
          tap(()=> this.loadMatchesPage())
        )
        .subscribe();
    }

    loadMatchesPage(){
      this.dataSource.loadMatches('TODO', '', 'asc', this.paginator.pageIndex, this.paginator.pageSize);
    }

    ngOnDestroy(){
      console.log("onDestroy is called");
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }

    deleteMatch(matchId: any){
      // console.log("entry:");
      // console.log(matchId);
      let confirmation = confirm("Are you sure you want to delete this match?");
      if(confirmation){
        console.log("Deleting " + matchId);
        this.dbService.deleteMatch(matchId);
      } else{
        console.log("confirmation denied");
      }
    }
}
