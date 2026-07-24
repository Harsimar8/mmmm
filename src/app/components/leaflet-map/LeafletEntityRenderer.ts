import * as L from 'leaflet';
import { EditorState } from '../../core/state/EditorState';
import { Entity } from '../../core/models/Entity';
import { LeafletIconFactory } from './LeafletIconFactory';
import { LeafletCoverageRenderer } from './LeafletCoverageRenderer';
import { TeamFilter } from '../../core/models/TeamFilter';
import { TeamFilterService } from '../../core/services/TeamFilterService';
import { Team } from '../../core/types/Team';


export class LeafletEntityRenderer {

  private readonly markers = new Map<string, L.Marker>();
  private readonly labels = new Map<string, L.Tooltip>();
private readonly coverages = new Map<string, L.Layer>();
  constructor(
    private map: L.Map,
    private editorState: EditorState,
    private teamFilterService: TeamFilterService
) {}

  render(entities: Entity[]): void {

    
    // Remove old markers
    this.markers.forEach(marker => marker.remove());

    this.markers.clear();
    this.labels.forEach(label => label.remove());

this.labels.clear();

    this.coverages.forEach(layer => layer.remove());

this.coverages.clear();
   const filter = this.teamFilterService.leafletFilter();
    // Draw all entities
    for (const entity of entities) {

      if (
    (filter === TeamFilter.Blue && entity.team !== Team.Blue) ||
    (filter === TeamFilter.Red && entity.team !== Team.Red)
) {
    continue;
}

          const marker = L.marker(
  [
    entity.position.latitude,
    entity.position.longitude
  ],
  {
    icon:

this.editorState.selectedEntity()?.id === entity.id

    ? LeafletIconFactory.getSelected(

        entity.definition.entityType

      )

    : LeafletIconFactory.get(

        entity.definition.entityType

      ),
    draggable: false
  }
);

marker.bindPopup(entity.definition.name);
marker.bindTooltip(

  `
  <b>${entity.definition.name}</b><br>
  Type: ${entity.definition.entityType}<br>
  Role: ${entity.definition.role}<br>
  Team: ${entity.team}
  `,

  {
    direction: 'top',
    offset: [0, -10]
  }

);

const teamColor =
    entity.team === 'Blue'
        ? '#3B82F6'
        : '#EF4444';

const label = L.tooltip({

    permanent: true,
    direction: 'bottom',
    offset: [0, 18],
    className: 'entity-label'

})
.setLatLng([
    entity.position.latitude,
    entity.position.longitude
])
.setContent(`
<span class="team-dot" style="background:${teamColor};"></span>
${entity.definition.name}
`);
label.addTo(this.map);
this.labels.set(entity.id, label);
marker.on('click', () => {

  this.editorState.selectedEntity.set(entity);

  // this.highlight(entity.id);

});

marker.on('dragend', (event) => {

  const position = event.target.getLatLng();

  entity.position.latitude = position.lat;

  entity.position.longitude = position.lng;

  console.log("Entity moved:", entity);

});
marker.addTo(this.map);

// Change the type of markers map to L.Layer
this.markers.set(entity.id, marker);

const coverage = LeafletCoverageRenderer.render(
    this.map,
    entity
);

if (coverage) {

    this.coverages.set(entity.id, coverage);

}

    }

  }

  


}