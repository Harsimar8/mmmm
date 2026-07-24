import { Component ,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorState } from '../../core/state/EditorState';
import { ViewMode } from '../../core/models/ViewMode';
import { AssetImportService } from '../../core/services/AssetImportService';
import { AssetLibraryService } from '../../core/services/AssetLibraryService';
import { EntityRepository } from '../../core/services/EntityRepository';
import { ScenarioService } from '../../core/services/ScenarioService';
import { FilterService } from '../../core/services/FilterService';
import { Team } from '../../core/types/Team';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.css'
})


export class Toolbar {
   protected readonly Team = Team;

  constructor(
    private assetImportService: AssetImportService,
    public assetLibraryService: AssetLibraryService,
    public editorState: EditorState,
    private entityRepository: EntityRepository,
    private scenarioService: ScenarioService,
    public filterService: FilterService
) {
  

    this.filterService.initialize(
        this.assetLibraryService.entityTypes()
    );

}
 readonly showFilters = signal(false);
  async onFileSelected(event: Event): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

   await this.assetImportService.import(input.files[0]);

console.log(this.assetLibraryService.entityTypes());

this.filterService.initialize(
    this.assetLibraryService.entityTypes()
);

console.log(this.filterService.enabledTypes());
  }

  removeJson(): void {

    this.assetLibraryService.clear();

    console.log("Asset library cleared.");

  }
toggleFilters(): void {

  this.showFilters.update(value => !value);

}
toggleType(type: string): void {

  this.filterService.toggle(type);

}

setBlueTeam(): void {

    this.editorState.selectedTeam.set(Team.Blue);

}

setRedTeam(): void {

    this.editorState.selectedTeam.set(Team.Red);

}
  showSplit(): void {

    this.editorState.viewMode.set(ViewMode.Split);

}

show2D(): void {

    this.editorState.viewMode.set(ViewMode.TwoD);

}

show3D(): void {

    this.editorState.viewMode.set(ViewMode.ThreeD);


}
clearScenario(): void {

    this.entityRepository.clear();

    this.editorState.selectedEntity.set(null);

    this.editorState.selectedAsset.set(null);

    console.log("Scenario cleared.");

}

saveScenario(): void {

    this.scenarioService.saveScenario();

}

loadScenario(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
        return;
    }

    this.scenarioService.loadScenario(input.files[0]);

    input.value = '';

}



}