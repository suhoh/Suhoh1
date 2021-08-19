//
// D3 line chart functions
//

const _lineMarginTop = 30;
const _lineMarginRight = 30;
const _lineMarginLeft = 50;
const _lineMarginBottom = 30;

var _lines = [];
var _activeLine;
var _lineSvgHeight;
var _lineColors = ['#e41a1c', '#377eb8', '#4daf4a', '#800080', '#333399', '#999999', '#FF00FF'];

function initLine(divName) {
    _lines.push({
        'divName': divName, 'xCol': null, 'yCol': null, 'data': null, 'svg': null, 'isLegend': true,
        'textLabel': null, 'isLabel': false,
        'isXValue': false, 'isYValue': false,
        'color': _lineColors
    })
}

function getLine(divName) {
    for (i = 0; i < _lines.length; i++) {
        if (_lines[i].divName == divName)
            return _lines[i]
    }
    return null;
}

function getLineData(paneId, jsonData, xCol, yCol, color, isInitial) {
    xCol = 'Well Report Id';
    yCol = 'DEM;Head;Total Depth Drilled';

    if (jsonData == null)
        return null;

    var lGraph = splitterMain.GetPaneByName(paneId);
    var width = lGraph.GetClientWidth();
    var height = lGraph.GetClientHeight();
    var line = getLine(paneId);
    line.xCol = xCol;    // Applicant
    line.yCol = yCol;    // Elevation; Quantity_m3
    line.color = color;

    // Y columns
    var lineYCols = yCol.split(';');

    var lineXyArray = [];
    var series = [];
    var obj = null;

    if (!isInitial) {
        lineXyArray = line.data; // use existing data
    }
    else {
        var gb;
        for (i = 0; i < lineYCols.length; i++) {
            var gb = groupBy(jsonData, xCol, lineYCols[i]);
            var values = [];
            for (s = 0; s < gb.length; s++) {
                values.push(gb[s][lineYCols[i]]);
            }
            series.push({ name: lineYCols[i], 'values': values });
        }
        var x = [];  // X columns
        for (i = 0; i < gb.length; i++) {
            x.push(gb[i][xCol]);    // list of distinct x values
        }
        obj = { 'y': yCol, 'series': series, 'x': x } // https://observablehq.com/@d3/multi-line-chart
        console.log(obj);
    }
    return { lineData: obj, colData: lineYCols, width: width, height: height, color: color }
}

function getLineData_Old(paneId, jsonData, xCol, yCol, color, isInitial) {
    if (jsonData == null)
        return null;

    var lGraph = splitterMain.GetPaneByName(paneId);
    var width = lGraph.GetClientWidth();
    var height = lGraph.GetClientHeight();
    var line = getLine(paneId);
    line.xCol = xCol;    // Applicant
    line.yCol = yCol;    // Elevation; Quantity_m3
    line.color = color;

    // Y columns
    var lineYCols = yCol.split(';');

    var lineXyArray = [];
    if (!isInitial) {
        lineXyArray = line.data; // use existing data
    }
    else {
        var xy = [];
        for (i = 0; i < lineYCols.length; i++) {
            xy.push(groupBy(jsonData, xCol, lineYCols[i])); // 3 dimensional array
        }
        for (j = 0; j < xy[0].length; j++) {    // take first array length
            var s = { X: xy[0][j][xCol] };
            for (k = 0; k < lineYCols.length; k++) {
                s[lineYCols[k]] = xy[k][j][lineYCols[k]]
            }
            lineXyArray.push(s);
        }
    }
    return { lineData: lineXyArray, colData: lineYCols, width: width, height: height, color: color }
}

function drawLine(divName, data, columns, width, height, lineColor) {
    if (data == undefined)
        return null;

    var line = getLine(divName);
    line.data = data; // make it global

    d3.select("#" + divName).selectAll("svg").remove();

    if (columns[0].length == 0) {
        $('#divLineColorPickerDropDown').remove();
        return;
    }

    _lineSvgHeight = height - 30; // svg height will be 30px smaller than panel height to leave room for title
}