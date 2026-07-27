import * as Cesium from "cesium";

export class BuildingLayer {

    static async load(viewer: Cesium.Viewer): Promise<void> {


        const buildings =
            await Cesium.createOsmBuildingsAsync({

                style: new Cesium.Cesium3DTileStyle({

                    color: {

                        conditions: [

                            [
                                "${feature['building']} === 'hospital'",
                                "color('#E8B6B6', 0.95)"
                            ],

                            [
                                "${feature['building']} === 'school'",
                                "color('#E5D39A', 0.95)"
                            ],

                            [
                                "${feature['building']} === 'industrial'",
                                "color('#AFAFAF', 0.95)"
                            ],

                            [
                                "${feature['building']} === 'commercial'",
                                "color('#D1C2AF', 0.95)"
                            ],

                            [
                                "${feature['building']} === 'apartments'",
                                "color('#D8D2C8', 0.95)"
                            ],

                            [
                                "${feature['building']} === 'house'",
                                "color('#E4D1B8', 0.95)"
                            ],

                            [
                                "true",
                                "color('#CFCBC3', 0.95)"
                            ]

                        ]

                    }

                })

            });



        // =========================
        // BUILDING QUALITY
        // =========================

        buildings.maximumScreenSpaceError = 8;

        buildings.dynamicScreenSpaceError = true;

        buildings.dynamicScreenSpaceErrorDensity = 0.002;

        buildings.dynamicScreenSpaceErrorFactor = 8;

        buildings.skipLevelOfDetail = false;



        // =========================
        // SHADOWS
        // =========================

        viewer.shadows = true;

        viewer.scene.shadowMap.enabled = true;

        viewer.scene.shadowMap.size = 4096;

        viewer.scene.shadowMap.softShadows = true;


        buildings.shadows =
            Cesium.ShadowMode.ENABLED;



        // =========================
        // LIGHTING
        // =========================

        viewer.scene.globe.enableLighting = true;


        viewer.scene.light =
            new Cesium.SunLight();



        // =========================
        // ATMOSPHERE
        // =========================

      


        viewer.scene.fog.enabled = true;

        viewer.scene.fog.density = 0.00015;



        // =========================
        // TERRAIN DETAIL
        // =========================

        viewer.scene.globe.maximumScreenSpaceError = 4;


        viewer.scene.globe.depthTestAgainstTerrain = true;



        // =========================
        // ADD BUILDINGS
        // =========================

        viewer.scene.primitives.add(buildings);


        // Rendering quality

        viewer.scene.msaaSamples = 4;

        viewer.resolutionScale = 1.2;


    }
}