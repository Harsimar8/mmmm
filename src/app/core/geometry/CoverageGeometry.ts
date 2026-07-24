import { Entity } from '../models/Entity';

export enum CoverageType {

  None = 'None',

  Circle = 'Circle',

  Dome = 'Dome',

  Corridor = 'Corridor'

}

export class CoverageGeometry {

  /**
   * Returns the type of coverage an entity should have.
   */
  static getCoverageType(entity: Entity): CoverageType {
   
    switch (entity.definition.entityType) {

      case 'RadarSite':
      case 'AWACS':
        return CoverageType.Circle;

      case 'SAMBattery':
    return CoverageType.Dome;

      case 'ElectronicWarfare':
        return CoverageType.Circle;

      case 'Missile':
        return CoverageType.Corridor;

      default:
        return CoverageType.None;

    }

  }

  /**
   * Returns the coverage range in meters.
   */
  static getRange(entity: Entity): number {

    const props = entity.definition.properties;

    return Number(

        props['searchRange'] ??

        props['trackRange'] ??

        props['engagementRange'] ??

        (
            props['engagementRangeSqr']
                ? Math.sqrt(Number(props['engagementRangeSqr']))
                : 0
        )

    );

}

}