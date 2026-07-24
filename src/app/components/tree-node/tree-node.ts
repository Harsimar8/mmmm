import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetTreeNode } from '../../core/models/AssetTreeNode';


@Component({
  selector: 'app-tree-node',
  standalone: true,
  imports: [
    CommonModule,
    TreeNode
    
  ],
  templateUrl: './tree-node.html',
  styleUrl: './tree-node.css'
})


export class TreeNode {

  @Input()
  node!: AssetTreeNode;


  @Output()
  assetSelected = new EventEmitter<string>();

 toggle() {
  this.node.expanded = !this.node.expanded;
}

handleClick() {

  if (this.node.assetId) {
    this.assetSelected.emit(this.node.assetId);
  } else {
    this.toggle();
  }

}
  onAssetSelected(id:string){

    this.assetSelected.emit(id);

  }

}