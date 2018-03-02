import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class D3Service {

  constructor() { }

  loadTable() {
    console.log("got into loadTable call");
    d3.json("https://datajitsu.firebaseio.com/matches", function(data){
      console.log(data);
    })

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
    console.log("got into loadTable");
    d3.csv("./master_grades_lecture.csv", function(data){
      console.log(data[0]);
    });

}
