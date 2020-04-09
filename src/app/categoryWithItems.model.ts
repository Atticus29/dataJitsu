export class CategoryWithItems {
  // private id: string = "temp";
  // private categoryName: string;
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor(private categoryName: string, private items: string[]) {
   }

   static isEqual(categoryWithItems1, categoryWithItems2){
     let categoryNameMatch = categoryWithItems1.categoryName === categoryWithItems2.categoryName;
     console.log("do category names match in CategoryWithItems? " + categoryNameMatch);
     let categoryWithItemsMatchCounter = 0;
     categoryWithItems1.items.forEach(item =>{
       for(let i=0; i<categoryWithItems2.items.length; i++){
         if(item === categoryWithItems2.items[i]){
           console.log("items detected as equal: " + item + " and " + categoryWithItems2.items[i]);
           categoryWithItemsMatchCounter += 1;
           // return true;
         }
       }
     });
     let equalityStatus = categoryNameMatch && categoryWithItemsMatchCounter==categoryWithItems2.items.length;
     console.log(" equalityStatus is: " + equalityStatus);
     return equalityStatus;
   }

   // static fromForm (jsonObj: any): CategoryWithItems{
     //TODO
     // let detailObj = {};
     // let jsonObjKeys = Object.keys(jsonObj);
     // let jsonObjVals = Object.values(jsonObj);
     // for(let i = 0; i<jsonObjKeys.length; i++){
     //   let parentString = jsonObjKeys[i].split(/\d+/)[0] + 's';
     //   if(parentString !== 'collectionNames'){
     //      detailObj[parentString] ? detailObj[parentString].push(jsonObjVals[i]): detailObj[parentString]=[jsonObjVals[i]];
     //      detailObj[parentString] = detailObj[parentString].sort();
     //   }
     // }
     // // console.log(detailObj);
     // let name = jsonObj.collectionName;
     // let newCollection = new CategoryWithItems(name);
     // newCollection.addDetails(detailObj);
     // return newCollection;
   // }

   static fromDataBase (jsonObj: any): CategoryWithItems{
     // let categoryName = jsonObj.categoryName;
     // let newCategoryWithItems = new CategoryWithItems(categoryName, jsonObj.items);
     // // newCategoryWithItems.setId(jsonObj.id);
     // return newCategoryWithItems;

     return new CategoryWithItems(jsonObj.categoryName, jsonObj.items);
   }

   addItems(newItems: string[]){
     this.items = this.items.concat(newItems);
   }

   // setId(id: string){
   //   this.id = id;
   // }

   updateCategoryName(newName: string){
     this.categoryName = newName;
   }
}
