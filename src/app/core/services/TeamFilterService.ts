import { Injectable, signal } from '@angular/core';
import { TeamFilter } from '../models/TeamFilter';

@Injectable({
    providedIn: 'root'
})
export class TeamFilterService {

    readonly leafletFilter =
        signal<TeamFilter>(TeamFilter.All);

    readonly cesiumFilter =
        signal<TeamFilter>(TeamFilter.All);

    setLeafletFilter(filter: TeamFilter): void {

        this.leafletFilter.set(filter);

    }

    setCesiumFilter(filter: TeamFilter): void {

        this.cesiumFilter.set(filter);

    }





    
}