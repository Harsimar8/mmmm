import { AssetDefinition } from '../models/AssetDefinition';
import { Entity } from '../models/Entity';
import { Position } from '../models/Position';
import { Team } from '../types/Team';

export class EntityFactory {

  static create(
    asset: AssetDefinition,
    position: Position,
      team: Team = Team.Blue
  ): Entity {

    return {

    id: crypto.randomUUID(),

    definition: {

        ...asset,

        properties: structuredClone(asset.properties)

    },

    position,

    team

};

  }

}