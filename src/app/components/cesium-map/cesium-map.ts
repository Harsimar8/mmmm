import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
  effect
} from '@angular/core';

import * as Cesium from 'cesium';
import { CesiumPlacement } from './CesiumPlacement';
import { CesiumEntityRenderer } from "./CesiumEntityRenderer";
import { CesiumHover } from "./CesiumHover";
import { TeamFilter } from '../../core/models/TeamFilter';
import { EntityRepository } from "../../core/services/EntityRepository";
import { EditorState } from '../../core/state/EditorState';
import { TeamFilterService } from '../../core/services/TeamFilterService';
import { MapSyncService } from '../../core/services/MapSync';
import { CesiumSelection } from "./CesiumSelection";

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNzFhZjQzZC0xNGNmLTQyNDAtOTFlMC1jMmEyMDQwOTExNDAiLCJpZCI6NDQyMjYxLCJzdWIiOiJIYXJzaW1hcjA4IiwiaXNzIjoiaHR0cHM6Ly9hcGkuY2VzaXVtLmNvbSIsImF1ZCI6Im1pc3Npb24iLCJpYXQiOjE3ODQwMDU4MjB9.NzxkVB0Hlz8uYySEa5PaSg7bycWumdeeUXiaJgk57XY';
@Component({
  selector: 'app-cesium-map',
  standalone: true,
  imports: [],
  templateUrl: './cesium-map.html',
  styleUrl: './cesium-map.css'
})
export class CesiumMap implements AfterViewInit, OnDestroy {

  constructor() {

    effect(() => {

     const state = this.mapSync.state(); 

      if (!this.viewer) return;


      console.log("CESIUM received:", state);
      if (state.source === 'cesium') {
        return;
      }

      const current = this.viewer.camera.positionCartographic;

      const lat = Cesium.Math.toDegrees(current.latitude);
      const lon = Cesium.Math.toDegrees(current.longitude);

      if (

        Math.abs(lat - state.latitude) > 0.0001 ||

        Math.abs(lon - state.longitude) > 0.0001

      ) {
        this.syncing = true;

        this.viewer.camera.setView({

          destination: Cesium.Cartesian3.fromDegrees(
            state.longitude,
            state.latitude,
            this.mapSync.leafletZoomToHeight(
              state.zoom,
              state.latitude,
              this.viewer.scene.canvas.clientHeight
            )
          )

        });

        clearTimeout(this.syncTimeout);

        this.syncTimeout = setTimeout(() => {

          this.syncing = false;

        }, 100);
      }

    });


   effect(() => {

    const entities = this.entityRepository.all();

    // Make this effect rerun when selection changes
    this.editorState.selectedEntity();

    if (this.renderer) {

        this.renderer.render(entities);

    }

});

  }

  @ViewChild('cesiumContainer', { static: true })
  cesiumContainer!: ElementRef<HTMLDivElement>;

  private viewer!: Cesium.Viewer;
  private readonly mapSync = inject(MapSyncService);
  private renderer!: CesiumEntityRenderer;
  public readonly teamFilterService = inject(TeamFilterService);
  private placement!: CesiumPlacement;
  private hover!: CesiumHover;
  private selection!: CesiumSelection;
  
  private readonly entityRepository = inject(EntityRepository);
  private readonly editorState = inject(EditorState);
 
  private animationFrame?: number;

  private syncing = false;
  private syncTimeout?: ReturnType<typeof setTimeout>;
  private cesiumSyncFrame: number | null = null;

 async ngAfterViewInit(): Promise<void> {

    this.viewer = new Cesium.Viewer(
      this.cesiumContainer.nativeElement,
      {
        terrain: Cesium.Terrain.fromWorldTerrain()
      }
    );
// const buildings = await Cesium.createOsmBuildingsAsync({

//     style: new Cesium.Cesium3DTileStyle({

//         color: {
//             conditions: [

//                 ["${feature['building']} === 'hospital'", "color('#d9d9d9')"],

//                 ["${feature['building']} === 'school'", "color('#d6c8a3')"],

//                 ["${feature['building']} === 'industrial'", "color('#c0c0c0')"],

//                 ["true", "color('#f2f2f2')"]

//             ]
//         }


        
//     })

// });

// this.viewer.scene.globe.enableLighting = true;

// this.viewer.shadows = true;

// this.viewer.shadowMap.enabled = true;
// if (this.viewer.scene.skyAtmosphere) {
//     this.viewer.scene.skyAtmosphere.show = true;
// }
// this.viewer.scene.globe.depthTestAgainstTerrain = true;

// this.viewer.scene.primitives.add(buildings);

// const buildingDataSource = await Cesium.GeoJsonDataSource.load(
//   'assets/data/buildings.geojson',
//   {
//     clampToGround: true
//   }
// );

// this.viewer.dataSources.add(buildingDataSource);

// buildingDataSource.entities.values.forEach(entity => {
//   if (entity.polygon) {
//     entity.polygon.material = new Cesium.ColorMaterialProperty(
//       Cesium.Color.LIGHTGRAY.withAlpha(0.7)
//     );

//     entity.polygon.outline = new Cesium.ConstantProperty(true);

//     entity.polygon.outlineColor = new Cesium.ConstantProperty(
//       Cesium.Color.BLACK
//     );
//   }
// });

// const roadDataSource = await Cesium.GeoJsonDataSource.load(
//   'assets/data/roads.geojson',
//   {
//     clampToGround: true
//   }
// );


// roadDataSource.entities.values.forEach(entity => {
//   if (entity.polyline) {
//     entity.polyline.material = new Cesium.ColorMaterialProperty(
//       Cesium.Color.YELLOW
//     );

//     entity.polyline.width = new Cesium.ConstantProperty(2);
//   }
// });
// this.viewer.dataSources.add(roadDataSource);

this.viewer.camera.setView({
  destination: Cesium.Cartesian3.fromDegrees(
    75.7873,   // Jaipur longitude
    26.9124,   // Jaipur latitude
    1200       // Height in meters (adjust as needed)
  ),
  orientation: {
    heading: Cesium.Math.toRadians(0),
    pitch: Cesium.Math.toRadians(-45),
    roll: 0
  }
});
// await this.viewer.zoomTo(buildingDataSource);




this.renderer = new CesiumEntityRenderer(
    this.viewer,
    
    this.teamFilterService,
    this.editorState
);
    this.placement = new CesiumPlacement(

    this.viewer,

    this.editorState,

    this.entityRepository

);

this.selection = new CesiumSelection(

    this.viewer,

    this.editorState,

    this.entityRepository

);

this.hover = new CesiumHover(
    this.viewer
);

    this.renderer.render(this.entityRepository.all());


    const handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    handler.setInputAction(

      this.handleLeftClick.bind(this),

      Cesium.ScreenSpaceEventType.LEFT_CLICK

    );
    handler.setInputAction(

    this.hover.handleMouseMove.bind(this.hover),

    Cesium.ScreenSpaceEventType.MOUSE_MOVE

);



   this.viewer.camera.moveStart.addEventListener(() => {

    this.startCesiumCameraLoop();

});

this.viewer.camera.moveEnd.addEventListener(() => {

    this.stopCesiumCameraLoop();

});
  }

  private startCesiumCameraLoop(): void {

    if (this.cesiumSyncFrame !== null) {
        return;
    }

    const tick = () => {

        if (!this.viewer || this.syncing) {

            this.cesiumSyncFrame = null;
            return;

        }

        const camera = this.viewer.camera.positionCartographic;

        const latitude = Cesium.Math.toDegrees(camera.latitude);
        const longitude = Cesium.Math.toDegrees(camera.longitude);

        this.mapSync.update({

            latitude,
            longitude,

            zoom: this.mapSync.heightToLeafletZoom(
                camera.height,
                latitude,
                this.viewer.scene.canvas.clientHeight
            ),

            source: 'cesium'

        });

        this.cesiumSyncFrame = requestAnimationFrame(tick);

    };

    this.cesiumSyncFrame = requestAnimationFrame(tick);

}


private stopCesiumCameraLoop(): void {

    if (this.cesiumSyncFrame !== null) {

        cancelAnimationFrame(this.cesiumSyncFrame);

        this.cesiumSyncFrame = null;

    }

}

setAllForces(){

  this.teamFilterService.setCesiumFilter(
      TeamFilter.All
  );

}


setBlueForces(){

  this.teamFilterService.setCesiumFilter(
      TeamFilter.Blue
  );

}


setRedForces(){

  this.teamFilterService.setCesiumFilter(
      TeamFilter.Red
  );

}
 
  private handleLeftClick(
    click: Cesium.ScreenSpaceEventHandler.PositionedEvent
  ): void {

    if (this.editorState.placementMode()) {

      this.placement.placeEntity(click);

    } else {

      this.selection.selectEntity(click);

    }

  }

  public resize(): void {

    this.viewer.resize();

}

  ngOnDestroy(): void {

    this.viewer.destroy();

  }

}