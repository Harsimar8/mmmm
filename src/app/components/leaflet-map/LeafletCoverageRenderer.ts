import * as L from 'leaflet';

import { Entity } from '../../core/models/Entity';
import {
    CoverageGeometry,
    CoverageType
} from '../../core/geometry/CoverageGeometry';

export class LeafletCoverageRenderer {

    /**
     * Draws the coverage for an entity.
     */
    static render(
        map: L.Map,
        entity: Entity
    ): L.Layer | null {

        const coverageType = CoverageGeometry.getCoverageType(entity);

        switch (coverageType) {

            case CoverageType.Circle:
                return this.drawCircle(map, entity);


            case CoverageType.Dome:
                return this.drawSamCoverage(map, entity);

            case CoverageType.Corridor:
                return null;



            default:
                return null;

        }

    }

    /**
     * Draw radar / AWACS / EW circular coverage.
     */
    private static drawCircle(
        map: L.Map,
        entity: Entity
    ): L.Circle {

        const range = CoverageGeometry.getRange(entity);

        return L.circle(
            [entity.position.latitude, entity.position.longitude],
            {
                radius: range,

                // Smoke Cyan Outline
                color: '#0B6E69',

                weight: 2,

                opacity: 0.9,

                // Smoke Cyan Fill
                fillColor: '#5BC0BE',

                fillOpacity: 0.18,

                interactive: false
            }
        ).addTo(map);

    }


    private static drawSamCoverage(
    map: L.Map,
    entity: Entity
): L.LayerGroup {

    const range = CoverageGeometry.getRange(entity);

    const group = L.layerGroup();

    // Main engagement circle
    L.circle(
        [entity.position.latitude, entity.position.longitude],
        {
           radius: range,

        color: "#5A3D85",

        weight: 2,

        fillColor: "#8B6FB3",

        fillOpacity: 0.18,

        interactive: false
        }
    ).addTo(group);

    // Distance rings
    const rings = 5;

    for (let i = 1; i <= rings; i++) {

        L.circle(
            [entity.position.latitude, entity.position.longitude],
            {
               
        radius: (range / rings) * i,

        color: "#5A3D85",

        weight: 1,

        opacity: 0.8,

        fill: false,

        interactive: false
            }
        ).addTo(group);

    }

    group.addTo(map);

    return group;

}
}