import { Component, OnInit } from '@angular/core';
import { D3Service } from '../d3.service';
import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';
import * as firebase from 'firebase/app';
import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit {
  private tableArr;
  private dataSource;
  private columnsToDisplay;
  private loading = true;
  // myRowData: any;

  constructor(private d3Service: D3Service, private dbService: DatabaseService, private textTransformationService: TextTransformationService) { }

  ngOnInit() {
    this.tableArr = [{ageClass: 'test'}, {ageClass:'test2'}, {ageClass:'test3'}];
    this.dataSource = new MatTableDataSource(this.tableArr);
    this.columnsToDisplay = ['ageClass'];
    let allMatches = this.dbService.getMatches().subscribe(matches => {
      var json_data = matches;
      var results = [];
      for(var i in json_data){
        if(json_data[i].matchDeets){
            results.push([i, json_data[i].matchDeets][1]);
        }
      }

      let rawHeaders = Object.keys(results[0]);
      let headers = rawHeaders.map(header => this.textTransformationService.convertCamelCaseToSentenceCase(header));
      // this.dataSource.push( headers );
      // console.log(results);
      let entries = results.map(function(entry){
        return [entry['ageClass'], entry['annotationRating'], entry['athlete1Name'], entry['athlete2Name'], entry['date'], entry['gender'], entry['giStatus'], entry['location'], entry['matchRating'], entry['rank'], entry['tournamentName'], entry['weightClass']]; //TODO improve and make robust to new columns
      });
      // console.log(entries);
    //   let testArray = rawHeaders.map(function(entry){
    //   return new Array(entry);
    // });
      let test = [rawHeaders].concat(entries);
      // console.log(test);
      // for(var j in result){
      //   // console.log(j);
      //   console.log(result[j]);
      //   let test = JSON.parse(result[j]);
      //   this.dataSource.push(JSON.parse(result[j]));
      // }
      // console.log("got here");
      // console.log(this.dataSource);
      // console.log(rawHeaders);
      // console.log(results);

      // this.myRowData = results;

      // console.log(matches);
      // let parsed = JSON.parse(matches);
      // console.log(parsed);
      // let matchesWithDeets = matches.filter(match => match.matchDeets);
      // console.log(matchesWithDeets);
    })
    // console.log(ref);
  }

}
