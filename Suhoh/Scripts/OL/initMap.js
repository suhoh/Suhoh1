//
// Open layer functions - initMap
//

function initMap(divMap) {
    var esriStreets = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer';
    var _scaleLine = new ol.control.ScaleLine();
    var layerStreets = new ol.layer.Tile({
        zIndex: 1000,
        visible: true,
        name: 'layerStreets',
        source: new ol.source.XYZ({
            title: 'layerStreets',
            url: esriStreets + '/tile/{z}/{y}/{x}',
            crossOrigin: "Anonymous"
        })
    });

    _map = new ol.Map({
        target: divMap,
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: false
            }
        }).extend([
            _scaleLine
        ]),
        layers: [layerStreets],
        logo: false,
        view: new ol.View({
            center: ol.proj.fromLonLat([-115.979293, 55.528787]),
            zoom: 4
        })
    });
}