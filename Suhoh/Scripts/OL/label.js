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
