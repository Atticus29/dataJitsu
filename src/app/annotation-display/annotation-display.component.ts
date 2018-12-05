import { Injectable, Component, OnInit, EventEmitter, Output } from '@angular/core';
import {MatTreeNestedDataSource, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { MatIconModule } from '@angular/material';
import {NestedTreeControl} from '@angular/cdk/tree';

import { Subject, of, BehaviorSubject, Observable } from 'rxjs';

import { DatabaseService } from '../database.service';
import { TextTransformationService } from '../text-transformation.service';

import { allCurrentMoves } from '../moves';

import { MoveInVideo } from '../moveInVideo.model';

declare var $:any;

export class FileNode {
  children: FileNode[];
  filename: string;
  type: any;
}

const treeData = JSON.stringify({
Applications: {
  Calendar: 'app',
  Chrome: 'app',
  Webstorm: 'app'
},
Documents: {
  angular: {
    src: {
      compiler: 'ts',
      core: 'ts'
    }
  },
  material2: {
    src: {
      button: 'ts',
      checkbox: 'ts',
      input: 'ts'
    }
  }
},
Downloads: {
  October: 'pdf',
  November: 'pdf',
  Tutorial: 'html'
},
Pictures: {
  'Photo Booth Library': {
    Contents: 'dir',
    Pictures: 'dir'
  },
  Sun: 'png',
  Woods: 'jpg'
}
});

@Injectable()
export class FileDatabase {
  dataChange = new BehaviorSubject<FileNode[]>([]);

  get data(): FileNode[] { return this.dataChange.value; }

  constructor() {
    this.initialize();
  }

  initialize() {
    // Parse the string to json object.
    const dataObject = JSON.parse(treeData);

    // Build the tree nodes from Json object. The result is a list of `FileNode` with nested
    //     file node as children.
    const data = this.buildFileTree(dataObject, 0);

    // Notify the change.
    this.dataChange.next(data);
  }

  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `FileNode`.
   */
  buildFileTree(obj: object, level: number): FileNode[] {
    return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new FileNode();
      node.filename = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.type = value;
        }
      }
      return accumulator.concat(node);
    }, []);
  }
}

@Component({
  selector: 'app-annotation-display',
  templateUrl: './annotation-display.component.html',
  styleUrls: ['./annotation-display.component.scss'],
  providers: [FileDatabase]
})
export class AnnotationDisplayComponent implements OnInit {
  // private treeData = JSON.stringify(allCurrentMoves);
  @Output() moveSelected = new EventEmitter<MoveInVideo>();

  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private moveCategories: string[];
  hasNestedChild = (_: number, nodeData: FileNode) => !nodeData.type;
  // private _getChildren = (node: FileNode) => node.children;
  private _getChildren(node: FileNode): Observable<FileNode[]> {
    const observable = of(node.children);
    return observable;
  };

  constructor(private db: DatabaseService, textTransformationService: TextTransformationService, database: FileDatabase) {
    //TODO fix this after mat-tree SO branch gets resolved
    this.nestedTreeControl = new NestedTreeControl<FileNode>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();

    database.dataChange.subscribe(data =>{
      this.nestedDataSource.data = data;
    });
  }

  ngOnInit() {
    $('.modal').modal();
    let categories = this.db.getMovesKeys().subscribe(results=>{
      this.moveCategories = results;
    });
    let results = this.db.getMoves().subscribe(stuff=>{
      // console.log(stuff);
      for(let index in stuff){
      // console.log(stuff[index].key());
    }
    });
  }

  submitFormAndClose(){
    console.log("got to submitFormAndClose");
    //TODO createMoveInVideo from form submission
    let tempMove = new MoveInVideo('0', 'armbar', 'me', 'you', 1, 2, 0, '12345', true);
    this.moveSelected.emit(tempMove);
    //TODO add some way to resume the youtube player from here...
  }
}
