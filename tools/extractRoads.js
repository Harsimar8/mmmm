const fs = require("fs");
const osmtogeojson = require("osmtogeojson");
const { DOMParser } = require("@xmldom/xmldom");

const osm = fs.readFileSync("tools/jaipur.osm", "utf8");

const geojson = osmtogeojson(
    new DOMParser().parseFromString(osm, "text/xml")
);
const roads = {
    type: "FeatureCollection",
    features: geojson.features.filter(
        f => f.properties && f.properties.highway
    )
};

if (!fs.existsSync("src/assets/maps")) {
    fs.mkdirSync("src/assets/maps", { recursive: true });
}

fs.writeFileSync(
    "src/assets/maps/roads.geojson",
    JSON.stringify(roads, null, 2)
);

console.log("✅ roads.geojson created successfully!");