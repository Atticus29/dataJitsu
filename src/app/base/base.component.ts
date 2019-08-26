import { Component, OnDestroy } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { takeUntil, take, last } from 'rxjs/operators';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnDestroy {
  ngUnsubscribe = new Subject<void>();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy(){
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
