import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class D3Service {

  constructor() { }

  loadTable() {
    console.log("got into loadTable call");
    // d3.json("https://datajitsu.firebaseio.com/matches", function(data){
    //   console.log(data);
    // });
    // d3.json('https://s3.us-west-2.amazonaws.com/fisher-aws-testproj/experiment1/datajitsu-export.json?response-content-disposition=inline&X-Amz-Security-Token=AgoGb3JpZ2luEGgaCXVzLXdlc3QtMiKAAmT4xqgSgZbqi1aysYIzhm0YUddO1Xi4a5QsJV0X2V1II1xkWGlwNP7f7Ow3KwS6qMShSjSlBdqPR878SbRE8TqaNRt%2FTT71Uok3TSYSxlRxx7wK05ys2J8lI2%2BLidV%2FXPfMbuH1Ftosln2BmanzmdiMFomFYIjk70%2BUtiJORR6%2B1IztleXNf%2FZ1JXIDGZ%2BvDebvh8m3qm22hOXNjgxAP1fQBWnGkSMRz%2Fu2xlvShmCtazyXd7NCbyjG%2BOg8u5YWs5p87remSd8BDrgF9Sf6iZtPzeTgYIGghRSQJfcb%2Fz2Sw6fL%2BLVOQOuwQxRCSWe6eWRY6fbMflz6gZzF7u0uX48qzwIIrv%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgwxNDczNjgzNzgxNDciDIl5JgHErbL%2FRgcUnCqjAnu2toZCQE5fknuMBJHs%2BfAG3ItqdW8VF%2FObGbMuzxd%2BVWmSwtJ7wIk6MQWYpP%2Fhbi6FTzKeXU%2BMW76XQ%2BfOPQp1ylJYdJqlxMt674C6qZ%2BxoqXEt46PVZo5BLZyInSMA68mMr%2B4jOPCDBjeCAfwSwT6cg%2FaAsv%2B2exgUNQMmWGDbVjhOMEYvmE1BsSgCmh6pJKW6Ok601FIEwDaGe4aHlveZJcgFX9oxCo3x1bw3T%2FYquha6pT5VdGfPqMGZiRl199OGoZgy1g1M1hcDkM2%2BOHIV12nz%2FMWizfRvb5zPZ9HVVnfqGmmx3mlJGe0eWSlF6c3TsE7sGpeQHQ5A%2BK9P7xmyVXhEedq8IsORtmkRVIBYRtCr%2BVTknFi8nJhWwYheowOnjCNl47XBQ%3D%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20180427T204510Z&X-Amz-SignedHeaders=host&X-Amz-Expires=299&X-Amz-Credential=ASIAJHGI4HB4QTIQ7XBQ%2F20180427%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Signature=336f162829c985144a4868aa043ed7bcebab36ad78a8ae188dd2f047b823d79c', function(data){
    // console.log(data);
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
    // console.log("got into loadTable");
    // d3.csv("./master_grades_lecture.csv", function(data){
    //   console.log(data[0]);
    // });

  }
}
