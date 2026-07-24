import { EditorState } from "../../core/state/EditorState";
import { Entity } from "../../core/models/Entity";

export class LeafletSelection {

    constructor(
        private editorState: EditorState
    ) {}

    public select(entity: Entity): void {

        this.editorState.selectedEntity.set(entity);

    }

}