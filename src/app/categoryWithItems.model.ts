export class CategoryWithItems {
  // public id: string = "temp";
  // public categoryName: string;
  // constructor(public tournamentName: string, public location: string, public date: string, public athlete1Name: string, public athlete2Name: string, public weightClass: string, public rank: string, public videoUrl: string, public gender: string, public giStatus: boolean, public ageClass: string) {
  constructor(public categoryName: string, public items: string[]) {
    // console.log("items going into CategoryWithItems constructor: ");
    // console.log(this.items);
    this.items = this.items.filter((obj) => obj !== "");
    this.items = this.items.filter((obj) => obj !== undefined);
    // console.log("items going out of CategoryWithItems constructor: ");
    // console.log(this.items);
  }

  static isEqual(categoryWithItems1, categoryWithItems2) {
    let equalityStatus: boolean = false;
    let categoryNameMatch: boolean = false;
    if (categoryWithItems1 && categoryWithItems2) {
      if (categoryWithItems1.categoryName && categoryWithItems2.categoryName) {
        categoryNameMatch =
          categoryWithItems1.categoryName === categoryWithItems2.categoryName;
        let itemsCountsMatch: boolean = false;
        if (categoryWithItems1.items && categoryWithItems2.items) {
          itemsCountsMatch =
            categoryWithItems1.items.length == categoryWithItems2.items.length;
          // console.log("do category names match in CategoryWithItems? " + categoryNameMatch);
          let categoryWithItemsMatchCounter = 0;
          categoryWithItems1.items.forEach((item) => {
            for (let i = 0; i < categoryWithItems2.items.length; i++) {
              if (item === categoryWithItems2.items[i]) {
                // console.log("items detected as equal: " + item + " and " + categoryWithItems2.items[i]);
                categoryWithItemsMatchCounter += 1;
                // return true;
              }
            }
          });
          equalityStatus =
            categoryNameMatch &&
            categoryWithItemsMatchCounter == categoryWithItems2.items.length &&
            itemsCountsMatch;
          // console.log(" equalityStatus is: " + equalityStatus);
        } else {
          equalityStatus = categoryNameMatch;
        }
      }
    }
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

  static fromDataBase(jsonObj: any): CategoryWithItems {
    // let categoryName = jsonObj.categoryName;
    // let newCategoryWithItems = new CategoryWithItems(categoryName, jsonObj.items);
    // // newCategoryWithItems.setId(jsonObj.id);
    // return newCategoryWithItems;

    return new CategoryWithItems(jsonObj.categoryName, jsonObj.items);
  }

  addItems(newItems: string[]) {
    // console.log("items going into addItems: ");
    // console.log(newItems);
    let scrubbedItems = newItems.filter((obj) => obj !== "");
    scrubbedItems = scrubbedItems.filter((obj) => obj !== undefined);
    this.items = this.items.concat(scrubbedItems);
    // console.log("items going into addItems: ");
    // console.log(this.items);
  }

  // setId(id: string){
  //   this.id = id;
  // }

  updateCategoryName(newName: string) {
    this.categoryName = newName;
  }
}
