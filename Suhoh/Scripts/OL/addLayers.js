//
// Open layer functions - addLayers
//

function addPointLayer(jsonData, map, xCol, yCol, zCol, isFitToLayer) {
    if (jsonData == null || map == null) {
        console.log('addPointLayer: No Data or Map available.');
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

    var layer;
    var symbols = [];
    if (map.type == 'XLS' || map.type == undefined) {
        var symbol;
        for (var i = 0; i < jsonData.length; i++) {
            if (map.isLabelOn)
                symbol = getSymbol(jsonData[i][map.xCol], jsonData[i][map.yCol], jsonData[i][map.zCol]);    // Show label
            else
                symbol = getSymbol(jsonData[i][map.xCol], jsonData[i][map.yCol], null);                     // No label
            symbols.push(symbol);
            var vectorSource = new ol.source.Vector({
                features: symbols
            });
            layer = new ol.layer.Vector({
                name: 'pointLayer' + map.divName,
                source: vectorSource,
                style: pointStyleFunction
            });
        }
    }
    if (map.type == 'SHP') {
        // Filter geom from jsonData
        let matchResult = map.features.filter(o1 => jsonData.some(o2 => o1.Seq === o2.Seq));

        $.each(matchResult, function (index, item) {
            if (map.isLabelOn)
                symbol = getShpSymbol(item.geom, jsonData[index][map.zCol]);
            else
                symbol = getShpSymbol(item.geom, null);
            symbols.push(symbol);
        });
        var vectorSource = new ol.source.Vector({
            features: symbols
        });
        layer = new ol.layer.Vector({
            name: 'shapeLayer' + map.divName,
            source: vectorSource,
            style: shpStyleFunction
        });
    }
    
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
    return symbol;
}

function getShpSymbol(geom, z) {
    var g = geom.clone();
    g.transform('EPSG:4326', 'EPSG:3857');   // from Lat/Lon to Web Mercator
    var symbol = new ol.Feature({
        geometry: g,
        type: 'SHP',
        toolTip: 'test',
        name: z
    });
    return symbol;
}

function fitToLayer(map, layer) {
    var extent = layer.getSource().getExtent();
    if (extent[0] == Infinity) {
        return;
    }

    var buffer = parseInt((extent[2] - extent[0]) / 10);
    extent = ol.extent.buffer(extent, buffer);
    map.getView().fit(extent, { size: map.getSize(), duration: _zoomToDuration });
}

