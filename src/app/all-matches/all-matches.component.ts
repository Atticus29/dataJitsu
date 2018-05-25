import { Component, OnInit } from '@angular/core';
import { D3Service } from '../d3.service';
import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit {

  constructor(private d3Service: D3Service, private dbService: DatabaseService, private textTransformationService: TextTransformationService) { }

  ngOnInit() {
    let allMatches = this.dbService.getMatches().subscribe(matches => {
      var json_data = matches;
      var result = [];
      for(var i in json_data){
        if(json_data[i].matchDeets){
            result.push([i, json_data[i].matchDeets][1]);
        }
      }
      let headers = Object.keys(result[0]).map(header => this.textTransformationService.convertCamelCaseToSentenceCase(header));
      console.log(headers);

      // console.log(matches);
      // let parsed = JSON.parse(matches);
      // console.log(parsed);
      // let matchesWithDeets = matches.filter(match => match.matchDeets);
      // console.log(matchesWithDeets);
    })
    // console.log(ref);
  }

}
