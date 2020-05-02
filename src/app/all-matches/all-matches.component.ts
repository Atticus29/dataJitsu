import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { MatTableDataSource, MatSort } from '@angular/material';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { tap, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import { ChangeDetectorRef } from '@angular/core';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { TrackerService } from '../tracker.service';
import { D3Service } from '../d3.service';
import { TextTransformationService } from '../text-transformation.service';
import { VideoDataSource } from '../videoDataSource.model';
// import { MatchDataSource } from '../matchDataSource.model';
import { AuthorizationService } from '../authorization.service';
import { User } from '../user.model';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent extends BaseComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  private isLoadingResults: boolean = true;
  private columnsToDisplay = ['rank','weightClass', 'ageClass','athlete1Name', 'athlete2Name', 'gender','tournamentName','location', 'date', 'videoRating', 'annotationRating','annotationsInMatch','videoUrl']; //TODO make this dynamic somehow
  user: any = null;
  constructor(private authService: AuthorizationService, private d3Service: D3Service, private dbService: DatabaseService, private textTransformationService: TextTransformationService, private dataSource: VideoDataSource, private cdr: ChangeDetectorRef, private router: Router, private trackerService: TrackerService, public ngZone: NgZone) {
    super();
  }

  async ngOnInit() {
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user=>{
      this.user = user;
      if(user && user.uid){
        this.dbService.getUserByUid(user.uid).pipe(takeUntil(this.ngUnsubscribe)).subscribe(dbUser =>{
          if(dbUser.privileges.isAdmin || dbUser.privileges.canViewAllMatches || dbUser.paidStatus){
          } else{
            this.ngZone.run(() =>{
              this.router.navigate(['landing']);
            });
          }
          if(dbUser.privileges.isAdmin && !this.columnsToDisplay.includes('deleteMatch')){
            this.columnsToDisplay.push('deleteMatch');
          }
        });
      } else{
        // alert("didn't get a uid in all-matches");
      }
    });
    this.dataSource = new VideoDataSource(this.dbService);
    this.dataSource.data = await this.dataSource.loadMatches();
    console.log("dataSource:");
    console.log(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.data) {
      this.isLoadingResults = false;
    }
  }

  applyFilter(filterValue: string) {
    // console.log("got into applyFilter");
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      // console.log("paginator exists");
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(){
  }

  deleteMatch(videoId: any){
    let confirmation = confirm("Are you sure you want to delete this match?");
    if(confirmation){
      this.dbService.deleteMatch(videoId);
    } else{
      // console.log("confirmation denied");
    }
  }
}
