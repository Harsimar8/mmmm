import * as Cesium from "cesium";

import { EditorState } from "../../core/state/EditorState";
import { EntityRepository } from "../../core/services/EntityRepository";

export class CesiumSelection {

    constructor(

        private viewer: Cesium.Viewer,

        private editorState: EditorState,

        private entityRepository: EntityRepository

    ) {}

    selectEntity(
        click: Cesium.ScreenSpaceEventHandler.PositionedEvent
    ): void {

        const picked = this.viewer.scene.pick(click.position);

        if (!Cesium.defined(picked)) {

            this.editorState.selectedEntity.set(null);

            return;

        }

        const pickedEntity = (picked as any).id;

        if (!pickedEntity) {
            return;
        }

        const entity = this.entityRepository
            .all()
            .find(e => e.id === pickedEntity.id);

        if (!entity) {
            return;
        }

        this.editorState.selectedEntity.set(entity);

    }

}