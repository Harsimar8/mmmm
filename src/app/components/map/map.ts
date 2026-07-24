import { Component,ViewChild, effect} from '@angular/core'
import { CommonModule } from '@angular/common';
import { EditorState } from '../../core/state/EditorState';
import { LeafletMap } from '../leaflet-map/leaflet-map';
import { CesiumMap } from '../cesium-map/cesium-map';
import { ViewMode } from '../../core/models/ViewMode';
import { from } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    LeafletMap,
    CesiumMap
  ],
  templateUrl: './map.html',
  styleUrl: './map.css'
})

export class Map {

    readonly ViewMode = ViewMode;
    @ViewChild(LeafletMap)
private leafletMap?: LeafletMap;

@ViewChild(CesiumMap)
private cesiumMap?: CesiumMap;

    constructor(
        public editorState: EditorState
    ) {
      effect(() => {

    this.editorState.viewMode();

    setTimeout(() => {

        this.leafletMap?.resize();

        this.cesiumMap?.resize();

    });

});
    }

}