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
  private isAdmin: boolean = false;
  private localUser: any;

  constructor(private trackerService: TrackerService, private databaseService: DatabaseService) {
    super();
  }

  ngOnInit() {
    this.trackerService.currentUserBehaviorSubject.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user =>{
      // console.log("user in UserCollectionsDisplayComponent:");
      user ? this.isAdmin = user.privileges.isAdmin: this.isAdmin = false;
      user ? this.localUser = user: this.localUser = null;
      // console.log(user);
      if(user){
        // this.localUser = user;
        if(user.id){
          this.databaseService.getCollections(user.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result =>{
            console.log("result:");
            console.log(result);
            this.collections = result;
          });
        }
      }
    });
  }

  removeCollection(collection: Collection, user: any){
    let confirmation = confirm("Are you sure you want to delete collection: " + collection.getName() + "?");
    if(confirmation){
      this.databaseService.deleteCollection(collection, user);
      //TODO decide whether any points should be awarded here. I'm currently thinking no
    }
  }

}
