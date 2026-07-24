import * as Cesium from "cesium";
import { Team } from '../../core/types/Team';
import { EditorState } from "../../core/state/EditorState";
import { EntityRepository } from "../../core/services/EntityRepository";
import { EntityFactory } from "../../core/factories/EntityFactory";
import { Position } from "../../core/models/Position";

export class CesiumPlacement {

    constructor(

        private viewer: Cesium.Viewer,

        private editorState: EditorState,

        private entityRepository: EntityRepository

    ) {}

    placeEntity(
        click: Cesium.ScreenSpaceEventHandler.PositionedEvent
    ): void {

        const asset = this.editorState.selectedAsset();

        if (!asset) {

            console.log("No asset selected.");

            return;

        }

        const cartesian = this.viewer.scene.pickPosition(
            click.position
        );

        if (!cartesian) {
            return;
        }

        const cartographic =
            Cesium.Cartographic.fromCartesian(cartesian);

        const position = new Position(

            Cesium.Math.toDegrees(cartographic.latitude),

            Cesium.Math.toDegrees(cartographic.longitude),

            cartographic.height

        );

        const entity = EntityFactory.create(

            asset,

            position,

            this.editorState.selectedTeam()

        );

        this.entityRepository.add(entity);

        

        this.editorState.selectedAsset.set(null);

    }

}