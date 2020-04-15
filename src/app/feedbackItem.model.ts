export class FeedbackItem {
  private  userWhoSubmitted: string;
  constructor(public comment: string, public rating: number, public screenshot: string) {
  }

  static fromDataBase (jsonObj: any): FeedbackItem{
    if(jsonObj){
      let comment = jsonObj.comment;
      let rating = jsonObj.rate;
      let screenshot = jsonObj.screenshot;
      let newFeedbackItem = new FeedbackItem(comment, rating, screenshot);
      newFeedbackItem.setUserWhoSubmitted(jsonObj.userWhoSubmitted);
      return newFeedbackItem;
    } else{
      return null;
    }
  }

  setUserWhoSubmitted(userId: string){
    this.userWhoSubmitted = userId;
  }
  getUserWhoSubmitted(){
    return this.userWhoSubmitted;
  }
}
