import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { DynamicFlatNode } from './dynamicFlatNode.model';
/**
 * Database for dynamic data. When expanding a node in the tree, the data source will need to fetch
 * the descendants data from the database.
 */
@Injectable()
export class DynamicDatabase {
  constructor(private dbService: DatabaseService){
  }


  dataMap = new Map<string, string[]>([
  ]);

  rootLevelNodes: string[] = [];

  /** Initial data from database */
  initialData(): DynamicFlatNode[] {
    return this.rootLevelNodes.map(name => new DynamicFlatNode(name, 0, true, false));
  }

  getChildren(node: string): string[] | undefined {
    return this.dataMap.get(node);
  }

  isExpandable(node: string): boolean {
    return this.dataMap.has(node);
  }
}
