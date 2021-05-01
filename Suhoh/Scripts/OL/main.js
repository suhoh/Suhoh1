﻿//
// OpenLayers main functions
//

const _gotoLocationSymbolTimer = 15000; // remove symbol after 15 seconds
const _zoomToBuffer = 2000;     // zoom to buffer size (2K)
const _zoomToDuration = 1200;   // duration when zoom to layer
const _lonColName = "Longitude";
const _latColName = "Latitude";
var _maps = []; // { 'divName': divName, 'map': map, 'layer': null, 'scaleLine': null, 'data': null, 'xCol': Longitude, 'yCol': Latitude,
                //   'mousePosition': null, 'isCoordinatesOn': true, 'isMaximized': false }
var _activeMap;
var _gotoLocationLayer = null;

function getMap(divName) {
    for (i = 0; i < _maps.length; i++) {
        if (_maps[i].divName == divName)
            return _maps[i]
    }
    return null;
}


function initMap(divName) {
    // Basemap
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
    var layerTopo = new ol.layer.Tile({
        zIndex: 0,
        visible: false,
        name: 'layerTopo',
        source: new ol.source.XYZ({
            title: 'layerTopo',
            url: _esriTopoMap + '/tile/{z}/{y}/{x}',
            crossOrigin: "Anonymous"
        })
    });
    var layerImagery = new ol.layer.Tile({
        zIndex: 0,
        visible: false,
        name: 'layerImagery',
        source: new ol.source.XYZ({
            title: 'layerImagery',
            url: _esriImagery + '/tile/{z}/{y}/{x}',
            crossOrigin: "Anonymous"
        })
    });
    var layerNatGeo = new ol.layer.Tile({
        zIndex: 0,
        visible: false,
        name: 'layerNatGeo',
        source: new ol.source.XYZ({
            title: 'layerNatGeo',
            url: _esriNatGeo + '/tile/{z}/{y}/{x}',
            crossOrigin: "Anonymous"
        })
    });
    var layerShadedRelief = new ol.layer.Tile({
        zIndex: 0,
        visible: false,
        name: 'layerShadedRelief',
        source: new ol.source.XYZ({
            title: 'layerShadedRelief',
            url: _esriShadedRelief + '/tile/{z}/{y}/{x}',
            crossOrigin: "Anonymous"
        })
    });
    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(5),
        projection: 'EPSG:4326',
        // comment the following two lines to have the mouse position
        // be placed within the map.
        className: 'divMapCoordinates',
        target: document.getElementById(divName + "|Coordinates"),
        undefinedHTML: '',
    });

    var scaleLine = new ol.control.ScaleLine();
    var map = new ol.Map({
        target: divName,
        controls: ol.control.defaults({
            attributionOptions: {
                collapsible: false
            }
        }).extend([
            scaleLine, mousePositionControl
        ]),
        layers: [layerStreets, layerTopo, layerImagery, layerNatGeo, layerShadedRelief],
        logo: false,
        view: new ol.View({
            center: ol.proj.fromLonLat([-115.979293, 55.528787]),
            zoom: 4
        })
    });

    _maps.push({
        'divName': divName, 'map': map, 'layer': null, 'scaleLine': scaleLine, 'data': null, 'xCol': null, 'yCol': null,
        'mousePosition': mousePositionControl, 'isCoordinatesOn': true, 'isMaximized': false
    });
}

function btnMapMaximizeClick(s) {
    var pId = s.id.split('|')[0];
    var map = getMap(pId);
    var p = splitterMain.GetPaneByName(pId);
    p.Expand();
    map.isMaximized = !map.isMaximized;
}

function btnMapLegendClick(s) {

}

function btnMapCloseClick(s) {

}

function btnMapCoordinatesClick(s) {    // called from toolbar
    var pId = s.id.split('_')[0];       // changed | to _ due to jquery not recognizing |
    var map = getMap(pId);
    map.isCoordinatesOn = !map.isCoordinatesOn;

    if (map.isCoordinatesOn) {
        var mousePositionControl = new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(5),
            projection: 'EPSG:4326',
            // comment the following two lines to have the mouse position
            // be placed within the map.
            className: 'divMapCoordinates',
            target: document.getElementById(map.divName + "|Coordinates"),
            undefinedHTML: '',
        });
        map.map.addControl(mousePositionControl);
        map.mousePosition = mousePositionControl;
        $("#" + map.divName + "_CoordinatesButtonText").html("»");
        $("#" + map.divName + "_Coordinates").show(500);
    }
    else {
        map.map.removeControl(map.mousePosition);
        $("#" + map.divName + "_CoordinatesButtonText").html("«");
        $("#" + map.divName + "_Coordinates").hide(500);
    }
}

function chkShowCoordinatesChanged(s, e) {

}

function chkShowLabelChanged(s, e) {

}

function cbBasemapChanged(s, e) {
    var pId = _activeMap.divName;
    var basemap = s.GetText();
    var count = s.GetItemCount();

    var map = getMap(pId).map;
    for (i = 0; i < count; i++) {
        map.getLayers().getArray()[i].setProperties({ visible: false }, true);
    }
    if (basemap == 'Streets')
        map.getLayers().getArray()[0].setProperties({ visible: true }, false);
    else if (basemap == 'Topographic')
        map.getLayers().getArray()[1].setProperties({ visible: true }, false);
    else if (basemap == 'Imagery')
        map.getLayers().getArray()[2].setProperties({ visible: true }, false);
    else if (basemap == 'Natl. Geographic')
        map.getLayers().getArray()[3].setProperties({ visible: true }, false);
    else if (basemap == 'Shaded Relief')
        map.getLayers().getArray()[4].setProperties({ visible: true }, false);
    else
        map.getLayers().getArray()[0].setProperties({ visible: true }, false);
}

function btnOpenLayerPropertyGoToClick(s, e) {  // s: Panel1Map1|Property|GoTo
    var lon = parseFloat(tbOpenLayerPropertyGoToX.GetText());
    var lat = parseFloat(tbOpenLayerPropertyGoToY.GetText());
    if (isNaN(lon) || isNaN(lat)) {
        alert("Invalid longitude/latitude.");
        return;
    }
    var pId = _activeMap.divName;
    zoomToLonLat(pId, lon, lat, true);
}

function zoomToLonLat(paneId, lon, lat, isShowSymbol) {
    var point = new ol.geom.Point([lon, lat]);
    point.transform('EPSG:4326', 'EPSG:3857');  // from Lat/Lon to Web Mercator
    var feat = new ol.Feature({
        geometry: point,
    });

    var map = getMap(paneId).map;
    if (isShowSymbol == true) {
        if (_gotoLocationLayer != null)
            map.removeLayer(_gotoLocationLayer);
        var features = [];
        features.push(feat);
        var gotoLayer = new ol.source.Vector({
            features: features
        });
        _gotoLocationLayer = new ol.layer.Vector({
            source: gotoLayer,
            style: _myStarColor
        });
        map.addLayer(_gotoLocationLayer);
        setTimeout(function () {
            if (_gotoLocationLayer != null)
                map.removeLayer(_gotoLocationLayer);
        }, _gotoLocationSymbolTimer);
    }

    var ptExtent = feat.getGeometry().getExtent();
    var bufExtent = new ol.extent.buffer(ptExtent, _zoomToBuffer);
    map.getView().fit(bufExtent, { size: map.getSize(), duration: _zoomToDuration });
}

