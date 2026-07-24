import { Component , inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyPanel } from '../property-panel/property-panel';
import { AssetLibraryService } from '../../core/services/AssetLibraryService';
import { EditorState } from '../../core/state/EditorState';
import { TreeNode } from '../tree-node/tree-node';
import { AssetTreeNode } from '../../core/models/AssetTreeNode';

@Component({
  selector: 'app-asset-browser',
  standalone: true,
  imports: [
    CommonModule,
    TreeNode,
    PropertyPanel
  ],
  templateUrl: './asset-browser.html',
  styleUrl: './asset-browser.css'
})
export class AssetBrowser {

  private assetLibrary = inject(AssetLibraryService);
  private editorState = inject(EditorState);

  readonly tree = this.assetLibrary.tree;

  selectAsset(assetId: string): void {

    const asset = this.assetLibrary.getAssetById(assetId);

    if (!asset) {
      return;
    }

    this.editorState.selectedAsset.set(asset);

    console.log('Selected Asset:', asset);
  }
}