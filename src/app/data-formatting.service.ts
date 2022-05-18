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
    const eventNames: String[] = map(
      inputData,
      (event) => get(event, "eventName"),
      []
    );
    let successHist: {} = {};
    if (get(options, "appendSuccesses", false)) {
      const successfulEvents: EventInVideo[] = filter(
        inputData,
        (event: EventInVideo) => get(event, "isSuccessfulAttempt", true),
        []
      );
      const successfulEventNames: String[] = map(
        successfulEvents,
        (event) => get(event, "eventName"),
        []
      );
      successHist = reduce(
        successfulEventNames,
        (memo, eventName) => {
          return { ...memo, [eventName]: (memo[eventName] || 0) + 1 };
        },
        {}
      );
    }
    const hist: {} = reduce(
      eventNames,
      (memo, eventName) => {
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
