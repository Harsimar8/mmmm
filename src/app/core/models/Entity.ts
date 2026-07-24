import { AssetDefinition } from './AssetDefinition';
import { Position } from './Position';
import { Team } from '../types/Team';

export interface Entity {

    id: string;

    definition: AssetDefinition;

    position: Position;

    team: Team;

}