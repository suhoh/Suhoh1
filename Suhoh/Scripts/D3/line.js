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

var columns = "Consumptive Use_M3";
var _testData = [{ X: "CLENNETT, DAVID", Y: 1565}, { X: "SARUK, JESSIE", Y: 85 }, { X: "STELMASCHUK, OREST", Y: 998 }, { X: "MAURICE & NATALIE CLENNETT", Y: 1423.4 }, { X: "FUNDYTUS, LEONARD", Y: 70 }, { X: "PIDRUCHNEY, JOE", Y: 1344 }]

var _multiLineData = {
    'y': "DEM",
    'series': [{ 'name': 'series1', 'values': [1565, 85, 998, 1423.4] }, { 'name': 'serie2', 'values': [1000, 165, 398, 1450] }, { 'name': 'serie3', 'values': [1526, 1452, 328, 198] }],
    'x': ["CLENNETT, DAVID", "SARUK, JESSIE", "STELMASCHUK, OREST"]
}

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

    d3.select("#" + divName).selectAll("svg").remove();
    _lineSvgHeight = height - 30; // svg height will be 30px smaller than panel height to leave room for title

    var line = getLine(divName);
    line.data = _multiLineData;

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", _lineSvgHeight)
        .attr("class", "lineChartSvg")
        .attr("transform", "translate(0" + _lineMarginTop + ")")
        .append("g");

    var x;
    var y;

    if (width > 400 && line.isLegend == true)
        //x = d3.scaleUtc().range([0, width - _lineMarginLeft - _lineMarginRight - 50 - 115]);
        x = d3.scaleBand().rangeRound([0, width - _lineMarginLeft - _lineMarginRight - 50 - 115]).padding(0.1);
    else
        //x = d3.scaleUtc().range([0, width - _lineMarginLeft - _lineMarginRight - 50]);
        x = d3.scaleBand().rangeRound([0, width - _lineMarginLeft - _lineMarginRight - 50]).padding(0.1);
    y = d3.scaleLinear().rangeRound([_lineSvgHeight - _lineMarginTop - _lineMarginBottom - 30, 0]);

    x.domain(_multiLineData.x.map(function (d) { return d; }));
    y.domain([0, d3.max(_multiLineData.series, d => d3.max(d.values))]).nice();

    // x-axis
    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight) + "," + (_lineSvgHeight - _lineMarginTop - _lineMarginBottom) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    //if (_multiLineData == undefined)
    //    return null;

    //var line = getLine(divName);
    //line.data = _multiLineData; // make it global

    //if (columns[0].length == 0) {
    //    $('#divLineColorPickerDropDown').remove();
    //    return;
    //}

    //_lineSvgHeight = height - 30; // svg height will be 30px smaller than panel height to leave room for title

    //var svg = d3.select("#" + divName)
    //    .append("svg")
    //    .attr("width", width)
    //    .attr("height", _lineSvgHeight)
    //    .attr("class", "lineChart")
    //    .attr("transform", "translate(0," + _lineMarginTop + ")")
    //    .append("g");

    ////var stackedData = d3.stack()
    ////    .keys(columns)
    ////    (_testData)
    ////    .map(d => (d.forEach(v => v.key = d.key), d));

    //var x;
    //var y;

    //if (width > 400 && line.isLegend == true)
    //    x = d3.scaleBand().rangeRound([0, width - _lineMarginLeft - _lineMarginRight - 50 - 115]).padding(0.1);
    //else
    //    x = d3.scaleBand().rangeRound([0, width - _lineMarginLeft - _lineMarginRight - 50]).padding(0.1);
    //y = d3.scaleLinear().rangeRound([_lineSvgHeight - _lineMarginTop - _lineMarginBottom - 30, 0]);

    //var yArray = [];
    //for (i = 0; i < _multiLineData.series.length; i++) {
    //    var str = '';
    //    for (j = 0; j < _multiLineData.x.length; j++) {
    //        //str += data[i][columns[j]] + ',';
    //        str += _multiLineData.x[j] + ',';
    //    }
    //    str = str.substring(0, str.length - 1)
    //    yArray.push(sumStr(str));
    //}
    //var yMax = Math.max(...yArray);

    //x.domain(data.map(function (d) { return d.X; }))
    //y.domain([0, yMax]);

    //// x-axis
    //var xAxis = d3.axisBottom(x);
    //svg.append("g")
    //    .attr("class", "x axis")
    //    .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight) + "," + (_lineSvgHeight - _lineMarginTop - _lineMarginBottom) + ")")
    //    .call(xAxis)
    //    .selectAll("text")
    //    .attr("transform", "rotate(30)")
    //    .style("text-anchor", "start");

    //// y-axis
    //var yAxis = d3.axisLeft(y);
    //svg.append("g")
    //    .attr("class", "y axis")
    //    .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight) + ", " + _lineMarginTop + ")")
    //    .call(yAxis);

    //// y-axis Label
    //var yColumn = line.yCol;
    //svg.append("text")
    //    .attr("transform", "rotate(-90)")
    //    .attr("y", "25px")
    //    .attr("x", (30 - (height / 2)) + "px")
    //    .style("text-anchor", "middle")
    //    .attr("font-weight", "bold")
    //    .text(yColumn);

    //var color = d3.scaleOrdinal()
    //    .domain(columns)
    //    .range(lineColor);

    //$('#lineTooltip').remove();

    //// line
    //createLine(line, svg, _testData, columns, x, y, color);
    ////createLineLegend(line, svg, stackedData, width, color);
    //createLineLegend(line, svg, columns, width, color);
}


// https://bl.ocks.org/LemoNode/a9dc1a454fdc80ff2a738a9990935e9d
function createLine(line, svg, data, columns, x, y, color) {
    //var lineTooltip = d3.select("#" + line.divName).append("div").attr("id", "lineTooltip").attr("class", "lineTooltip").style("display", "none");
    //var lineTooltipTriangle = d3.select("#" + line.divName).append("div").attr("class", "lineTooltipTriangle").style("display", "none");

    var dataline = d3.line()
        .x(function (d) { return x(d.x); })
        //.y(function (d) { return y(d[columns[0]]); })
        .y(function (d) { return y(d.series.values); })
        .curve(d3.curveStep);

    var lineSvg = svg.append("path")
        .data(_multiLineData)
        //.join("path")
        .attr("d", dataline)
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight) + ", 30)")
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 2);
}

function createLineLegend(line, svg, columns, width, color) {
    var legend = svg.selectAll("legend")
        .data(columns)
        .enter()
        .append("g")
        .attr("class", "lineLegend")
        .attr("id", function (d, idx) { return line.divName + "lineLegend" + idx });

    if (width > 400 && line.isLegend == true) {
        legend.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("transform", function (d, idx) { return "translate(" + (width - 115) + "," + (10 + (idx * 15)) + ")"; })
            .attr("fill", function (d) { return color(d) });

        legend.append("text")
            .attr("transform", function (d, idx) { return "translate(" + (width - 100) + "," + (13 + (idx * 15)) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "8px")
            .text(function (d) {
                return d;
            })
    }
}