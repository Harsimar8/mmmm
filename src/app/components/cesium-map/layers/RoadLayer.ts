import * as Cesium from "cesium";

export class RoadLayer {

    static async load(viewer: Cesium.Viewer): Promise<void> {

        const roadDataSource =
            await Cesium.GeoJsonDataSource.load(
                "assets/data/roads.geojson",
                {
                    clampToGround: true
                }
            );

        roadDataSource.entities.values.forEach(entity => {

            if (!entity.polyline) return;

            const highway =
                entity.properties?.["highway"]?.getValue();

            // Hide tiny roads
            if (
                highway === "service" ||
                highway === "track" ||
                highway === "path" ||
                highway === "footway" ||
                highway === "cycleway"
            ) {
                entity.show = false;
                return;
            }

            let width = 2;
            let color = Cesium.Color.LIGHTGRAY;

            switch (highway) {

                case "motorway":
                    width = 8;
                    color = Cesium.Color.ORANGE;
                    break;

                case "trunk":
                    width = 7;
                    color = Cesium.Color.GOLD;
                    break;

                case "primary":
                    width = 6;
                    color = Cesium.Color.GOLDENROD;
                    break;

                case "secondary":
                    width = 5;
                    color = Cesium.Color.WHITE;
                    break;

                case "tertiary":
                    width = 4;
                    color = Cesium.Color.SILVER;
                    break;

                case "residential":
                    width = 2;
                    color = Cesium.Color.LIGHTGRAY;
                    break;
            }

            entity.polyline.width =
                new Cesium.ConstantProperty(width);

            entity.polyline.material =
                new Cesium.ColorMaterialProperty(color);

        });

        viewer.dataSources.add(roadDataSource);

    }

}