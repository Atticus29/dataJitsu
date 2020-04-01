import { Component, OnInit } from '@angular/core';

import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { TrackerService } from '../tracker.service';
import { DatabaseService } from '../database.service';
import { Collection } from '../collection.model';

@Component({
  selector: 'app-user-collections-display',
  templateUrl: './user-collections-display.component.html',
  styleUrls: ['./user-collections-display.component.scss']
})
export class UserCollectionsDisplayComponent extends BaseComponent implements OnInit {
  private collections: Collection[] = new Array<Collection>();

  constructor(private trackerService: TrackerService, private databaseService: DatabaseService) {
    super();
  }

  ngOnInit() {
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user =>{
      // console.log("user in UserCollectionsDisplayComponent:");
      // console.log(user);
      if(user){
        if(user.collections){
          Object.keys(user.collections).forEach(collectionId =>{
            this.databaseService.getCollection(collectionId).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
              console.log("result:");
              console.log(result);
              let newCollection = Collection.fromDataBase(result);
              console.log("after typecasting:");
              console.log(newCollection);
              this.collections.push(newCollection);
            });
          });
        }
      }
    });

  }

}
