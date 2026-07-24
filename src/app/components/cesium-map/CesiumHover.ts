import * as Cesium from "cesium";

export class CesiumHover {

    private hoveredEntity?: Cesium.Entity;

    constructor(
        private viewer: Cesium.Viewer
    ) {}

    handleMouseMove(
        movement: Cesium.ScreenSpaceEventHandler.MotionEvent
    ): void {

        // Hide previous label
        if (this.hoveredEntity?.label) {

            this.hoveredEntity.label.show =
                new Cesium.ConstantProperty(false);

        }

        this.hoveredEntity = undefined;

        // Pick current object
        const picked = this.viewer.scene.pick(
            movement.endPosition
        );

        if (!Cesium.defined(picked)) {
            return;
        }

        const entity = (picked as any).id as Cesium.Entity;

        if (!entity?.label) {
            return;
        }

        entity.label.show =
            new Cesium.ConstantProperty(true);

        this.hoveredEntity = entity;

    }

}