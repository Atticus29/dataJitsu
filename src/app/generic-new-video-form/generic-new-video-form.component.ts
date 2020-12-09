import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { DatabaseService } from '../database.service';
import { Collection } from '../collection.model';

@Component({
  selector: 'app-generic-new-video-form',
  templateUrl: './generic-new-video-form.component.html',
  styleUrls: ['./generic-new-video-form.component.scss']
})
export class GenericNewVideoFormComponent extends BaseComponent implements OnInit {
  private localCollection: Collection;

  constructor(private databaseService: DatabaseService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.route.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
      console.log(params.collectionId);
      this.databaseService.getCollection(params.collectionId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(collectionResult =>{
        this.localCollection = Collection.fromDataBase(collectionResult);
        console.log("this.localCollection in generic-video-creation component is: ");
        console.log(this.localCollection);
      })
    });
  }

}
