//
// Open layer functions - addLayers
//

function addPointLayer(jsonData, latColName, lonColName) {
    if (jsonData == null || latColName == null || lonColName == null) {
        alert('jsonData == null || latColName == null || lonColName == null');
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
    var layer = new ol.source.Vector({
        name: 'testLayer',
        source: vectorSource
    });
    _map.addLayer(layer);
}

function getSymbol(x, y) {
    var point = new ol.geom.Point([x, y]);
    point.transform('EPSG:4326', 'EPSG:3857');  // from Lat/Lon to Web Mercator
    var symbol = new ol.Feature({
        geometry: point
        //toolTip: 'test'
    });
    symbol.setStyle(_redCircle);
    return symbol;
}