import { Component, OnInit } from '@angular/core';
import { D3Service } from '../d3.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-all-matches',
  templateUrl: './all-matches.component.html',
  styleUrls: ['./all-matches.component.scss']
})
export class AllMatchesComponent implements OnInit {

  constructor(private d3Service: D3Service) { }

  ngOnInit() {
    var ref = firebase.database().ref('matches');
    // console.log(ref);
  }

}
