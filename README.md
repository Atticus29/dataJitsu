# Known issues

- [ ] API key is currently public. Reset this.
- [ ] The title in the tab doesn't load
- [ ] If you log out and then try to click on annotate a video, it takes you to the lost page.
- [ ] Video icon not displaying on main window
- [ ] Handle connection errors (e.g., the spinner just keeps going if there's no internet connection)
- [ ] If you reload, the matches don't display on the main page

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
