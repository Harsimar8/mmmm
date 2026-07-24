const ICONS: Record<string, string> = {

  RadarSite: 'radar.png',

  Aircraft: 'aircraft.png',
  AWACS : 'AWACS.png',
  

  SAMBattery: 'sam.png',
  Missile: 'missile.png',
  Jammer: 'jammer.png',


  Ship: 'ship.png',

  GroundTarget: 'target.png'

};

export class EntityIconFactory {

    static get(entityType: string): string {

        return `assets/${ICONS[entityType] ?? 'default.png'}`;

    }

}