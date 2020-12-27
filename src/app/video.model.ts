import { VideoDetails } from './videoDetails.model';
import { EventInVideo } from './eventInVideo.model';
import { DateCalculationsService } from './date-calculations.service';
// import { User } from './user.model';

export class Video {
  private isAnnotated: boolean;
  private videoRatings: number[];
  private videoRating: number = 0;
  private annotationRatings: number[];
  private annotationRating: number = 0;
  private videoCreated: string;
  private id: string;
  private dateCalculationsService: DateCalculationsService = new DateCalculationsService();
  private eventsAsCommaDelimitedString: string = null;
  // public eventsInVideo: Array<EventInVideo>;
  constructor(public videoDeets: VideoDetails, public originalPosterId: string, public eventsInVideo: Array<EventInVideo>) {
    this.updateAnnotationStatus(false);
   }

   static fromJson (jsonObj: any): Video{
     // console.log("Video.fromJson entered. jsonObj is:");
     // console.log(jsonObj);
     let originalPosterId = jsonObj.originalPosterId;
     // console.log("originalPosterId is: " + originalPosterId);
     let moves = null;
     let extractedEventsInVideo = null;
     if(jsonObj.events){
       // console.log("got here a");
      extractedEventsInVideo = Object.values(jsonObj.events);
     }else{
      // console.log("got here b");
      extractedEventsInVideo = new Array<EventInVideo>();
     }
     let isAnnotated = jsonObj.isAnnotated? jsonObj.isAnnotated: null;
     let videoRatings = jsonObj.videoRatings? jsonObj.videoRatings: null;
     let videoCreated = jsonObj.videoCreated? jsonObj.videoCreated: null;
     let annotationRatings = jsonObj.annotationRatings? jsonObj.annotationRatings: null;
     // let videoDeets = jsonObj.videoDeets? jsonObj.videoDeets: null; //Object.values(jsonObj.videoDeets);
     let id = jsonObj.id? jsonObj.id: null;
     let videoDeets: VideoDetails =  VideoDetails.fromJson(jsonObj);
     // console.log("videoDeets are:");
     // console.log(videoDeets);

     if(extractedEventsInVideo && videoDeets && originalPosterId){
       // console.log("got here");
       let tmpMatch = new Video(videoDeets, originalPosterId, extractedEventsInVideo);
       tmpMatch.updateEvents(extractedEventsInVideo)
       if(id){
         tmpMatch.setId(id);
       }
       if(isAnnotated){
         tmpMatch.updateAnnotationStatus(isAnnotated)
       };
       if(annotationRatings){
         tmpMatch.updateAnnotationRatings(annotationRatings);
       }
       if(videoRatings){
         tmpMatch.updateMatchRatings(videoRatings)
       };
       if(videoCreated){
         tmpMatch.updateVideoCreated(videoCreated)
       };
       return tmpMatch;
     }
   }

   setId(id: string){
     this.id = id;
   }

   updateVideoCreated(videoCreated: string){
     if(typeof videoCreated === 'object'){
       let videoCreatedVals: string[] = Object.values(videoCreated);
       this.videoCreated = videoCreatedVals[0]; //TODO check whether this is working
     }else{
       this.videoCreated = videoCreated;
     }
   }

  addEventToVideo(event: EventInVideo){
    this.eventsInVideo.push(event);
  }

  average(inputArray: number[]){
    if(inputArray){
      // console.log("input array is");
      // console.log(inputArray);
      // const reducer = (accumulator, currentValue) => accumulator + currentValue;
      // let sum = inputArray.reduce((accumulator, currentValue) => accumulator + currentValue);
      // let unroundedAverage = sum / inputArray.length;
      // let unroundedAverage = inputArray.reduce((accumulator, currentValue) => accumulator + currentValue) / inputArray.length;
      // return this.dateCalculationsService.roundToDecimal(unroundedAverage, 2);
      return this.dateCalculationsService.roundToDecimal(inputArray.reduce((accumulator, currentValue) => accumulator + currentValue) / inputArray.length, 2);
    }else{
      return null;
    }
  }

  updateEvents(movesObj: any){
    // console.log("movesObj");
    // console.log(movesObj);
     if(typeof movesObj === 'object'){
       let moves = Object.values(movesObj);
       // console.log("moves");
       // console.log(moves);
       let movesAsEventsInVideo =  moves.map(EventInVideo.fromJson);
       this.eventsInVideo = movesAsEventsInVideo;
       this.updateEventsAsCommaDelimitedString(this.eventsInVideo, true);
     }else{
       // console.log("assuming this is an array?");
       // console.log(movesObj);
       let moves = movesObj;
       // console.log("moves");
       // console.log(moves);
       let movesAsEventsInVideo =  moves.map(EventInVideo.fromJson);
       this.eventsInVideo = movesAsEventsInVideo;
       this.updateEventsAsCommaDelimitedString(this.eventsInVideo, true);
     }
   }

   updateEventsAsCommaDelimitedString(eventsInVideo: EventInVideo[], onlyGetSuccessful: boolean){
     // console.log("eventsInVideo:");
     // console.log(eventsInVideo);
     let eventNames = null;
     if(onlyGetSuccessful){
       // console.log("onlyGetSuccessful ones desired");
       // console.log("unfiltered: " + eventsInVideo.map(x=>x.eventName).length);
       eventNames = eventsInVideo.filter(x=>x.isSuccessfulAttempt == true).map(x=>x.eventName);
       // console.log("filtered: " + eventNames.length);
     } else{
       eventNames = eventsInVideo.map(x=>x.eventName);
     }
     // console.log("eventNames");
     // console.log(eventNames.join(", "));
     this.eventsAsCommaDelimitedString = eventNames.join(", ");
   }

  updateMatchRatings(videoRatingsObj: any){
     if(typeof videoRatingsObj === 'object'){
       let ratings: number[] = Object.values(videoRatingsObj);
       this.videoRatings = ratings;
       // console.log("calling average in updateMatchRatings");
       this.videoRating = this.average(this.videoRatings);
     }else{
       // console.log("assuming this is an array?");
       // console.log(videoRatingsObj);
       let ratings = videoRatingsObj;
       this.videoRatings = ratings;
       // console.log("calling average in updateMatchRatings");
       this.videoRating = this.average(this.videoRatings);
     }
   }

  updateAnnotationStatus(status: boolean){
    this.isAnnotated = status;
  }

  updateAnnotationRatings(annotationRatings){
    this.annotationRatings = Object.values(annotationRatings);
    // console.log(this.annotationRatings);
    if(this.annotationRatings){
      // console.log("calling average in updateAnnotationRatings");
      this.annotationRating = this.average(this.annotationRatings);
    } else{
      this.annotationRating = 0;
    }
  }

  getVideoDetails(){
    // console.log(this.videoDeets);
    return this.videoDeets;
  }

  getOriginalPosterId(){
    return this.originalPosterId;
  }

  getMovesInTheVideo(){
    return this.eventsInVideo;
  }

  addMovesToAnnotation(eventsInVideo: Array<EventInVideo>){
    //TODO flesh out
    this.updateAnnotationStatus(true);
  }

  removeMoveFromAnnotation(timeInitiated: number, timeCompleted: number){
    //TODO flesh out
    let TODOUpdateMe = true;
    this.updateAnnotationStatus(TODOUpdateMe);
  }
}
