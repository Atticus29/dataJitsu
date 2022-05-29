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
          const successfulAttempts = get(event, "isSuccessfulAttempt", true);
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
