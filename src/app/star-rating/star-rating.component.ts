import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from "@angular/core";

@Component({
  selector: "app-star-rating",
  templateUrl: "./star-rating.component.html",
  styleUrls: ["./star-rating.component.scss"],
})
export class StarRatingComponent implements OnInit {
  @Input("rating") public rating: number = 3;
  @Input("starCount") public starCount: number = 5;
  @Input("color") public color: string = "accent";
  @Output() public ratingUpdated = new EventEmitter();

  public ratingArr = [];

  constructor() {}

  ngOnInit() {
    // console.log("ngOnInit in star-rating entered"+this.starCount)
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(rating: number) {
    // console.log(rating)
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index: number) {
    if (this.rating >= index + 1) {
      return "star";
    } else {
      return "star_border";
    }
  }
}

export enum StarRatingColor {
  primary = "primary",
  accent = "accent",
  warn = "warn",
}
