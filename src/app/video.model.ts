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
  // public eventsInVideo: Array<EventInVideo>;
  constructor(public videoDeets: VideoDetails, public originalPosterId: string, public eventsInVideo: Array<EventInVideo>) {
    this.updateAnnotationStatus(false);
   }
   static fromJson (jsonObj: any): Video{
     let originalPosterId = jsonObj.originalPosterId;
     let moves = null;
     let extractedEventsInVideo = null;
     if(jsonObj.event){
      extractedEventsInVideo = Object.values(jsonObj.eventsInVideo);
     }else{
      extractedEventsInVideo = new Array<EventInVideo>();
     }
     let isAnnotated = jsonObj.isAnnotated? jsonObj.isAnnotated: null;
     let videoRatings = jsonObj.videoRatings? jsonObj.videoRatings: null;
     let videoCreated = jsonObj.videoCreated? jsonObj.videoCreated: null;
     let annotationRatings = jsonObj.annotationRatings? jsonObj.annotationRatings: null;
     let videoDeets = jsonObj.videoDeets? jsonObj.videoDeets: null; //Object.values(jsonObj.videoDeets);
     let id = jsonObj.id? jsonObj.id: null;
     if(videoDeets){
      videoDeets =  VideoDetails.fromJson(videoDeets);
     }
     if(extractedEventsInVideo){
       let tmpMatch = new Video(videoDeets, originalPosterId, extractedEventsInVideo);
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
       if(extractedEventsInVideo){
         tmpMatch.updateMoves(extractedEventsInVideo)
       };
       if(videoCreated){
         tmpMatch.updateMatchCreated(videoCreated)
       };
       return tmpMatch;
     }
   }

   setId(id: string){
     this.id = id;
   }

   updateMatchCreated(videoCreated: string){
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
      console.log("input array is");
      console.log(inputArray);
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let sum = inputArray.reduce(reducer);
      let unroundedAverage = sum / inputArray.length;
      return this.dateCalculationsService.roundToDecimal(unroundedAverage, 2);
    }else{
      return null;
    }
  }

  updateMoves(movesObj: any){
     if(typeof movesObj === 'object'){
       let moves = Object.values(movesObj);
       let movesAsEventsInVideo =  moves.map(EventInVideo.fromJson);
       this.eventsInVideo = movesAsEventsInVideo;
     }else{
       console.log("assuming this is an array?");
       console.log(movesObj);
       let moves = movesObj;
       let movesAsEventsInVideo =  moves.map(EventInVideo.fromJson);
       this.eventsInVideo = movesAsEventsInVideo;
     }
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
