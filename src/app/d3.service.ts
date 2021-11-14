import { Injectable } from "@angular/core";
import * as d3 from "d3";
import { Video } from "../app/video.model";
import { EventInVideo } from "./eventInVideo.model";
import { get } from "lodash";
import { constants } from "../app/constants";

@Injectable()
export class D3Service {
  constructor() {}

  extractEventsFromVides(inputData: Video[]): EventInVideo[] {
    let allEvents: EventInVideo[] = new Array<EventInVideo>();
    inputData.forEach((video) => {
      allEvents = allEvents.concat(video.getMovesInTheVideo());
    });
    return allEvents;
  }

  clearSvg() {
    const svg = d3.select("svg");
    svg.selectAll("*").remove();
  }

  tranformDataToHistogram(inputData: EventInVideo[]): {} {
    const eventNames = inputData.map((event) => get(event, "eventName", ""));
    // const uniqueEventNames = [...new Set(eventNames)];
    // console.log(
    //   "deleteMe uniqueEventNames length is: " + uniqueEventNames.length
    // );
    const hist = {};
    for (const entry of eventNames) {
      hist[entry] = hist[entry] ? hist[entry] + 1 : 1;
    }
    // console.log("deleteMe hist is: ");
    // console.log(hist);
    const returnHist = new Array<any>();
    let currentHistObj = {};
    const histKeys = Object.keys(hist);
    // console.log("deleteMe histKeys is: ");
    // console.log(histKeys);
    const histVals = Object.values(hist);
    // console.log("deleteMe histVals is: ");
    // console.log(histVals);
    for (let i = 0; i < histKeys.length; i++) {
      currentHistObj["name"] = histKeys[i];
      currentHistObj["count"] = histVals[i];
      // console.log("deleteMe currentHistObj is: ");
      // console.log(currentHistObj);
      returnHist.push(currentHistObj);
      currentHistObj = {};
    } // TODO dry this up!
    // console.log("deleteMe returning: ");
    // console.log(returnHist);
    return returnHist;
  }

  createStackedBarChart(inputData: Video[]) {
    this.clearSvg();
    const events: Array<EventInVideo> = this.extractEventsFromVides(inputData);
    const hist = this.tranformDataToHistogram(events);
    console.log("deleteMe got here and hist is: ");
    console.log(hist);
    if (Object.keys(hist).length > 0) {
      const titleText =
        "Histogram of " +
        constants.nameOfEventsUserFacingPlural +
        " in " +
        constants.nameofVideosUserFacingPlural;

      const xAxisLabelText = constants.numOccurrences;
      const svg = d3.select("svg");
      const width = +svg.attr("width");
      const height = +svg.attr("height");

      const render = (data) => {
        // console.log("deleteMe got here and data is: ");
        // console.log(data);
        const xValue = (datum) => +datum["count"];
        const yValue = (datum) => datum.name;
        const margin = { top: 50, right: 40, bottom: 77, left: 180 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        const xScale = d3
          .scaleLinear()
          .domain([0, d3.max(data, xValue)])
          .range([0, innerWidth]);
        const yScale = d3
          .scaleBand()
          .domain(Array.isArray(data) ? data.map((d) => d.name) : data.name)
          .range([0, innerHeight])
          .padding(0.1);
        const g = svg
          .append("g")
          .attr("transform", `translate(${margin.left}, ${margin.top})`); // group to add some padding in

        const xAxisTickFormat = (number) => {
          return number;
        };
        // d3.format(".3s")(number).replace("G", "B");
        const xAxis = d3
          .axisBottom(xScale)
          .tickFormat(xAxisTickFormat)
          .tickSize(-innerHeight);

        g.append("g")
          .call(d3.axisLeft(yScale))
          .selectAll(".domain, .tick line")
          .remove();

        const xAxisG = g
          .append("g")
          .call(xAxis)
          .attr("transform", `translate(0, ${innerHeight})`);

        xAxisG.select(".domain").remove();
        xAxisG
          .append("text")
          .attr("class", "axis-label")
          .attr("y", 65)
          .attr("x", innerWidth / 2)
          .attr("fill", "black")
          .text(xAxisLabelText);
        g.selectAll("rect")
          .data(data)
          .enter()
          .append("rect")
          .attr("y", (datum) => yScale(yValue(datum)))
          .attr("width", (datum) => xScale(xValue(datum)))
          .attr("height", yScale.bandwidth());

        g.append("text").attr("class", "title").attr("y", -10).text(titleText);
      };

      render(hist);
    }
  }

  //   createStackedBarChart(){
  //     const chart = {
  //     const chartSvg: any = d3.create("svg")
  //       .attr("viewBox", [0, 0, width, height]);

  //   const rect = chartSvg.selectAll("g")
  //     .data(y01z)
  //     .join("g")
  //       .attr("fill", (d, i) => z(i))
  //     .selectAll("rect")
  //     .data(d => d)
  //     .join("rect")
  //       .attr("x", (d, i) => x(i))
  //       .attr("y", height - margin.bottom)
  //       .attr("width", x.bandwidth())
  //       .attr("height", 0);

  //   svg.append("g")
  //       .call(xAxis);

  //   function transitionGrouped() {
  //     y.domain([0, yMax]);

  //     rect.transition()
  //         .duration(500)
  //         .delay((d, i) => i * 20)
  //         .attr("x", (d, i) => x(i) + x.bandwidth() / n * d[2])
  //         .attr("width", x.bandwidth() / n)
  //       .transition()
  //         .attr("y", d => y(d[1] - d[0]))
  //         .attr("height", d => y(0) - y(d[1] - d[0]));
  //   }

  //   function transitionStacked() {
  //     y.domain([0, y1Max]);

  //     rect.transition()
  //         .duration(500)
  //         .delay((d, i) => i * 20)
  //         .attr("y", d => y(d[1]))
  //         .attr("height", d => y(d[0]) - y(d[1]))
  //       .transition()
  //         .attr("x", (d, i) => x(i))
  //         .attr("width", x.bandwidth());
  //   }

  //   function update(layout) {
  //     if (layout === "stacked") transitionStacked();
  //     else transitionGrouped();
  //   }

  //   return Object.assign(svg.node(), {update});
  // }
  // }

  // loadTable() {
  // console.log("got into loadTable call");
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

  // }
}
