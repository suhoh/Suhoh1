//
// OpenLayers main functions
//

const _gotoLocationSymbolTimer = 15000; // remove symbol after 15 seconds
const _zoomToBuffer = 2500;     // zoom to buffer size (2K)
const _zoomToDuration = 1500;   // duration when zoom to layer
const _lonColName = "LONGITUDE";
const _latColName = "LATITUDE";
const _mapX = '-114.06666';
const _mapY = '51.04999';
const _basemap = "Streets";

var _myFeatures;    // Stores geometry and seq for zipped shaped file - { 'geom': item.getGeometry(), 'seq': index }
var _maps = [];     // { 'divName': divName, 'map': map, 'layer': null, 'features': null, 'scaleLine': null, 'data': null, 'xCol': Longitude, 'yCol': Latitude, 'zCol': null, 
                    // 'basemap': _basemap, 'mousePosition': null, 'isCoordinatesOn': true, 'isLabelOn': false, 'labelColumn': null, 
                    // 'x': null, 'y': null, 'goToLocation': 1, 'sec': 15, 'twp': 24, 'rge': 1, 'mer': 5, 'isMaximized': false }
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

    var layerAts = new ol.layer.Image({
        source: new ol.source.ImageArcGISRest({
            ratio: 1,
            params: {},
            url: _atsUrl,
            crossOrigin: "Anonymous"    // Maybe no need this for v631 and above. Need this. cause Tainted issue when printing
            //https://stackoverflow.com/questions/22710627/tainted-canvases-may-not-be-exported
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
        layers: [layerStreets, layerTopo, layerImagery, layerNatGeo, layerShadedRelief, layerAts],
        logo: false,
        view: new ol.View({
            center: ol.proj.fromLonLat([-115.979293, 55.528787]),
            zoom: 4
        })
    });

    _maps.push({
        'divName': divName, 'map': map, 'layer': null, 'type': null, 'features': null, 'scaleLine': scaleLine, 'data': null,
        'xCol': null, 'yCol': null, 'zCol': null, 'basemap': _basemap,
        'mousePosition': mousePositionControl, 'isCoordinatesOn': true, 'isLabelOn': false, 'labelColumn': null,
        'x': _mapX, 'y': _mapY, 'goToLocation': 1, 'sec': 15, 'twp': 24, 'rge': 1, 'mer': 5, 'isMaximized': false
    });
}

function btnMapMaximizeClick(s) {
    var pId = s.id.split('_')[0];
    var map = getMap(pId);
    var p = splitterMain.GetPaneByName(pId);
    p.Expand();
    map.isMaximized = !map.isMaximized;
}

function btnMapCloseClick(s) {

}

function btnMapCoordinatesClick(s) {    // called from toolbar
    var pId = s.id.split('_')[0];       // changed vertical bar(|) to _ due to jquery not recognizing |
    var map = getMap(pId);
    map.isCoordinatesOn = !map.isCoordinatesOn;
    enableDisableMapCoordinates(map);

}

function enableDisableMapCoordinates(map) {
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

    // check and see if control exist and update check box in map property
    if (typeof chkShowCoordinates !== "undefined" && ASPxClientUtils.IsExists(chkShowCoordinates))
        chkShowCoordinates.SetChecked(map.isCoordinatesOn);
}

function chkShowCoordinatesChanged(s, e) {
    _activeMap.isCoordinatesOn = !_activeMap.isCoordinatesOn;
    enableDisableMapCoordinates(_activeMap);
}

// called from Div
function btnMapLabelClick(s) {
    var id = s.id.split('_')[0];
    var map = getMap(id);
    if (map == undefined)
        return;

    map.isLabelOn = !map.isLabelOn;
    _activeMap = map;   // Set active map
    if (popupPanelProperty.IsVisible())
        chkShowLabel.SetChecked(map.isLabelOn);
    chkShowLabelChanged();
}

// called from DevExpress
function chkShowLabelChanged(s, e) {
    var map = getMap(_activeMap.divName);
    if (s != null)  // called from Div then do not change value
        map.isLabelOn = !map.isLabelOn;

    // Just in case when called when property popup is not shown
    if (typeof cbShowLabel !== "undefined" && ASPxClientUtils.IsExists(cbShowLabel)) {
        cbShowLabel.SetEnabled(map.isLabelOn);
        map.zCol = cbShowLabel.GetText();
    }
    addPointLayerHandler(map, false);   // false: do not zoom to layer
}

function cbShowLabelChanged(s, e) {
    var map = getMap(_activeMap.divName);
    map.zCol = cbShowLabel.GetText();
    addPointLayerHandler(map, false);   // false: do not zoom to layer
}

function cbXYColumnMapChanged(s, e) {
    var map = getMap(_activeMap.divName);
    map.xCol = cbMapXColumn.GetText();
    map.yCol = cbMapYColumn.GetText();
    tbPropertyMapTitle.SetText(map.xCol + " vs " + map.yCol); // title in property
    addPointLayerHandler(map, true);
}

function radioMapGoToClick(s, e) {
    var map = getMap(_activeMap.divName);
    map.goToLocation = s.GetValue();
    showHideGoToLocation(s.GetValue());
}

// 1: Lon/Lat, 2: ATS
function showHideGoToLocation(value) {
    if (value == 1) {    // Lon/Lat
        $("#thAtsHeader").hide();
        $("#trGoToAts").hide();
        $("#trGoToLatLonX").show();
        $("#trGoToLatLonY").show();
    }
    else {  // ATS
        $("#thAtsHeader").show();
        $("#trGoToAts").show();
        $("#trGoToLatLonX").hide();
        $("#trGoToLatLonY").hide();
    }
}

function addPointLayerHandler(map, fitToLayer) {
    if (map.isLabelOn)
        addPointLayer(map.data, map, map.xCol, map.yCol, map.zCol, fitToLayer);
    else
        addPointLayer(map.data, map, map.xCol, map.yCol, null, fitToLayer);
    console.log("addPointLayer: addPointLayerHandler");
}

function cbBasemapChanged(s, e) {
    var pId = _activeMap.divName;
    var basemap = s.GetText();
    var count = s.GetItemCount();

    var map = getMap(pId);
    map.basemap = basemap;
    for (i = 0; i < count; i++) {
        map.map.getLayers().getArray()[i].setProperties({ visible: false }, true);
    }
    if (basemap == 'Streets')
        map.map.getLayers().getArray()[0].setProperties({ visible: true }, false);
    else if (basemap == 'Topographic')
        map.map.getLayers().getArray()[1].setProperties({ visible: true }, false);
    else if (basemap == 'Imagery')
        map.map.getLayers().getArray()[2].setProperties({ visible: true }, false);
    else if (basemap == 'Natl. Geographic')
        map.map.getLayers().getArray()[3].setProperties({ visible: true }, false);
    else if (basemap == 'Shaded Relief')
        map.map.getLayers().getArray()[4].setProperties({ visible: true }, false);
    else
        map.map.getLayers().getArray()[0].setProperties({ visible: true }, false);
}

function btnMapPropertyGoToLonLatClick(s, e) {  // s: Panel1Map1|Property|GoTo
    var lon = parseFloat(tbMapGoToX.GetText());
    var lat = parseFloat(tbMapGoToY.GetText());
    if (isNaN(lon) || isNaN(lat)) {
        alert("Invalid longitude/latitude.");
        return;
    }
    var pId = _activeMap.divName;
    zoomToLonLat(pId, lon, lat, true);
}

function cbGoToAtsSecChanged(s, e) {
    var pId = _activeMap.divName;
    var map = getMap(pId);
    map.sec = cbGoToAtsSec.GetText();
}
function cbGoToAtsTwpChanged(s, e) {
    var pId = _activeMap.divName;
    var map = getMap(pId);
    map.twp = cbGoToAtsTwp.GetText();
}
function cbGoToAtsRgeChanged(s, e) {
    var pId = _activeMap.divName;
    var map = getMap(pId);
    map.rge = cbGoToAtsRge.GetText();
}
function cbGoToAtsMerChanged(s, e) {
    var pId = _activeMap.divName;
    var map = getMap(pId);
    map.mer = cbGoToAtsMer.GetText();
}

function btnMapPropertyGoToAtsClick(s, e) {
    var pId = _activeMap.divName;
    var map = getMap(pId);

    var sec = map.sec;
    if (sec < 10)
        sec = '0' + sec;
    var twp = map.twp;
    if (twp < 10)
        twp = '00' + twp;
    if (twp >= 10 && twp < 100)
        twp = '0' + twp;
    var rge = map.rge;
    if (rge < 10)
        rge = '0' + rge;
    var mer = map.mer;

    var sectionId = sec + '-' + twp + '-' + rge + 'W' + mer;
    var url = "Home/GetLonLatFromSectionTable";
    $.ajax({
        type: "POST",
        url: url,
        data: {
            'sectionId': sectionId
        },
        dataType: "json",
        success: successFunc,
        error: errorFunc
    });

    function successFunc(data, status) {
        if (data.X == 0 || data.Y == 0)
            return;
        var lon = data.X;
        var lat = data.Y;
        zoomToLonLat(pId, lon, lat, true);
    }
    function errorFunc() {
        alert('Error - GetLonLatFromSectionTable');
    }
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

