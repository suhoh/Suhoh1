//
// Open layer functions - addLayers
//

function addPointLayer(jsonData, map, xCol, yCol, zCol, isFitToLayer) {
    if (jsonData == null) {
        console.log('addPointLayer: no data available.');
        return;
    }
    if (map.layer != undefined)
        map.map.removeLayer(map.layer);

    if (xCol != undefined)
        map.xCol = xCol;
    if (yCol != undefined)
        map.yCol = yCol;
    if (zCol != undefined)
        map.zCol = zCol;

    map.data = jsonData;
    var symbols = [];
    var symbol;
    for (var i = 0; i < jsonData.length; i++) {
        if (zCol == undefined)
            symbol = getSymbol(jsonData[i][map.xCol], jsonData[i][map.yCol], null);
        else
            symbol = getSymbol(jsonData[i][map.xCol], jsonData[i][map.yCol], jsonData[i][map.zCol]);
        symbols.push(symbol);
    }

    var vectorSource = new ol.source.Vector({
        features: symbols
    });
    var layer = new ol.layer.Vector({
        name: 'pointLayer',
        source: vectorSource,
        style: pointStyleFunction
    });
    map.layer = layer;
    map.map.addLayer(layer);
    if (isFitToLayer)
        fitToLayer(map.map, layer);
}

function getSymbol(x, y, z) {
    var point = new ol.geom.Point([x, y]);
    point.transform('EPSG:4326', 'EPSG:3857');  // from Lat/Lon to Web Mercator
    var symbol = new ol.Feature({
        geometry: point,
        toolTip: 'test',
        name: z
    });
    //symbol.setStyle(_redCircle);  // commented out since style is set in pointStyleFunction
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

