import { Injectable } from "@angular/core";
import * as d3 from "d3";
import { Video } from "../app/video.model";
import { EventInVideo } from "./eventInVideo.model";
import { get, zip } from "lodash";
import { constants } from "../app/constants";
import { match } from "cypress/types/sinon";

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

  tranformDataToHistogram(inputData: EventInVideo[], options: {}): any[] {
    const hist = {};
    const eventNames = inputData.map((event) => get(event, "eventName", ""));
    if (get(options, "filterBySuccess", null)) {
      const successes = inputData.map((event) =>
        get(event, "isSuccessfulAttempt", "")
      );
      if (eventNames.length === successes.length) {
        // just a logic check
        for (let i = 0; i < eventNames.length; i++) {
          const currentEventName = eventNames[i];
          const currentEventSuccessStatus = successes[i];
          if (currentEventSuccessStatus) {
            hist[currentEventName] = hist[currentEventName]
              ? hist[currentEventName] + 1
              : 1;
          }
        }
      }
    } else {
      for (const entry of eventNames) {
        hist[entry] = hist[entry] ? hist[entry] + 1 : 1;
      }
    }
    const returnHist = new Array<any>();
    let currentHistObj = {};
    const histKeys = Object.keys(hist);
    const histVals = Object.values(hist);
    for (let i = 0; i < histKeys.length; i++) {
      currentHistObj["name"] = histKeys[i];
      currentHistObj["count"] = histVals[i];
      returnHist.push(currentHistObj);
      currentHistObj = {};
    } // TODO dry this up!
    return returnHist;
  }

  createStackedBarChart(inputData: Video[], stackKeys) {
    console.log("deleteMe got here v1 and inputData is: ");
    console.log(inputData);
    // console.log("deleteMe got here and stackKeys is: ");
    // console.log(stackKeys);
    this.clearSvg();
    const events: Array<EventInVideo> = this.extractEventsFromVides(inputData);
    let hist = this.tranformDataToHistogram(events, null);
    const successHist = this.tranformDataToHistogram(events, {
      filterBySuccess: true,
    });
    hist = this.concatHistsByMatchingKey(
      hist,
      successHist,
      "name",
      "count",
      "successes"
    );
    hist["columns"] = ["name", "count", "successes"]; // TODO make generic if possible
    console.log("deleteMe got here and hist is: ");
    console.log(hist);

    // console.log("deleteMe got here and success hist is: ");
    // console.log(successHist);
    if (Object.keys(hist).length > 0) {
      const titleText =
        "Histogram of " +
        constants.nameOfEventsUserFacingPlural +
        " in " +
        constants.nameofVideosUserFacingPlural;

      const xAxisLabelText = constants.numOccurrences;
      const svg = d3.select("svg");
      const mrgin = { top: 50, right: 40, bottom: 77, left: 180 };
      const width = +svg.attr("width") - mrgin.left - mrgin.right;
      const height = +svg.attr("height") - mrgin.top - mrgin.bottom;

      const y = d3
        .scaleBand()
        .rangeRound([0, height])
        .paddingInner(0.05)
        .align(0.1);

      const x = d3.scaleLinear().rangeRound([0, width]);

      const render = (data) => {
        data.sort((a, b) => get(b, "count") - get(a, "count"));
        const subgroups = get(data, "columns").slice(1);
        const groups = d3.map(data, (d) => get(d, "name")).keys();
        // console.log("deleteMe got here and data is: ");
        // console.log(data);

        const color = d3
          .scaleOrdinal()
          // .domain(subgroups)
          .range(["#e41a1c", "#377eb8"]); // TODO make generic if possible

        console.log("deleteMe color is: ");
        console.log(color);
        //   // Add X axis
        // const x = d3.scaleBand().domain(groups).range([0, width]).padding(0.2);
        // svg
        //   .append("g")
        //   .attr("transform", "translate(0," + height + ")")
        //   .call(d3.axisBottom(x).tickSizeOuter(0));
        // // Add Y axis
        // const y = d3.scaleLinear().domain([0, 60]).range([height, 0]);
        // svg.append("g").call(d3.axisLeft(y));
        // //stack the data? --> stack per subgroup
        // const stackedData = d3.stack().keys(subgroups)(data);
        // // Show the bars
        // svg
        //   .append("g")
        //   .selectAll("g")
        //   // Enter in the stack data = loop key per key = group per group
        //   .data(stackedData)
        //   .enter()
        //   .append("g")
        //   .attr("fill", function (d) {
        //     return color(d.key);
        //   })
        //   .selectAll("rect")
        //   // enter a second time = loop subgroup per subgroup to add all rectangles
        //   .data(function (d) {
        //     return d;
        //   })
        //   .enter()
        //   .append("rect")
        //   .attr("x", function (d) {
        //     console.log("deleteMe d.data.group is: " + d.data.name);
        //     console.log(typeof d.data.name);
        //     return x(d.data.name);
        //   })
        //   .attr("y", function (d) {
        //     return y(d[1]);
        //   })
        //   .attr("height", function (d) {
        //     return y(d[0]) - y(d[1]);
        //   })
        //   .attr("width", x.bandwidth());

        // console.log("deleteMe groups is: ");
        // console.log(groups);
        // console.log("deleteMe data.columns is: ");
        // console.log(data.columns);
        // console.log("deleteMe got here data before is: ");
        // console.log(data);
        // data = d3.stack().keys(subgroups)(data);
        // console.log("deleteMe got here and data after is: ");
        // console.log(data);
        // data = d3.stack().keys(subgroups)(data);
        // console.log("deleteMe got here and data really after after is: ");
        // console.log(data);
        // tslint:disable-next-line:no-shadowed-variable
        const mrgin = { top: 50, right: 40, bottom: 77, left: 180 };
        const innerWidth = width - mrgin.left - mrgin.right;
        const innerHeight = height - mrgin.top - mrgin.bottom;
        // const xValue = (datum) => +get(datum, [0]);
        const xValue = d3.scaleLinear().rangeRound([0, innerWidth]);
        // const yValue = (datum) => get(datum, ["data", "name"]);
        const yValue = d3
          .scaleBand()
          .rangeRound([0, innerHeight])
          .paddingInner(0.05)
          .align(0.1);
        // const xScale = d3
        //   .scaleLinear()
        //   .domain([0, d3.max(data, (datum) => +get(datum, [0]))])
        //   .range([0, innerWidth]);
        // const yScale = d3
        //   .scaleBand()
        //   .domain(Array.isArray(data) ? data.map((d) => d.name) : data.name)
        //   .range([0, innerHeight])
        //   .padding(0.1);
        const g = svg
          .append("g")
          .attr("transform", `translate(${mrgin.left}, ${mrgin.top})`); // group to add some padding in

        data.sort((a, b) => {
          return b.count - a.count;
        });

        //keys is subgroups, count is total, y is yValue, x is xValue, z is color
        yValue.domain(data.map((d) => d.successes));
        console.log("deleteMe data is: ");
        console.log(data);
        const dataMax: number = Math.max(
          ...data.map((datum: object) => {
            return +get(datum, "count");
          })
        );
        xValue.domain([0, dataMax]).nice();
        color.domain(subgroups);

        g.append("g")
          .selectAll("g")
          .data(d3.stack().keys(subgroups)(data))
          .enter()
          .append("g")
          .attr("fill", (d) => {
            const colorKey = get(d, "key");
            console.log("deleteMe colorKey is: ");
            console.log(colorKey);
            const targetColor = color(colorKey) ? color(colorKey) : "#e41a1c";
            console.log("deleteMe targetColor is: ");
            console.log(targetColor);
            console.log(typeof targetColor);
            return targetColor;
            // return color(d.key);
            // console.log("deleteMe d is: ");
            // console.log(d);
            // console.log(typeof d);
            // return color(colorKey) || "#e41a1c";
          })
          .selectAll("rect")
          .data((d) => d)
          .enter()
          .append("rect")
          .attr("y", (d) => {
            const successes = get(d, ["data", "successes"]);
            return yValue(successes);
          })
          .attr("x", (d) => xValue(d[0]))
          .attr("width", (d) => xValue(d[1]) - xValue(d[0]))
          .attr("heigth", yValue.bandwidth());

        g.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0,0")
          .call(d3.axisLeft(yValue));

        g.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0, " + height + ")")
          .call(d3.axisBottom(xValue).ticks(null, "s"))
          .append("text")
          .attr("y", 2)
          .attr("x", xValue(xValue.ticks().pop()) + 0.5)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("Population")
          .attr("tranform", "translate(" + -width + ",-10");

        const legend = g
          .append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 10)
          .attr("text-anchor", "end")
          .selectAll("g")
          .data(subgroups.slice().reverse())
          .enter()
          .append("g")
          .attr("tranform", (d, i) => "translate(-50," + (300 + i * 20) + ")");

        legend
          .append("rect")
          .attr("x", width - 19)
          .attr("width", 19)
          .attr("height", 19)
          .attr("fill", color);

        legend
          .append("text")
          .attr("x", width - 24)
          .attr("y", 9.5)
          .attr("dy", "0.32em")
          .text((d) => d);

        // const xAxisTickFormat = (number) => {
        //   return number;
        // };
        // d3.format(".3s")(number).replace("G", "B");

        // const xAxis = d3
        //   // .axisBottom(xScale)
        //   .axisBottom(xValue)
        //   .tickFormat(xAxisTickFormat)
        //   .tickSize(-innerHeight);

        // g.append("g")
        //   // .call(d3.axisLeft(yScale))
        //   .call(d3.axisLeft(yValue))
        //   .selectAll(".domain, .tick line")
        //   .remove();

        // const xAxisG = g
        //   .append("g")
        //   .call(xAxis)
        //   .attr("transform", `translate(0, ${innerHeight})`);

        // xAxisG.select(".domain").remove();
        // xAxisG
        //   .append("text")
        //   .attr("class", "axis-label")
        //   .attr("y", 65)
        //   .attr("x", innerWidth / 2)
        //   .attr("fill", "black")
        //   // .attr("fill", (datum) => color(get(datum, "key")))
        //   .text(xAxisLabelText);

        // // svg
        // //   .append("g")
        // //   .selectAll("g")
        // //   // Enter in the stack data = loop key per key = group per group
        // //   .data(stackedData)
        // //   .enter()
        // //   .append("g")
        // //   .attr("fill", function (d) {
        // //     return color(d.key);
        // //   })
        // //   .selectAll("rect")
        // //   // enter a second time = loop subgroup per subgroup to add all rectangles
        // //   .data(function (d) {
        // //     return d;
        // //   })
        // //   .enter()
        // //   .append("rect")
        // //   .attr("x", function (d) {
        // //     console.log("deleteMe d.data.group is: " + d.data.name);
        // //     console.log(typeof d.data.name);
        // //     return x(d.data.name);
        // //   })

        // //Original that works
        // // g.selectAll("rect")
        // //   .data(data)
        // //   .enter()
        // //   .append("rect")
        // //   // .attr("fill", (datum) => color(get(datum, "key")))
        // //   .attr("y", (datum) => yScale(yValue(datum)))
        // //   .attr("width", (datum) => xScale(xValue(datum)))
        // //   .attr("height", yScale.bandwidth());
        // // g.append("text").attr("class", "title").attr("y", -10).text(titleText);

        // //New attempt
        // // const stackedData = d3.stack().keys(subgroups)(data);
        // g.append("g")
        //   .selectAll("g")
        //   // .data(d3.stack().keys(subgroups)(data))
        //   .data(data)
        //   .enter()
        //   .append("g")
        //   .attr("fill", function (d) {
        //     // console.log("deleteMe got here and d is: ");
        //     // console.log(d);
        //     // console.log('deleteMe color(get(d, "key")) is: ');
        //     // console.log(color(get(d, "key")));
        //     return color(get(d, "key"));
        //   })
        //   .selectAll("rect")
        //   .data(function (d) {
        //     // console.log("deleteMe selected rectangles get data d: ");
        //     // console.log(d);
        //     return d;
        //   })
        //   .enter()
        //   .append("rect")
        //   .attr("y", (datum) => {
        //     console.log("deleteMe y is being entered and datum is: ");
        //     console.log(datum);
        //     console.log("deleteMe yValue(datum) is: ");
        //     console.log(yValue(datum));
        //     return yValue(datum);
        //   })
        //   .attr("x", (datum) => {
        //     console.log("deleteMe got here and x datum is: ");
        //     console.log(datum);
        //     console.log("deleteMe xValue(datum) is: ");
        //     console.log(xValue(get(datum, [0])));
        //     // console.log("deleteMe xScale(xValue(datum)) is");
        //     // console.log(xScale(xValue(datum)));
        //     // return xScale(get(datum, [0]));
        //     return xValue(get(datum, [0]));
        //   })
        //   // .attr("width", (datum) => xScale(xValue(datum)))
        //   .attr("width", (datum) =>
        //     xValue(get(datum, [0]) - xValue(get(datum, [1])))
        //   )
        //   // .attr("height", yScale.bandwidth());
        //   .attr("height", yValue.bandwidth());
      };

      render(hist);
    }
  }

  concatHistsByMatchingKey(
    originalHist,
    donorHist,
    matchingKeyName,
    nameOfKeyToBeAdded,
    desiredKeyNameInOriginalHist
  ) {
    for (let i = 0; i < originalHist.length; i++) {
      const currentEvent = originalHist[i];
      const indexInDonor = donorHist
        .map((entry) => entry[matchingKeyName])
        .indexOf(currentEvent[matchingKeyName]);
      if (indexInDonor > -1) {
        originalHist[i][desiredKeyNameInOriginalHist] =
          donorHist[indexInDonor][nameOfKeyToBeAdded];
      } else {
        originalHist[i][desiredKeyNameInOriginalHist] = 0;
      }
    }
    return originalHist;
  }
}
