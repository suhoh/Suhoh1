//
// Open layer functions - addLayers
//

function addPointLayer(jsonData, map, latColName, lonColName) {
    if (jsonData == null) {
        alert('Error - addPointLayer');
        return;
    }

    var symbols = [];
    for (var i = 0; i < jsonData.length; i++) {
        var symbol = getSymbol(jsonData[i][lonColName], jsonData[i][latColName]);
        symbols.push(symbol);
    }

    var vectorSource = new ol.source.Vector({
        features: symbols
    });
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: symbols
        }),
        name: 'testLayer'
    });
    map.addLayer(layer);
    fitToLayer(map, layer);
}

function getSymbol(x, y) {
    var point = new ol.geom.Point([x, y]);
    point.transform('EPSG:4326', 'EPSG:3857');  // from Lat/Lon to Web Mercator
    var symbol = new ol.Feature({
        geometry: point,
        toolTip: 'test'
    });
    symbol.setStyle(_redCircle);
    return symbol;
}

function fitToLayer(map, layer) {
    var extent = layer.getSource().getExtent();
    if (extent[0] == Infinity) {
        return;
    }

    var buffer = parseInt((extent[2] - extent[0]) / 10);
    extent = ol.extent.buffer(extent, buffer);
    map.getView().fit(extent, { size: map.getSize(), duration: 1500 });
}