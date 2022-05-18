import { Injectable } from "@angular/core";
import { EventInVideo } from "./eventInVideo.model";
import { get, map, filter, reduce } from "lodash";

@Injectable({
  providedIn: "root",
})
export class DataFormattingService {
  constructor() {}

  tranformDataToHistogram(
    inputData: EventInVideo[],
    options: { appendSuccesses: false }
  ): any[] {
    // console.log("deleteMe inputData are: ");
    // console.log(inputData);
    const eventNames: String[] = map(
      inputData,
      (event) => get(event, "eventName"),
      []
    );
    let successHist = [];
    let successfulEvents: EventInVideo[] = [];
    if (get(options, "appendSuccesses", false)) {
      successfulEvents = filter(
        inputData,
        (event: EventInVideo) => get(event, "isSuccessfulAttempt", true),
        []
      );
      const successfulEventNames = map(
        successfulEvents,
        (event) => get(event, "eventName"),
        []
      );

      console.log("deleteMe successfulEventNames are: ");
      console.log(successfulEventNames);
      successHist = reduce(
        successfulEventNames,
        (memo, eventName) => {
          return { ...memo, [eventName]: (memo[eventName] || 0) + 1 };
        },
        {}
      );
      console.log("deleteMe successHist is: ");
      console.log(successHist);
      // const successfulEventNames = map(
      //   successfulEvents,
      //   (event) => get(event, "eventName"),
      //   []
      // );
    }
    const hist = reduce(
      eventNames,
      (memo, eventName) => {
        return { ...memo, [eventName]: (memo[eventName] || 0) + 1 };
      },
      {}
    );
    const returnHist = reduce(
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
    console.log("deleteMe returnHist is: ");
    console.log(returnHist);
    return returnHist;
  }
}
