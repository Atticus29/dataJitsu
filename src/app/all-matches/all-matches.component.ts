import { Component, OnInit, OnDestroy } from '@angular/core';
import { D3Service } from '../d3.service';
import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';
import * as firebase from 'firebase/app';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatchDataSource } from '../matchDataSource.model';
import { AuthorizationService } from '../authorization.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit, OnDestroy {
  private dataSource: MatchDataSource;
  private columnsToDisplay = ['rank','weightClass', 'ageClass','athlete1Name', 'athlete2Name', 'gender','tournamentName','location', 'date', 'matchRating', 'videoUrl']; //TODO make this dynamic somehow
  private loading = true;
  user: any = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private authService: AuthorizationService, private d3Service: D3Service, private dbService: DatabaseService, private textTransformationService: TextTransformationService) { }

  ngOnInit() {
    console.log("ngOnInit all-matches is called");
    this.authService.getCurrentUser().takeUntil(this.ngUnsubscribe).subscribe(user=>{
      this.user = user;
    },err=>{
      console.log(err);
    });
    this.dataSource = new MatchDataSource(this.dbService);
    this.dataSource.loadMatches('test', '', '');
    }

    ngOnDestroy(){
      this.ngUnsubscribe.next();
      this.ngUnsubscribe.complete();
    }
}
