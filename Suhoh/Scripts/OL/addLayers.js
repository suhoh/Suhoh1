//
// Open layer functions - addLayers
//

function addPointLayer(jsonData, map, xCol, yCol) {
    if (jsonData == null) {
        console.log('addPointLayer: no data available.');
        return;
    }
    if (map.map.layer == undefined)
        map.map.removeLayer(map.map.layer);

    if (xCol != undefined)
        map.xCol = xCol;
    if (yCol != undefined)
        map.yCol = yCol;
    map.data = jsonData;
    var symbols = [];
    for (var i = 0; i < jsonData.length; i++) {
        var symbol = getSymbol(jsonData[i][map.xCol], jsonData[i][map.yCol]);
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
    map.layer = layer;
    map.map.addLayer(layer);
    fitToLayer(map.map, layer);
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