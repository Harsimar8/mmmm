import * as Cesium from "cesium";

export class BuildingLayer {

    static async load(viewer: Cesium.Viewer): Promise<void> {

        const buildings = await Cesium.createOsmBuildingsAsync({

            style: new Cesium.Cesium3DTileStyle({

                color: {

                    conditions: [

                        [
                            "${feature['building']} === 'hospital'",
                            "color('#F6C8C8',0.95)"
                        ],

                        [
                            "${feature['building']} === 'school'",
                            "color('#F2E8B5',0.95)"
                        ],

                        [
                            "${feature['building']} === 'industrial'",
                            "color('#B8B8B8',0.95)"
                        ],

                        [
                            "${feature['building']} === 'commercial'",
                            "color('#D8D0C4',0.95)"
                        ],

                        [
                            "${feature['building']} === 'retail'",
                            "color('#E8DCCB',0.95)"
                        ],

                        [
                            "${feature['building']} === 'office'",
                            "color('#DCE3E8',0.95)"
                        ],

                        [
                            "${feature['building']} === 'apartments'",
                            "color('#F0E6D9',0.95)"
                        ],

                        [
                            "${feature['building']} === 'house'",
                            "color('#EEDBC8',0.95)"
                        ],

                        [
                            "${feature['building']} === 'garage'",
                            "color('#BDBDBD',0.95)"
                        ],

                        [
                            "true",
                            "color('#ECE7DF',0.95)"
                        ]

                    ]

                }

            })

        });

        viewer.shadows = true;

        buildings.shadows = Cesium.ShadowMode.ENABLED;

        buildings.maximumScreenSpaceError = 64;

        buildings.dynamicScreenSpaceError = true;

        buildings.dynamicScreenSpaceErrorDensity = 0.0025;

        buildings.dynamicScreenSpaceErrorFactor = 10.0;

        buildings.dynamicScreenSpaceErrorHeightFalloff = 0.25;

        buildings.skipLevelOfDetail = true;

        buildings.preloadWhenHidden = false;

        buildings.preloadFlightDestinations = false;

        viewer.scene.primitives.add(buildings);

        viewer.scene.globe.maximumScreenSpaceError = 8;

        viewer.resolutionScale = 1.0;

        viewer.scene.msaaSamples = 1;
    }
}