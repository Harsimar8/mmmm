import * as Cesium from 'cesium';

import { Entity } from '../../core/models/Entity';
import {
    CoverageGeometry,
    CoverageType
} from '../../core/geometry/CoverageGeometry';

export class CesiumCoverageRenderer {

    static render(entity: Entity): Cesium.Entity[] {


       
        const type =
            CoverageGeometry.getCoverageType(entity);



        switch (type) {


            case CoverageType.Circle:

                return [
                    this.drawCircle(entity)
                ];



            case CoverageType.Dome:

                return [

                    this.drawDome(entity),

                    this.drawRadarSweep(entity)

                ];



            default:

                return [];

        }

    }
    private static drawCircle(
        entity: Entity
    ): Cesium.Entity {

        const range = CoverageGeometry.getRange(entity);

        return new Cesium.Entity({

            position: Cesium.Cartesian3.fromDegrees(

                entity.position.longitude,

                entity.position.latitude

            ),

            ellipse: {

                semiMajorAxis: range,

                semiMinorAxis: range,

                height: 0,

                material: Cesium.Color
                    .fromCssColorString("#5BC0BE")
                    .withAlpha(0.35),

                outline: true,

                outlineColor: Cesium.Color
                    .fromCssColorString("#0B6E69"),

                outlineWidth: 2,

                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND

            }
        });

    }


    private static drawDome(
        entity: Entity
    ): Cesium.Entity {

        const range = CoverageGeometry.getRange(entity);

        return new Cesium.Entity({

            position: Cesium.Cartesian3.fromDegrees(

                entity.position.longitude,

                entity.position.latitude,

                0

            ),

            ellipsoid: {

                radii: new Cesium.Cartesian3(
                    range,
                    range,
                    range
                ),

                maximumCone: Cesium.Math.PI_OVER_TWO,

                material: Cesium.Color
                    .fromCssColorString("#8B6FB3")
                    .withAlpha(0.22),

                outline: true,

                outlineColor: Cesium.Color
                    .fromCssColorString("#BCA7E8")
                    .withAlpha(0.9),

                outlineWidth: 2,

                slicePartitions: 12,

                stackPartitions: 6,

                subdivisions: 128

            }

        });

    }

    private static drawRadarSweep(
        entity: Entity
    ): Cesium.Entity {


        const range = CoverageGeometry.getRange(entity);


        const scanCenter =
            Number(entity.definition.properties["scanCenter"] ?? 0);


        const scanWidth =
            Number(entity.definition.properties["scanWidth"] ?? 60);



        const hierarchy = new Cesium.CallbackProperty(() => {


            const positions: Cesium.Cartesian3[] = [];


            const time =
                performance.now() / 1000;



            // moving angle left-right
            const angle =

                scanCenter +

                Math.sin(time * 1.5) *

                (scanWidth / 2);



            // radar center point
            positions.push(

                Cesium.Cartesian3.fromDegrees(

                    entity.position.longitude,

                    entity.position.latitude,

                    100

                )

            );



            const center =

                Cesium.Cartographic.fromDegrees(

                    entity.position.longitude,

                    entity.position.latitude

                );



            const angularDistance =

                range / 6378137;



            // create sector points
            for (

                let deg =

                    angle - scanWidth / 2;

                deg <=

                angle + scanWidth / 2;

                deg += 2

            ) {


                const bearing =

                    Cesium.Math.toRadians(deg);



                const lat =

                    Math.asin(

                        Math.sin(center.latitude)

                        *

                        Math.cos(angularDistance)

                        +

                        Math.cos(center.latitude)

                        *

                        Math.sin(angularDistance)

                        *

                        Math.cos(bearing)

                    );



                const lon =

                    center.longitude +

                    Math.atan2(

                        Math.sin(bearing)

                        *

                        Math.sin(angularDistance)

                        *

                        Math.cos(center.latitude),


                        Math.cos(angularDistance)

                        -

                        Math.sin(center.latitude)

                        *

                        Math.sin(lat)

                    );



                positions.push(

                    Cesium.Cartesian3.fromRadians(

                        lon,

                        lat,

                        100

                    )

                );

            }



            return new Cesium.PolygonHierarchy(
                positions
            );


        }, false);



        return new Cesium.Entity({


           polygon: {

    hierarchy,

    material:

        Cesium.Color

            .fromCssColorString("#F59E0B") // Tactical amber

            .withAlpha(0.32),


    outline:true,


    outlineColor:

        Cesium.Color

            .fromCssColorString("#FCD34D") // Soft gold outline

            .withAlpha(0.85),


    outlineWidth:2

}
        });

    }


}