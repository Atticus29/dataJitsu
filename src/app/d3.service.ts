import { Injectable } from "@angular/core";
import * as d3 from "d3";
import { Video } from "../app/video.model";
import { EventInVideo } from "./eventInVideo.model";
import { get, zip } from "lodash";
import { constants } from "../app/constants";
import { match } from "cypress/types/sinon";
import { any } from "cypress/types/bluebird";

@Injectable()
export class D3Service {
  constructor() {}

  extractEventsFromVids(inputData: Video[]): EventInVideo[] {
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
    if (get(options, "filterBySuccess", false)) {
      const successes = inputData.map((event) =>
        get(event, "isSuccessfulAttempt", true)
      );
      console.log("deleteMe successes is: ");
      console.log(successes);
      if (eventNames.length === successes.length) {
        console.log("deleteMe got here a1");
        // just a logic check
        for (let i = 0; i < eventNames.length; i++) {
          console.log("deleteMe got here a2");
          const currentEventName = eventNames[i];
          const currentEventSuccessStatus = successes[i];
          console.log("deleteMe currentEventSuccessStatus is: ");
          console.log(currentEventSuccessStatus);
          if (currentEventSuccessStatus) {
            console.log("deleteMe before is: ");
            console.log(hist[currentEventName]);
            hist[currentEventName] = hist[currentEventName]
              ? hist[currentEventName] + 1
              : 1;
            console.log("deleteMe after is: ");
            console.log(hist[currentEventName]);
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
      currentHistObj["attempts"] = histVals[i];
      returnHist.push(currentHistObj);
      currentHistObj = {};
    } // TODO dry this up!
    return returnHist;
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

  createStackedBarChartV2(
    hist,
    {
      x = (d) => d, // given d in data, returns the (quantitative) x-value
      y = (d, i) => i, // given d in data, returns the (ordinal) y-value
      z = null,
      // z = () => 1, // given d in data, returns the (categorical) z-value
      title = null, // given d in data, returns the title text
      marginTop = 30, // top margin, in pixels
      marginRight = 0, // right margin, in pixels
      marginBottom = 0, // bottom margin, in pixels
      marginLeft = 40, // left margin, in pixels
      width = 640, // outer width, in pixels
      height = 0, // outer height, in pixels
      xType = d3.scaleLinear, // type of x-scale
      xDomain = null, // [xmin, xmax]
      xRange = [marginLeft, width - marginRight], // [left, right]
      yDomain = null, // array of y-values
      yRange = null, // [bottom, top]
      yPadding = 0.1, // amount of y-range to reserve to separate bars
      zDomain = null, // array of z-values
      offset = d3.stackOffsetDiverging, // stack offset method
      order = d3.stackOrderNone, // stack order method
      xFormat = null, // a format specifier string for the x-axis
      xLabel = null, // a label for the x-axis
      colors = d3.schemeTableau10, // array of colors
    } = {}
  ) {
    // Process data
    // this.clearSvg();
    // const events: Array<EventInVideo> = this.extractEventsFromVids(data);
    // let hist = this.tranformDataToHistogram(events, null);
    // const successHist = this.tranformDataToHistogram(events, {
    //   filterBySuccess: true,
    // });
    // hist = this.concatHistsByMatchingKey(
    //   hist,
    //   successHist,
    //   "name",
    //   "count",
    //   "successes"
    // );
    // hist["columns"] = ["name", "count", "successes"]; // TODO make generic if possible
    // console.log("deleteMe got here a6 and hist is: ");
    // console.log(hist);

    // Compute values.
    const X = d3.map(hist, x);
    const Y = d3.map(hist, y);
    const Z = d3.map(hist, z);

    // Compute default y- and z-domains, and unique them.
    if (yDomain === undefined) yDomain = Y;
    if (zDomain === undefined) zDomain = Z;
    yDomain = new d3.InternSet(yDomain);
    zDomain = new d3.InternSet(zDomain);

    // Omit any data not present in the y- and z-domains.
    const I = d3
      .range(X.length)
      .filter((i) => yDomain.has(Y[i]) && zDomain.has(Z[i]));

    // If the height is not specified, derive it from the y-domain.
    if (height === undefined)
      height = yDomain.size * 25 + marginTop + marginBottom;
    if (yRange === undefined) yRange = [height - marginBottom, marginTop];

    // Compute a nested array of series where each series is [[x1, x2], [x1, x2],
    // [x1, x2], …] representing the x-extent of each stacked rect. In addition,
    // each tuple has an i (index) property so that we can refer back to the
    // original data point (data[i]). This code assumes that there is only one
    // data point for a given unique y- and z-value.
    const seriesStep1 = d3
      .stack()
      .keys(zDomain)
      // tslint:disable-next-line:no-shadowed-variable
      .value(([, I]: any, z: any) => {
        return X[I.get(z)];
      })
      .order(order)
      .offset(offset);
    console.log("deleteMe seriesStep1 is: ");
    console.log(seriesStep1);
    const series: any = d3
      .stack()
      .keys(zDomain)
      // tslint:disable-next-line:no-shadowed-variable
      .value(([, I]: any, z: any) => {
        return X[I.get(z)];
      })
      .order(order)
      .offset(offset)(
        d3.rollup(
          I,
          ([i]) => i,
          (i) => Y[i],
          (i) => Z[i]
        )
      )
      .map((s) => s.map((d) => Object.assign(d, { i: d.data[1].get(s.key) })));
    console.log("deleteMe series is: ");
    console.log(series);

    // Compute the default y-domain. Note: diverging stacks can be negative.
    if (xDomain === undefined) xDomain = d3.extent(series.flat(2));

    // Construct scales, axes, and formats.
    const xScale = xType(xDomain, xRange);
    const yScale: any = d3.scaleBand(yDomain, yRange).paddingInner(yPadding);
    const color = d3.scaleOrdinal(zDomain, colors);
    const xAxis = d3.axisTop(xScale).ticks(width / 80, xFormat);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(0);

    // Compute titles.
    if (title === undefined) {
      const formatValue = xScale.tickFormat(100, xFormat);
      title = (i) => `${Y[i]}\n${Z[i]}\n${formatValue(X[i])}`;
    } else {
      const O = d3.map(hist, (d) => d);
      const T = title;
      title = (i) => T(O[i], i, hist);
    }

    const svg = d3
      .create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg
      .append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(xAxis)
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .selectAll(".tick line")
          .clone()
          .attr("y2", height - marginTop - marginBottom)
          .attr("stroke-opacity", 0.1)
      )
      .call((g) =>
        g
          .append("text")
          .attr("x", width - marginRight)
          .attr("y", -22)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text(xLabel)
      );

    const bar = svg
      .append("g")
      .selectAll("g")
      .data(series)
      .join("g")
      .attr("fill", ([{ i }]) => color(Z[i]))
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", ([x1, x2]) => Math.min(xScale(x1), xScale(x2)))
      .attr("y", ({ i }) => yScale(Y[i]))
      .attr("width", ([x1, x2]) => Math.abs(xScale(x1) - xScale(x2)))
      .attr("height", yScale.bandwidth());

    if (title) bar.append("title").text(({ i }) => title(i));

    svg
      .append("g")
      .attr("transform", `translate(${xScale(0)},0)`)
      .call(yAxis);

    return Object.assign(svg.node(), { scales: { color } });
  }

  createStackedBarChart(inputData: Video[], stackKeys) {
    console.log("deleteMe got here v1 and inputData is: ");
    console.log(inputData);
    // console.log("deleteMe got here and stackKeys is: ");
    // console.log(stackKeys);
    this.clearSvg();
    const events: Array<EventInVideo> = this.extractEventsFromVids(inputData);
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
          .scaleOrdinal<string>()
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
        // const mrgin = { top: 0, right: 0, bottom: 0, left: 0 };
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
        // console.log("deleteMe data is: ");
        // console.log(data);
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
          .text((d) => {
            console.log("deleteMe d is: ");
            console.log(d);
            return d.toString();
          });

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
}
