//
// Open Layers - REST layer and symbol definitin
//

const _atsUrl = 'https://maps.alberta.ca/genesis/rest/services/Alberta_Township_System/Latest/MapServer';
const _skUrl = 'https://gis.saskatchewan.ca/arcgis/rest/services/Cadastre/MapServer';
const _bcUrl = 'https://maps.gov.bc.ca/arcgis/rest/services/biotics/bc_grids/MapServer';
//All Ortho Index(0)
//All Ortho Index(1)
//Mapsheet Grid(1: 250, 000)(2)
//Mapsheet Grid(1: 250, 000)(3)
//Mapsheet Grid(1: 50, 000)(4)
//Mapsheet Grid(1: 50, 000)(5)
//Mapsheet Grid(1: 20, 000)(6)
//Mapsheet Grid(1: 20, 000)(7)
//Universal Transverse Mercator(UTM) Zones of BC(8)
//Universal Transverse Mercator(UTM) Zones of BC(9)

const _esriStreets = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer';
const _esriTopoMap = 'http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer';
const _esriImagery = 'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer';
const _esriNatGeo = 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer';
const _esriShadedRelief = 'http://server.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer';
//const esriImagery = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" // with labels
//const genesisAlberta = "http://maps.alberta.ca/genesis/rest/services/Provincial_Basemap_C/Latest/MapServer";  // not working -

const _redCircle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({   // 100% transparent. Added due to identify not selected without fill
            color: 'rgba(0, 0, 0, 0)'
        }),
        stroke: new ol.style.Stroke({
            width: 2,
            color: 'rgba(0, 255, 0, 1)'
        }),
        radius: 6
    })
});

// cyan - normal select interaction to handle click
const _cyanStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        fill: new ol.style.Fill({
            color: 'rgba(0, 255, 255, 0.5)'
        })
    })
});