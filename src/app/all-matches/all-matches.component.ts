import { Component, OnInit } from '@angular/core';
import { D3Service } from '../d3.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit {

  constructor(private d3Service: D3Service) { }

  ngOnInit() {
    var ref = firebase.database().ref('matches');


    this.d3Service.loadTable();
    // ref.on('value', function(snapshot) {
    //
    //   var data = snapshot.val();
    //   console.log(data);
    //   // draw your d3 vis here using the data
    //
    // });
    // d3.select('svg').firebase(
    // 'https://datajitsu.firebaseio.com/',
    // {
    //     createFunc : function(newData) {
    //         // callback when data is added, maybe we want to add a text element?
    //         return this.append('text').text(newData.val());
    //     },
    //     updateFunc : function(changedData) {
    //         // data was changed, let's change the text
    //         this.text(changedData.val());
    //     }
    // }
    // );

  }

}
