import * as L from 'leaflet';
import { EntityIconFactory } from '../../core/factories/EntityIconFactory';

export class LeafletIconFactory {

    private static normalIcons = new Map<string, L.Icon>();
    private static selectedIcons = new Map<string, L.Icon>();


    static get(entityType: string): L.Icon {

        if (!this.normalIcons.has(entityType)) {

            this.normalIcons.set(

                entityType,

                L.icon({

                    iconUrl: EntityIconFactory.get(entityType),

                    iconSize: [32, 32],

                    iconAnchor: [16, 16],

                    popupAnchor: [0, -16]

                })

            );

        }

        return this.normalIcons.get(entityType)!;

    }


    static getSelected(entityType: string): L.Icon {

    return L.icon({

        iconUrl: EntityIconFactory.get(entityType),

        iconSize: [50, 50],

        iconAnchor: [25, 25],

        popupAnchor: [0, -25],

        className: "selected-marker"

    });

}

}