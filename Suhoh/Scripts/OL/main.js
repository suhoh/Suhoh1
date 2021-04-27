//
// OpenLayers main functions
//

const _lonColName = "Longitude";
const _latColName = "Latitude";
var _maps = [];  // { 'divName': divName, 'map': map, 'layer': null, 'data': null, 'xCol': Longitude, 'yCol': Latitude }
var _scaleLine;

function getMap(divName) {
    _maps.forEach(function (m) {
        if (m.divName == divName)
            return m;
    })
    return null;
}

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

    var map = new ol.Map({
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

    _maps.push({ 'divName': divMap, 'map': map, 'layer': null, 'data': null, 'xCol':null, 'yCol': null });
}

function btnMapMaximizeClick() {

}

function btnMapLegendClick() {

}

function btnMapPropertyClick() {
    popupOpenLayerProperty.Show();
}

function btnMapCloseClick() {

}

function chkShowCoordinatesChanged(s, e) {

}

function chkShowLabelChanged(s, e) {

}

function cbBasemapChanged(s, e) {

}

function btnOpenLayerPropertyGoToClick(s, e) {
    var lon = tbOpenLayerPropertyGoToX.GetText();
    var lat = tbOpenLayerPropertyGoToY.GetText();
    zoomToLonLat(lon, lat, 2000, false);
}

function zoomToLonLat(lon, lat, buffer, isShowSymbol) {
    var point = new ol.geom.Point([lon, lat]);
    point.transform('EPSG:4326', 'EPSG:3857');  // from Lat/Lon to Web Mercator
    var feat = new ol.Feature({
        geometry: point,
    });

    if (isShowSymbol == true) {
        if (_gotoLocationLayer != null)
            _map.removeLayer(_gotoLocationLayer);
        var features = [];
        features.push(feat);
        var gotoLayer = new ol.source.Vector({
            features: features
        });
        _gotoLocationLayer = new ol.layer.Vector({
            source: gotoLayer,
            style: myStarColor
        });
        _map.addLayer(_gotoLocationLayer);
        setTimeout(removeGotoLayer, _gotoLocationSymbolTimer);
    }

    var ptExtent = feat.getGeometry().getExtent();
    var bufExtent = new ol.extent.buffer(ptExtent, buffer);
    _map.getView().fit(bufExtent, { size: _map.getSize(), duration: 1200 });
}