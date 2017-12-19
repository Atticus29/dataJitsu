import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  providers: [DatabaseService]
})
export class CreateAccountComponent implements OnInit {
  title: string = "Create an Account";

  constructor(private db: DatabaseService) { }

  ngOnInit() {
  }

}
