import * as L from 'leaflet';

import { EditorState } from '../../core/state/EditorState';
import { EntityRepository } from '../../core/services/EntityRepository';
import { EntityFactory } from '../../core/factories/EntityFactory';
import { Position } from '../../core/models/Position';
import { Team } from '../../core/types/Team';


export class LeafletPlacement {

    constructor(
        private map: L.Map,
        private editorState: EditorState,
        private entityRepository: EntityRepository
    ) {}

    public onMapClick(
        event: L.LeafletMouseEvent
    ): void {

        const asset = this.editorState.selectedAsset();

        if (!asset) {

            console.log("No asset selected.");

            return;

        }

        const position = new Position(

            event.latlng.lat,

            event.latlng.lng,

            0

        );

        const entity = EntityFactory.create(

            asset,

            position,

            this.editorState.selectedTeam()

        );

        this.entityRepository.add(entity);

        console.log("Entity added:", entity);

    }

}