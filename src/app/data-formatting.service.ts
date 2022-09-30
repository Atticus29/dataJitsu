import { Injectable } from "@angular/core";
import { EventInVideo } from "./eventInVideo.model";
import { get, map, filter, reduce } from "lodash";

export interface Options {
  appendSuccesses?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class DataFormattingService {
  constructor() {}

  removeUnimportantMoves(inputData: EventInVideo[]): EventInVideo[] {
    const movesToOmit = ["Win", "Match Start", "Match End", "Pause"];
    const pointScoringCategories = [
      "Positional Changes That Score Points In Most Rule Sets",
      "Sweeps or Sweep Attempts",
      "Take Downs or Take Down Attempts",
    ];
    // return inputData;
    return filter(
      inputData,
      (event: EventInVideo) => {
        return (
          get(event, "eventCategory") !== "Event Logistics" &&
          !movesToOmit.includes(get(event, "eventName", "").trim()) &&
          // (get(event, "points") > 0 ||
          // pointScoringCategories.includes(get(event, "eventCategory")) //)
          // get(event, "actor") === "Deodara, Dirt"
          // get(event, "actor") === "Hansen, John"
          get(event, "actor") === "Ryan, Gordon"
        );
      },
      []
    );
  }

  tranformDataToHistogram(inputData: EventInVideo[], options?: Options): any[] {
    const eventNames: string[] = map(
      inputData,
      (event) => get(event, "eventName"),
      []
    );
    let successHist: {} = {};
    if (get(options, "appendSuccesses", false)) {
      const successfulEvents: EventInVideo[] = filter(
        inputData,
        (event: EventInVideo) => {
          // const successfulAttempts = get(event, "isSuccessfulAttempt", true);
          return get(event, "isSuccessfulAttempt", true);
        },
        []
      );
      const successfulEventNames: string[] = map(
        successfulEvents,
        (event) => get(event, "eventName"),
        []
      );
      successHist = reduce(
        successfulEventNames,
        (memo: {}, eventName: string) => {
          return { ...memo, [eventName]: (memo[eventName] || 0) + 1 };
        },
        {}
      );
    }
    const hist: {} = reduce(
      eventNames,
      (memo: {}, eventName: string) => {
        return { ...memo, [eventName]: (memo[eventName] || 0) + 1 };
      },
      {}
    );
    const returnHist: [] = reduce(
      hist,
      (memo, value, key) => {
        const currentObj = {
          name: key,
          attempts: value,
          successes: successHist[key] || 0,
        };
        return [...memo, currentObj];
      },
      []
    );
    return returnHist;
  }
}
