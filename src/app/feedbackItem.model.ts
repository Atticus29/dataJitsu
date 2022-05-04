export class FeedbackItem {
  public userWhoSubmitted: string;
  static fromDataBase(jsonObj: any): FeedbackItem {
    if (jsonObj) {
      const comment = jsonObj.comment;
      const rating = jsonObj.rate;
      const screenshot = jsonObj.screenshot;
      const newFeedbackItem = new FeedbackItem(comment, rating, screenshot);
      newFeedbackItem.setUserWhoSubmitted(jsonObj.userWhoSubmitted);
      return newFeedbackItem;
    } else {
      return null;
    }
  }
  constructor(
    public comment: string,
    public rating: number,
    public screenshot: string
  ) {}

  setUserWhoSubmitted(userId: string) {
    this.userWhoSubmitted = userId;
  }
  getUserWhoSubmitted() {
    return this.userWhoSubmitted;
  }
}
