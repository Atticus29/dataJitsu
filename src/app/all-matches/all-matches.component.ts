import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
// import { DataSource } from '@angular/cdk/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { tap, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';

import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { D3Service } from '../d3.service';
import { TextTransformationService } from '../text-transformation.service';
import { Match } from '../match.model';
// import { MatchDataSource } from '../matchDataSource.model';
import { User } from '../user.model';
import { MatchDetails } from '../matchDetails.model';
import { MoveInVideo } from '../moveInVideo.model';

// export interface MatchData {
//   rank: string;
//   weightClass: string;
//   ageClass: string;
//   athlete1Name: string;
//   athlete2Name: string;
//   gender: string;
//   location: string;
//   date: string; //???
//   matchRating: number;
//   annotationRating: number;
//   videoUrl: string;
// }

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit, OnDestroy {
  private columnsToDisplay = ['rank','weightClass', 'ageClass','athlete1Name', 'athlete2Name', 'gender','tournamentName','location', 'date', 'matchRating', 'annotationRating','videoUrl']; //TODO make this dynamic somehow
  private loading = true;
  private showLoader: any;
  user: any = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private matchCount: number;
  private pageSize: number;
  private dataSource: MatTableDataSource<Match>

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private d3Service: D3Service, private dbService: DatabaseService, private textTransformationService: TextTransformationService, private cdr: ChangeDetectorRef, private router: Router, private trackerService: TrackerService) { }

  ngOnInit() {
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user=>{
      this.user = user;
      if(user && user.uid){
        this.dbService.getUserByUid(user.uid).subscribe(dbUser =>{
          if(dbUser.privileges.isAdmin || dbUser.privileges.canViewAllMatches){
            //can see things
          } else{
            this.router.navigate(['landing']);
          }
          if(dbUser.privileges.isAdmin){
            this.columnsToDisplay.push('deleteMatch');
          }
        });
      } else{
        //Do nothing
      }
    });

    let matchDeets1: MatchDetails = new MatchDetails("IBJJF Worlds", "los angeles, california", new Date().toJSON(), "athlete1", "athlete2", "rooster", "black", "https://www.youtube.com/watch?v=LPj368_plK0&index=183&list=WL", "male", false, "master 1");
    let matchDeets2: MatchDetails = new MatchDetails("ADCC", "los angeles, california", new Date().toJSON(), "mendes", "gracie", "feather", "black", "https://www.youtube.com/watch?v=LPj368_plK0&index=183&list=WL", "male", false, "master 1");
    let move1: MoveInVideo = new MoveInVideo("kimura", "athlete1", "athlete2", 365, 389, 0, "testMachId", true, true, "annotatorId");
    let move2: MoveInVideo = new MoveInVideo("back mount", "athlete1", "athlete2", 350, 363, 4, "testMachId2", false, true, "annotatorId2");
    let moveArray: Array<MoveInVideo> = [move1, move2];
    let now: Date = new Date();
    // let user1: User = new User("testUser", "bob@bob.com","1234567", "black belt", "expert", "sbg", 33, 155, 100, now.toString(), false, "male", now.toString());
    let match1: Match = new Match(matchDeets1, "originalPosterId", moveArray);
    let match2: Match = new Match(matchDeets2, "originalPosterId", moveArray);
    let matchArray: Array<Match> = new Array<Match>();
    matchArray.push(match1);
    matchArray.push(match2);

    this.pageSize = 10;
    this.dataSource = new MatTableDataSource(matchArray);
    // this.dataSource = new MatchDataSource(this.dbService);

    // this.dataSource.loadMatches('test', '', '', 0, this.pageSize);
    this.dbService.getMatchCount().subscribe(results=>{
      this.matchCount = results;
    });
    // this.dataSource.loading$.subscribe(result =>{
    //   this.showLoader = result;
    //   this.cdr.detectChanges();
    // });

    // this.dbService.getMatches().subscribe(results =>{
    //   this.loadMatchesPage();
    // });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // ngAfterViewInit(){
  //   this.paginator.page
  //     .pipe(
  //       tap(()=> this.loadMatchesPage())
  //     )
  //     .subscribe();
  // }

  // loadMatchesPage(){
  //   this.dataSource.loadMatches('TODO', '', 'asc', this.paginator.pageIndex, this.paginator.pageSize);
  // }

  ngOnDestroy(){
    // console.log("onDestroy is called");
    // this.ngUnsubscribe.next();
    // this.ngUnsubscribe.complete();
  }

  deleteMatch(matchId: any){
    let confirmation = confirm("Are you sure you want to delete this match?");
    if(confirmation){
      // console.log("Deleting " + matchId);
      this.dbService.deleteMatch(matchId);
      // this.loadMatchesPage();
    } else{
      // console.log("confirmation denied");
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
