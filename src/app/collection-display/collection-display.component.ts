import { Component, OnInit, NgZone } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";

import { BaseComponent } from "../base/base.component";
import { DatabaseService } from "../database.service";
import { Collection } from "../collection.model";
import { constants } from "../constants";

@Component({
  selector: "app-collection-display",
  templateUrl: "./collection-display.component.html",
  styleUrls: ["./collection-display.component.scss"],
})
export class CollectionDisplayComponent
  extends BaseComponent
  implements OnInit
{
  public localCollection: Collection;
  constructor(
    public databaseService: DatabaseService,
    public route: ActivatedRoute,
    public ngZone: NgZone,
    public router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((params) => {
        // console.log(params.collectionId);
        this.databaseService
          .getCollection(params.collectionId)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((collectionResult) => {
            this.localCollection = Collection.fromDataBase(collectionResult);
            // console.log("this.localCollection in collection-display component is: ");
            // console.log(this.localCollection);
          });
      });
  }

  navigateToNewVideo() {
    console.log("navigateToNewVideo clicked");
    this.ngZone.run(() => {
      this.router.navigate([
        constants.collectionsPathName +
          "/" +
          this.localCollection.getId() +
          "/" +
          constants.newVideoPathName,
      ]);
    });
  }
}
