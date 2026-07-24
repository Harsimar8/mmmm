import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntityRepository } from '../../core/services/EntityRepository';
import { EditorState } from '../../core/state/EditorState';

@Component({
  selector: 'app-property-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './property-panel.html',
  styleUrl: './property-panel.css'
})
export class PropertyPanel {

  constructor(
  public editorState: EditorState,
  private entityRepository: EntityRepository
) {}

  
  exitPlacementMode(): void {

  this.editorState.selectedAsset.set(null);

}

clearSelection(): void {

  this.editorState.selectedEntity.set(null);

}

deleteEntity(): void {

  const entity = this.editorState.selectedEntity();

  if (!entity) {

    return;

  }

  this.entityRepository.remove(entity.id);

  this.editorState.selectedEntity.set(null);

}

}