import * as Cesium from "cesium";

export class VegetationLayer {

    static async load(
        viewer: Cesium.Viewer,
        isPointInPolygon: (
            point: Cesium.Cartographic,
            polygon: Cesium.Cartographic[]
        ) => boolean
    ): Promise<void> {

        const vegetationDataSource =
            await Cesium.GeoJsonDataSource.load(
                "assets/data/vegetation.geojson",
                {
                    clampToGround: true
                }
            );

        vegetationDataSource.entities.values.forEach(entity => {

            if (!entity.polygon) return;

            const landuse =
                entity.properties?.["landuse"]?.getValue();

            const natural =
                entity.properties?.["natural"]?.getValue();

            const leisure =
                entity.properties?.["leisure"]?.getValue();

            if (
                natural !== "wood" &&
                landuse !== "forest" &&
                leisure !== "park" &&
                leisure !== "garden"
            ) {
                entity.show = false;
                return;
            }

            let color =
                Cesium.Color.fromCssColorString("#66BB6A")
                    .withAlpha(0.15);

            if (natural === "wood") {

                color =
                    Cesium.Color.fromCssColorString("#1B5E20")
                        .withAlpha(0.20);

            }
            else if (landuse === "forest") {

                color =
                    Cesium.Color.fromCssColorString("#2E7D32")
                        .withAlpha(0.20);

            }
            else if (leisure === "park") {

                color =
                    Cesium.Color.fromCssColorString("#66BB6A")
                        .withAlpha(0.25);

            }
            else if (leisure === "garden") {

                color =
                    Cesium.Color.fromCssColorString("#81C784")
                        .withAlpha(0.22);

            }

            entity.polygon.material =
                new Cesium.ColorMaterialProperty(color);

            const hierarchy =
                entity.polygon.hierarchy?.getValue(
                    Cesium.JulianDate.now()
                );

            if (!hierarchy) return;

            const polygon: Cesium.Cartographic[] =
                hierarchy.positions.map(
                    (position: Cesium.Cartesian3) =>
                        Cesium.Cartographic.fromCartesian(position)
                );

            let minLon = Infinity;
            let maxLon = -Infinity;
            let minLat = Infinity;
            let maxLat = -Infinity;

            polygon.forEach((point: Cesium.Cartographic) => {

                const lon =
                    Cesium.Math.toDegrees(point.longitude);

                const lat =
                    Cesium.Math.toDegrees(point.latitude);

                minLon = Math.min(minLon, lon);
                maxLon = Math.max(maxLon, lon);

                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);

            });

            let treesPlaced = 0;
            let attempts = 0;

            while (treesPlaced < 40 && attempts < 400) {

                attempts++;

                const lon =
                    minLon +
                    Math.random() * (maxLon - minLon);

                const lat =
                    minLat +
                    Math.random() * (maxLat - minLat);

                const point =
                    Cesium.Cartographic.fromDegrees(
                        lon,
                        lat
                    );

                if (!isPointInPolygon(point, polygon)) {
                    continue;
                }

                viewer.entities.add({

                    position:
                        Cesium.Cartesian3.fromDegrees(
                            lon,
                            lat,
                            2
                        ),

                    billboard: {

                        image: "assets/icons/tree.png",

                        width: 24,

                        height: 24,

                        verticalOrigin:
                            Cesium.VerticalOrigin.BOTTOM,

                        scaleByDistance:
                            new Cesium.NearFarScalar(
                                500,
                                1.0,
                                12000,
                                0.3
                            )

                    }

                });

                treesPlaced++;

            }

            entity.polygon.classificationType =
                new Cesium.ConstantProperty(
                    Cesium.ClassificationType.TERRAIN
                );

            entity.polygon.outline =
                new Cesium.ConstantProperty(false);

        });

        viewer.dataSources.add(vegetationDataSource);

    }

}