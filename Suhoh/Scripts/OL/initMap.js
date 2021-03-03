//
// Open layer functions - initMap
//

var _scaleLine;

function initMap(divMap) {
    _scaleLine = new ol.control.ScaleLine();
    var layerStreets = new ol.layer.Tile({
        zIndex: 0,
        visible: true,
        name: 'layerStreets',
        source: new ol.source.XYZ({
            title: 'layerStreets',
            url: _esriStreets + '/tile/{z}/{y}/{x}',
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
        logo: true,
        view: new ol.View({
            center: ol.proj.fromLonLat([-115.979293, 55.528787]),
            zoom: 4
        })
    });
}