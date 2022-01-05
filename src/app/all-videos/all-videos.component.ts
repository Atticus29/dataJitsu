import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  NgZone,
  OnChanges,
} from "@angular/core";
import * as firebase from "firebase/app";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginatorModule } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/table";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { tap, takeUntil } from "rxjs/operators";
import { MatPaginator } from "@angular/material/paginator";
import { ChangeDetectorRef } from "@angular/core";

import { constants } from "../constants";
import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { TrackerService } from "../tracker.service";
import { D3Service } from "../d3.service";
import { TextTransformationService } from "../text-transformation.service";
import { VideoDataSource } from "../videoDataSource.model";
import { Video } from "../video.model";
// import { MatchDataSource } from '../matchDataSource.model';
import { AuthorizationService } from "../authorization.service";
import { User } from "../user.model";

@Component({
  selector: "app-all-videos",
  templateUrl: "./all-videos.component.html",
  styleUrls: ["./all-videos.component.scss"],
})
export class AllVideosComponent
  extends BaseComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  private isLoadingResults: boolean = true;
  // private constants: Object = constants;
  private columnsToDisplay = constants.columnsToDisplay; //TODO make this dynamic somehow
  private dataForD3 = new Array<Video>();
  private dataPresent: boolean = false;
  private visualAnalysisDesired: boolean = false;
  user: any = null;
  constructor(
    private authService: AuthorizationService,
    private d3Service: D3Service,
    private dbService: DatabaseService,
    private textTransformationService: TextTransformationService,
    private dataSource: VideoDataSource,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private trackerService: TrackerService,
    public ngZone: NgZone
  ) {
    super();
    this.dataSource = new VideoDataSource(this.dbService);
  }

  async ngOnInit() {
    this.dataForD3 = new Array<Video>();
    this.dataSource = new VideoDataSource(this.dbService);
    const currentData = await this.dataSource.loadVideos();
    this.dataForD3 = currentData;
    if (currentData && currentData.length > 0 && this.visualAnalysisDesired) {
      this.d3Service.createStackedBarChart(currentData, ["count", "successes"]);
      console.log("deleteMe this happened");
    }
    this.trackerService.currentUserBehaviorSubject
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.user = user;
        if (user && user.uid) {
          this.dbService
            .getUserByUid(user.uid)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((dbUser) => {
              if (
                dbUser.privileges.isAdmin ||
                dbUser.privileges.canViewAllMatches ||
                dbUser.paidStatus
              ) {
              } else {
                this.ngZone.run(() => {
                  this.router.navigate(["landing"]);
                });
              }
              if (
                dbUser.privileges.isAdmin &&
                !this.columnsToDisplay.includes("deleteMatch")
              ) {
                // console.log("adding deleteMatch column...");
                this.columnsToDisplay.push("deleteMatch");
              }
            });
        } else {
          // alert("didn't get a uid in all-matches");
        }
      });
    // this.dataSource.data = await this.dataSource.loadVideos();
    // this.dbService.getVideos()
  }

  changed() {
    this.visualAnalysisDesired = !this.visualAnalysisDesired;
    if (this.visualAnalysisDesired) this.handleD3clearAndDisplay();
    // if (this.visualAnalysisDesired) {
    //   this.question.value = this.question.secondLabel;
    // } else {
    //   this.question.value = this.question.label;
    // }
  }

  applyFilter(filterValue: string) {
    // console.log("got into applyFilter");
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log(this.dataSource.filter);
    if (this.dataSource.paginator) {
      // console.log("paginator exists");
      this.dataSource.paginator.firstPage();
    }
    // console.log("deleteMe data after filtration is: ");
    // console.log(this.dataSource.filteredData);
    // TODO send the d3 service render here with this.dataSource.filteredData
    this.dataForD3 = this.dataSource.filteredData;
    this.handleD3clearAndDisplay();
    // if (this.dataForD3.length > 0) {
    //   console.log("deleteMe got here");
    //   this.dataPresent = true;
    //   this.d3Service.createStackedBarChart(this.dataForD3);
    // } else {
    //   this.d3Service.clearSvg();
    //   this.dataPresent = false;
    // }
  }

  handleD3clearAndDisplay() {
    // console.log(
    //   "deleteMe got here in handleD3clearAndDisplay and this.dataForD3 is: "
    // );
    // console.log(this.dataForD3);
    if (this.dataForD3.length > 0) {
      // console.log("deleteMe got here a1");
      this.dataPresent = true;
      this.d3Service.createStackedBarChart(this.dataForD3, [
        "count",
        "successes",
      ]);
    } else {
      console.log("deleteMe got here a2");
      this.d3Service.clearSvg();
      this.dataPresent = false;
    }
  }

  ngAfterViewInit() {
    console.log("ngAfterViewInit entered");
    this.dataSource.paginator = this.paginator;
    console.log("got past paginator");
    console.log(this.paginator);
    this.dataSource.sort = this.sort;
    console.log("sort is: ");
    console.log(this.sort);
    console.log("got past sort ");
    this.dbService
      .getVideos()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((videoObjs) => {
        console.log("videoObjs is: ");
        console.log(videoObjs);
        let videos: Video[] = Object.values(videoObjs).map(Video.fromJson);
        this.dataSource.data = videos;
        console.log("dataSource:");
        console.log(this.dataSource);
        if (this.paginator == undefined || this.sort == undefined) {
          console.log("Oh crud undefined!");
          this.ngZone.run(() => {
            this.router.navigate([constants.allVideosPathName]);
            // location.reload();
          });
        }
        if (
          this.dataSource.data &&
          this.dataSource.sort &&
          this.dataSource.paginator
        ) {
          console.log("data and everything exists");
          this.isLoadingResults = false;
        }
      });
  }

  deleteMatch(videoId: any) {
    // console.log("deleteMatch in all-matches passing videoId is " + videoId);
    let confirmation = confirm("Are you sure you want to delete this match?");
    if (confirmation) {
      this.dbService.deleteMatch(videoId);
    } else {
      // console.log("confirmation denied");
    }
  }
}
