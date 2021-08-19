//
// Open Layers - REST layer and symbol definitin
//

const _atsUrl = 'https://maps.alberta.ca/genesis/rest/services/Alberta_Township_System/Latest/MapServer';
const _skUrl = 'https://gis.saskatchewan.ca/arcgis/rest/services/Cadastre/MapServer';
const _bcUrl = 'https://maps.gov.bc.ca/arcgis/rest/services/biotics/bc_grids/MapServer';
//All Ortho Index(0)
//All Ortho Index(1)
//Mapsheet Grid(1: 250, 000)(2)
//Mapsheet Grid(1: 250, 000)(3)
//Mapsheet Grid(1: 50, 000)(4)
//Mapsheet Grid(1: 50, 000)(5)
//Mapsheet Grid(1: 20, 000)(6)
//Mapsheet Grid(1: 20, 000)(7)
//Universal Transverse Mercator(UTM) Zones of BC(8)
//Universal Transverse Mercator(UTM) Zones of BC(9)

const _esriStreets = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer';
const _esriTopoMap = 'http://server.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer';
const _esriImagery = 'http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer';
const _esriNatGeo = 'http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer';
const _esriShadedRelief = 'http://server.arcgisonline.com/arcgis/rest/services/World_Shaded_Relief/MapServer';
//const esriImagery = "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer" // with labels
//const genesisAlberta = "http://maps.alberta.ca/genesis/rest/services/Provincial_Basemap_C/Latest/MapServer";  // not working -

var layerBc = new ol.layer.Image({
    source: new ol.source.ImageArcGISRest({
        ratio: 1,
        params: { LAYERS: 'show:2,3,4,5' },
        url: _bcUrl,
        crossOrigin: "Anonymous"
    })
});

var layerSk = new ol.layer.Image({
    source: new ol.source.ImageArcGISRest({
        ratio: 1,
        params: {},
        url: _skUrl,
        crossOrigin: "Anonymous"
    })
});

// Symbols
const _redCircle = new ol.style.Style({
    image: new ol.style.Circle({
        fill: new ol.style.Fill({   // Transparent added due to identify not selected without fill
            color: 'rgba(10, 10, 10, 0.5)'
        }),
        stroke: new ol.style.Stroke({
            width: 1,
            color: 'rgba(255, 0, 0, 1)'
        }),
        radius: 5
    })
});

// cyan - normal select interaction to handle click
const _cyanStyle = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 8,
        fill: new ol.style.Fill({
            color: 'rgba(0, 255, 255, 0.5)'
        })
    })
});

const _myStarColor = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({ color: 'rgba(245, 17, 7, 0.5)' }),    // use rgba instead of text color (red, black...)
        stroke: new ol.style.Stroke({ color: 'rgba(10, 10, 1, 1)', width: 2 }),
        points: 5,
        radius: 10,
        radius2: 4,
        angle: 0
    })
});

// pink
const _pink = new ol.style.Style({
    image: new ol.style.Circle({
        radius: 4,
        fill: new ol.style.Fill({
            color: 'rgba(233,30,99, 0.7)'
        })
    })
});


//
// Shape Style
//
var shapeStyle = new ol.style.Style({
    fill: new ol.style.Fill({ color: 'rgba(0,0,128, 0.1)' }),   // blue
    stroke: new ol.style.Stroke({ color: 'rgba(250, 250, 250, 1)', width: 2 })
})

var myStroke = new ol.style.Stroke({ color: 'black', width: 2 });
var myFill = new ol.style.Fill({ color: 'red' });

var myStar = new ol.style.Style({
    image: new ol.style.RegularShape({
        stroke: myStroke,
        points: 5,
        radius: 10,
        radius2: 4,
        angle: 0
    })
});

var myStarColor = new ol.style.Style({
    image: new ol.style.RegularShape({
        fill: new ol.style.Fill({ color: 'rgba(245, 17, 7, 0.5)' }),    // use rgba instead of text color (red, black...)
        stroke: new ol.style.Stroke({ color: 'rgba(10, 10, 1, 1)', width: 2 }),
        points: 5,
        radius: 10,
        radius2: 4,
        angle: 0
    })
});

var myCross = new ol.style.Style({
    image: new ol.style.RegularShape({
        stroke: myStroke,
        points: 4,
        radius: 10,
        radius2: 0,
        angle: 0
    })
});

var myX = new ol.style.Style({
    image: new ol.style.RegularShape({
        stroke: new ol.style.Stroke({ color: 'rgba(10, 10, 10, 0.9)', width: 2 }),
        points: 4,
        radius: 7,
        radius2: 0,
        angle: Math.PI / 4
    })
});

var shapeImage = new ol.style.Circle({
    radius: 5,
    fill: null,
    stroke: new ol.style.Stroke({ color: 'red', width: 2 })
});

var shpStyles = {
    //'Point': new ol.style.Style({
    //    image: shapeImage
    //}),
    'Point': myX
    ,
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 2
        })
    }),
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 1
        })
    }),
    'MultiPoint': new ol.style.Style({
        image: shapeImage
    }),
    'MultiPolygon': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'yellow',
            width: 1
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 0, 0.1)'
        })
    }),
    'Polygon': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 200, 0.7)',
            lineDash: [4],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 200, 0.1)'
        })
    }),
    'GeometryCollection': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'magenta',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'magenta'
        }),
        image: new ol.style.Circle({
            radius: 10,
            fill: null,
            stroke: new ol.style.Stroke({
                color: 'magenta'
            })
        })
    }),
    'Circle': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'red',
            width: 2
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })
};

var shpStyleFunction = function (feature, resolution) {
    var type = feature.getGeometry().getType();
    var style = null;

    if (type == 'Point') {
        style = new ol.style.Style({
            image: new ol.style.RegularShape({
                stroke: new ol.style.Stroke({ color: 'rgba(10, 10, 10, 0.9)', width: 2 }),
                points: 4,
                radius: 7,
                radius2: 0,
                angle: Math.PI / 4
            }),
            text: createTextStyle(feature, resolution)
        })
    }
    else if (type == 'LineString') {
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'green',
                width: 2
            }),
            text: createTextStyle(feature, resolution)
        })
    }
    else if (type = 'Polygon') {
        style = new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 200, 0.7)',
                lineDash: [4],
                width: 3
            }),
            fill: new ol.style.Fill({
                color: 'rgba(0, 0, 200, 0.1)'
            }),
            text: createTextStyle(feature, resolution)
        })
    }
    else {

    }
    return style;
};

// Used when drawing Circle
var drawCircleStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.3)'
    }),
    stroke: new ol.style.Stroke({
        color: '#5050e0',   // blueish
        width: 3
    }),
    image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
            color: '#ffcc33'
        })
    })
})

//
// Label on map
//
// Label: https://openlayers.org/en/latest/examples/vector-labels.html
function stringDivider(str, width, spaceReplacer) {
    if (str == undefined)
        return null;
    if (str.length > width) {
        var p = width;
        while (p > 0 && (str[p] != ' ' && str[p] != '-')) {
            p--;
        }
        if (p > 0) {
            var left;
            if (str.substring(p, p + 1) == '-') {
                left = str.substring(0, p + 1);
            } else {
                left = str.substring(0, p);
            }
            var right = str.substring(p + 1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}
var getText = function (feature, resolution) {
    var type = 'normal';    // normal, hide, shorten, number
    var maxResolution = 1200;
    var text = feature.get('name');
    if (text == undefined)
        return null;

    if (resolution > maxResolution) {
        text = '';
    } else if (type == 'number') {
        text = text;
    } else if (type == 'hide') {
        text = '';
    } else if (type == 'shorten') {
        text = text.trunc(12);
    }
    else { //if (type == 'wrap' && (!dom.placement || dom.placement.value != 'line')) {
        text = stringDivider(text, 16, '\n');
    }

    return String(text);
};
var createTextStyle = function (feature, resolution) {
    var align = 'center';
    var baseline = 'middle';
    var size = '10px';
    var height = 1;
    var offsetX = 13;
    var offsetY = -13;
    var weight = 'normal';
    var placement = 'point';
    //<option value="0.7853981633974483" selected="selected">45°</option>
    //<option value="2.0943951023931953">120°</option>
    //<option value="6.283185307179586">360°</option>
    var maxAngle = 0.785;
    var overflow = false;
    var rotation = 0;
    //if (dom.font.value == '\'Open Sans\'' && !openSansAdded) {
    //    var openSans = document.createElement('link');
    //    openSans.href = 'https://fonts.googleapis.com/css?family=Open+Sans';
    //    openSans.rel = 'stylesheet';
    //    document.getElementsByTagName('head')[0].appendChild(openSans);
    //    openSansAdded = true;
    //}
    var font = weight + ' ' + size + '/' + height + ' ' + 'Arial';
    var fillColor = '#aa3300';
    var outlineColor = '#ffffff';
    var outlineWidth = 2;

    return new ol.style.Text({
        textAlign: align == '' ? undefined : align,
        textBaseline: baseline,
        font: font,
        text: getText(feature, resolution),
        fill: new ol.style.Fill({ color: fillColor }),
        stroke: new ol.style.Stroke({ color: outlineColor, width: outlineWidth }),
        offsetX: offsetX,
        offsetY: offsetY,
        placement: placement,
        maxAngle: maxAngle,
        overflow: overflow,
        rotation: rotation
    });
};
// Points
function pointStyleFunction(feature, resolution) {
    return new ol.style.Style({
        image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({ color: 'rgba(255, 0, 0, 0.3)' }),
            stroke: new ol.style.Stroke({ color: 'red', width: 1 })
        }),
        text: createTextStyle(feature, resolution)
    });
}
