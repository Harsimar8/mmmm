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

            // Ignore everything except vegetation
            if (
                natural !== "wood" &&
                landuse !== "forest" &&
                leisure !== "park" &&
                leisure !== "garden"
            ) {
                entity.show = false;
                return;
            }

            // ----------------------------
            // Random realistic colors
            // ----------------------------

            const woodColors = [
                "#0B3D0B",
                "#145214",
                "#1B5E20",
                "#2E7D32",
                "#33691E"
            ];

            const forestColors = [
                "#1F5C2E",
                "#2E7D32",
                "#388E3C",
                "#43A047",
                "#4CAF50"
            ];

            const parkColors = [
                "#66BB6A",
                "#7CB342",
                "#8BC34A",
                "#9CCC65",
                "#81C784"
            ];

            const gardenColors = [
                "#AED581",
                "#A5D6A7",
                "#C5E1A5",
                "#B2DF8A",
                "#DCE775"
            ];

            let color: Cesium.Color;

            if (natural === "wood") {

                color = Cesium.Color
                    .fromCssColorString(
                        woodColors[
                            Math.floor(
                                Math.random() * woodColors.length
                            )
                        ]
                    )
                    .withAlpha(0.55);

            }
            else if (landuse === "forest") {

                color = Cesium.Color
                    .fromCssColorString(
                        forestColors[
                            Math.floor(
                                Math.random() * forestColors.length
                            )
                        ]
                    )
                    .withAlpha(0.55);

            }
            else if (leisure === "park") {

                color = Cesium.Color
                    .fromCssColorString(
                        parkColors[
                            Math.floor(
                                Math.random() * parkColors.length
                            )
                        ]
                    )
                    .withAlpha(0.45);

            }
            else {

                color = Cesium.Color
                    .fromCssColorString(
                        gardenColors[
                            Math.floor(
                                Math.random() * gardenColors.length
                            )
                        ]
                    )
                    .withAlpha(0.45);

            }

            entity.polygon.material =
                new Cesium.ColorMaterialProperty(color);

            entity.polygon.outline =
                new Cesium.ConstantProperty(false);

            entity.polygon.classificationType =
                new Cesium.ConstantProperty(
                    Cesium.ClassificationType.TERRAIN
                );

        });

        viewer.dataSources.add(vegetationDataSource);

    }

}