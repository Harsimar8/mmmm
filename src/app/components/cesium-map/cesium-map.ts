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
      const filter = this.teamFilterService.cesiumFilter();

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
  protected readonly TeamFilter = TeamFilter;

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

        terrain: Cesium.Terrain.fromWorldTerrain(),

        animation: false,
        timeline: false,
        baseLayerPicker: false,
        geocoder: false,
        homeButton: true,
        sceneModePicker: true,
        navigationHelpButton: true,
        fullscreenButton: true,
        infoBox: false,
        selectionIndicator: false,

        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,


        terrainShadows: Cesium.ShadowMode.DISABLED,
      }
    );


    this.viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        78.9629,   // Longitude
        20.5937,   // Latitude
        2500000    // Height (about zoom level 5)
      )
    });
    console.log(
      this.viewer.scene.screenSpaceCameraController.enableZoom
    );
    this.viewer.scene.screenSpaceCameraController.enableZoom = true;
    this.viewer.scene.screenSpaceCameraController.enableRotate = true;
    this.viewer.scene.screenSpaceCameraController.enableTilt = true;
    this.viewer.scene.screenSpaceCameraController.enableTranslate = true;
    this.viewer.scene.screenSpaceCameraController.enableLook = true;



    this.viewer.scene.fog.enabled = false;

    this.viewer.scene.globe.enableLighting = true;

    this.viewer.scene.light = new Cesium.SunLight({
      intensity: 1.6
    });

    this.viewer.scene.globe.depthTestAgainstTerrain = false;
    const buildings = await Cesium.createOsmBuildingsAsync({

      style: new Cesium.Cesium3DTileStyle({

        color: {

          conditions: [

            [
              "${feature['building']} === 'hospital'",
              "color('#F6C8C8',0.95)"
            ],

            [
              "${feature['building']} === 'school'",
              "color('#F2E8B5',0.95)"
            ],

            [
              "${feature['building']} === 'industrial'",
              "color('#B8B8B8',0.95)"
            ],

            [
              "${feature['building']} === 'commercial'",
              "color('#D8D0C4',0.95)"
            ],

            [
              "${feature['building']} === 'retail'",
              "color('#E8DCCB',0.95)"
            ],

            [
              "${feature['building']} === 'office'",
              "color('#DCE3E8',0.95)"
            ],

            [
              "${feature['building']} === 'apartments'",
              "color('#F0E6D9',0.95)"
            ],

            [
              "${feature['building']} === 'house'",
              "color('#EEDBC8',0.95)"
            ],

            [
              "${feature['building']} === 'garage'",
              "color('#BDBDBD',0.95)"
            ],

            [
              "true",
              "color('#ECE7DF',0.95)"
            ]

          ]

        }

      })

    });

    this.viewer.shadows = true;

    buildings.shadows = Cesium.ShadowMode.ENABLED;
    buildings.maximumScreenSpaceError = 64;

    buildings.dynamicScreenSpaceError = true;

    buildings.dynamicScreenSpaceErrorDensity = 0.0025;

    buildings.dynamicScreenSpaceErrorFactor = 10.0;

    buildings.dynamicScreenSpaceErrorHeightFalloff = 0.25;

    buildings.skipLevelOfDetail = true;

    buildings.preloadWhenHidden = false;

    buildings.preloadFlightDestinations = false;



    this.viewer.scene.primitives.add(buildings);
    
    this.viewer.scene.globe.maximumScreenSpaceError = 8;

    this.viewer.resolutionScale = 1.0;

    this.viewer.scene.msaaSamples = 1;
    this.viewer.scene.globe.enableLighting = true;



    const roadDataSource = await Cesium.GeoJsonDataSource.load(
      'assets/data/roads.geojson',
      {
        clampToGround: true
      }
    );


    roadDataSource.entities.values.forEach(entity => {

    if (!entity.polyline) return;

    const highway =
        entity.properties?.['highway']?.getValue();

    // Hide tiny roads for better performance
    if (
        highway === "service" ||
        highway === "track" ||
        highway === "path" ||
        highway === "footway" ||
        highway === "cycleway"
    ) {
        entity.show = false;
        return;
    }

    let width = 2;
    let color = Cesium.Color.LIGHTGRAY;

    switch (highway) {

        case "motorway":
            width = 8;
            color = Cesium.Color.ORANGE;
            break;

        case "trunk":
            width = 7;
            color = Cesium.Color.GOLD;
            break;

        case "primary":
            width = 6;
            color = Cesium.Color.GOLDENROD;
            break;

        case "secondary":
            width = 5;
            color = Cesium.Color.WHITE;
            break;

        case "tertiary":
            width = 4;
            color = Cesium.Color.SILVER;
            break;

        case "residential":
            width = 2;
            color = Cesium.Color.LIGHTGRAY;
            break;
    }

    entity.polyline.width =
        new Cesium.ConstantProperty(width);

    entity.polyline.material =
        new Cesium.ColorMaterialProperty(color);

});
    this.viewer.dataSources.add(roadDataSource);


    const vegetationDataSource = await Cesium.GeoJsonDataSource.load(
      'assets/data/vegetation.geojson',
      {
        clampToGround: true
      }
    );

    vegetationDataSource.entities.values.forEach(entity => {

      if (!entity.polygon) return;

      const landuse =
        entity.properties?.['landuse']?.getValue()

      const natural =
        entity.properties?.['natural']?.getValue()

      const leisure =
        entity.properties?.['leisure']?.getValue()

      let color =
        Cesium.Color.GREEN.withAlpha(0.45);

      if (natural === "wood") {

        color =
          Cesium.Color.DARKGREEN.withAlpha(0.60);

      }

      else if (natural === "scrub") {

        color =
          Cesium.Color.OLIVEDRAB.withAlpha(0.50);

      }

      else if (landuse === "forest") {

        color =
          Cesium.Color.FORESTGREEN.withAlpha(0.55);

      }

      else if (landuse === "grass") {

        color =
          Cesium.Color.LAWNGREEN.withAlpha(0.35);

      }

      else if (landuse === "meadow") {

        color =
          Cesium.Color.YELLOWGREEN.withAlpha(0.35);

      }

      else if (leisure === "park") {

        color =
          Cesium.Color.GREEN.withAlpha(0.30);

      }

      else if (leisure === "garden") {

        color =
          Cesium.Color.SEAGREEN.withAlpha(0.35);

      }

      entity.polygon.material =
        new Cesium.ColorMaterialProperty(color);

      entity.polygon.outline =
        new Cesium.ConstantProperty(false);

    });

    this.viewer.dataSources.add(vegetationDataSource);

    // await this.viewer.zoomTo(buildingDataSource);




    this.renderer = new CesiumEntityRenderer(
      this.viewer,

      this.teamFilterService,
      this.editorState
    );


    this.renderer.render(this.entityRepository.all());

    
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

    // this.hover = new CesiumHover(
    //     this.viewer
    // );



    //     const handler = new Cesium.ScreenSpaceEventHandler(
    //       this.viewer.scene.canvas
    //     );

    const handler = new Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    );

    handler.setInputAction(
      this.handleLeftClick.bind(this),
      Cesium.ScreenSpaceEventType.LEFT_CLICK
    );
    //     handler.setInputAction(

    //       this.handleLeftClick.bind(this),

    //       Cesium.ScreenSpaceEventType.LEFT_CLICK

    //     );
    //     handler.setInputAction(

    //     this.hover.handleMouseMove.bind(this.hover),

    //     Cesium.ScreenSpaceEventType.MOUSE_MOVE

    // );



    this.viewer.camera.moveStart.addEventListener(() => {

      this.startCesiumCameraLoop();

    });

    this.viewer.camera.moveEnd.addEventListener(() => {

      this.stopCesiumCameraLoop();

    });

    // this.viewer.camera.changed.addEventListener(() => {
    //   this.viewer.scene.requestRender();
    // });
    this.viewer.scene.requestRender();
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

  setAllForces() {

    this.teamFilterService.setCesiumFilter(
      TeamFilter.All
    );

  }


  setBlueForces() {

    this.teamFilterService.setCesiumFilter(
      TeamFilter.Blue
    );

  }


  setRedForces() {

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