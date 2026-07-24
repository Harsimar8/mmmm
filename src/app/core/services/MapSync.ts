import { Injectable, signal } from '@angular/core';
import { MapViewState } from '../models/MapViewState';


@Injectable({
  providedIn: 'root'
})
export class MapSyncService {

  private readonly viewState = signal<MapViewState>({

    latitude: 20,

    longitude: 78,

    zoom: 5,

    source: 'leaflet'

  });

  readonly state = this.viewState.asReadonly();


  private readonly earthCircumference = 40075016.686;

private readonly tileSize = 256;

private readonly cesiumFov = Math.PI / 3;
  update(view: MapViewState): void {

    this.viewState.set(view);

  }

  leafletZoomToHeight(
    zoom: number,
    latitude: number,
    viewportHeight: number
): number {

    const latitudeRadians =
        latitude * Math.PI / 180;

    const resolution =
        (this.earthCircumference * Math.cos(latitudeRadians)) /
        (this.tileSize * Math.pow(2, zoom));

    const visibleMeters =
        resolution * viewportHeight;

    return visibleMeters /
        (2 * Math.tan(this.cesiumFov / 2));

}

  heightToLeafletZoom(
    height: number,
    latitude: number,
    viewportHeight: number
): number {

    const latitudeRadians =
        latitude * Math.PI / 180;

    const visibleMeters =
        2 * height * Math.tan(this.cesiumFov / 2);

    const resolution =
        visibleMeters / viewportHeight;

    return Math.log2(
        (this.earthCircumference * Math.cos(latitudeRadians)) /
        (resolution * this.tileSize)
    );

}

}