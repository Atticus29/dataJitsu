import { CategoryWithItems } from './categoryWithItems.model';
import { FormQuestionBase } from './formQuestionBase.model';

export class Collection {
  private details: Object;
  private id: string = "temp";
  private categoriesWithItems: CategoryWithItems[] = new Array<CategoryWithItems>();
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor(private name: string) {
   }

   static fromForm (jsonObj: any, questions: FormQuestionBase<string>[]): Collection{
     // console.log("fromForm in Collection model entered");
     // console.log(jsonObj);
     // console.log(questions);
     let name = jsonObj.collectionName;
     let newCollection = new Collection(name);
     let detailObj = {};
     let jsonObjKeys = Object.keys(jsonObj);
     let jsonObjVals = Object.values(jsonObj);
     let currentItemArray:string[] = new Array<string>();
     let currentCategoryWithItems = new CategoryWithItems('temp', []);
     for(let i = 0; i<questions.length; i++){
       // console.log("i is " + i);
       let baseKey: string = questions[i].key.split(/\d+/)[0];
       // console.log("baseKey is " + baseKey);
       if(baseKey === "categoryName"){
         // console.log("entered categoryName branch")
         if(currentItemArray.length>0){
           // console.log("currentItemArray should not be empty here:");
           // console.log(currentItemArray);
           currentCategoryWithItems.addItems(currentItemArray);
           // console.log("maybe items added to currentCategoryWithItems?");
           // console.log(currentCategoryWithItems);
           newCollection.addCategoryWithItems(currentCategoryWithItems);
           // console.log("maybe categoryWithItems added to newCollection?");
           // console.log(newCollection);
         }
         currentItemArray = new Array<string>();
         currentCategoryWithItems = new CategoryWithItems(jsonObj[questions[i].key],[]);
       }
       if(baseKey === "itemName"){
         // console.log("got into itemName");
         // console.log("adding the following item name: " + jsonObj[questions[i].key]);
         currentItemArray.push(jsonObj[questions[i].key]);
         // console.log("currentItemArray is:");
         // console.log(currentItemArray);
         if(i==questions.length-1){
           //this is the last itemNameSet
           currentCategoryWithItems.addItems(currentItemArray);
           // console.log("maybe items added to currentCategoryWithItems?");
           // console.log(currentCategoryWithItems);
           newCollection.addCategoryWithItems(currentCategoryWithItems);
           // console.log("maybe categoryWithItems added to newCollection?");
           // console.log(newCollection);
         }
       }
       if(baseKey !== 'collectionName' && baseKey !== 'categoryName' && baseKey !== 'itemName'){
          // console.log("shouldn't get here for now");
          detailObj[baseKey] ? detailObj[baseKey].push(jsonObjVals[i]): detailObj[baseKey]=[jsonObjVals[i]];
          detailObj[baseKey] = detailObj[baseKey].sort();
       }
     }
     // console.log(detailObj);
     newCollection.addDetails(detailObj);
     // newCollection.addCategoriesWithItems(jsonObj.categoriesWithItems);
     console.log("returning this collection:");
     console.log(newCollection);
     return newCollection;
   }

   addCategoriesWithItems(newCategoriesWithItems: CategoryWithItems[]){
     this.categoriesWithItems = this.categoriesWithItems.concat(newCategoriesWithItems);
   }

   addCategoryWithItems(newCategoryWithItems: CategoryWithItems){
     this.categoriesWithItems.push(newCategoryWithItems);
   }

   static fromDataBase (jsonObj: any): Collection{
     let name = jsonObj.name;
     let newCollection = new Collection(name);
     newCollection.addDetails(jsonObj.details);
     newCollection.setId(jsonObj.id);
     newCollection.addCategoriesWithItems(jsonObj.categoriesWithItems);
     return newCollection;
   }

   static isEqual(collection1: Collection, collection2: Collection){
     console.log("isEqual from collection entered");
     let nameMatch = collection1.name === collection2.name;
     let categoriesWithItemsCountsMatch = collection1.categoriesWithItems.length == collection2.categoriesWithItems.length
     // console.log("do collection names match? " + nameMatch);
     let categoriesWithItemsMatchCounter = 0;
     collection1.categoriesWithItems.forEach(categoryWithItems =>{
       for (let i=0; i<collection2.categoriesWithItems.length; i++){
         if(CategoryWithItems.isEqual(categoryWithItems, collection2.categoriesWithItems[i])){
           console.log("CategoryWithItems match at:");
           console.log(categoryWithItems);
           console.log("and");
           console.log(collection2.categoriesWithItems[i]);
           categoriesWithItemsMatchCounter += 1;
           // return true;
         }
       }
     });
     let equalityStatus = nameMatch && categoriesWithItemsMatchCounter== collection2.categoriesWithItems.length && categoriesWithItemsCountsMatch;
     console.log(" equalityStatus for collection is: " + equalityStatus);
     return equalityStatus;
   }

   addDetails(detailsObj: Object){
     this.details= detailsObj;
   }

   setId(id: string){
     this.id = id;
   }

   updateName(newName: string){
     this.name = newName;
   }

}
