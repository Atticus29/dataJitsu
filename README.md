# Integration Testing

DataJitsu implements [Cypress](https://www.cypress.io/) for integration tests.
It implements CI using [CircleCI](https://circleci.com/)

[![CircleCI](https://circleci.com/gh/Atticus29/dataJitsu/tree/master.svg?style=svg)](https://circleci.com/gh/Atticus29/dataJitsu/tree/master)

# Set up

Create a file in the app subdirectory called, api-keys.ts. In it, place the following code.

```
export var masterFirebaseConfig = {
    apiKey: "xxxx",
    authDomain: "xxxx.firebaseapp.com",
    databaseURL: "https://xxxx.firebaseio.com",
    storageBucket: "xxxx.appspot.com",
    messagingSenderId: "xxxx"
  };
```

You can get your on firebase API key and other info. from [here](//@TODO)

Deploy the google cloud functions in the ./functions directory to your own google cloud project, which you'll [need to configure yourself](https://cloud.google.com/functions). It's non-trivial; I am sorry.

Since your cloud function might violate CORS, [set up a cloud service proxy as an api gateway for your cloud functions](https://cloud.google.com/endpoints/docs/openapi/get-started-cloud-run). Really, the only one that needs an endpoint is the deleteUserByEmailAnnotateVideo cloud function. This is also extremely non-trivial, but openapi-functions.yaml file includes in this repository should be a helpful start.

Create a file in the app subdirectory called, secrets.ts. In it, place the following code:

```
// tslint:disable-next-line:eofline
export const deleteUserEndpointUrl = 'https://whateverTheHostOfYourESPv2Is/deleteUserAvByEmail';
```

# DataJitsu

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class/module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
