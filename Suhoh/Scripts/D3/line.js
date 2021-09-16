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

var _testPoint = [{
    'name': 'DEM',
    'values': [{ 'x': 'Unknown', y: 4025 },
    { 'x': '', y: 11397 },
    { 'x': 'Pump', y: 5356 },
    { 'x': 'Air', y: 1322 },
    { 'x': 'Pump & Air', y: 2038 },
    { 'x': 'Not Applicable', y: 4634 },
    { 'x': 'Bailer', y: 2604 },
    { 'x': 'Bailer & Pump', y: 680 }]
}];

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

    var series = [];

    if (!isInitial) {
        series = line.data; // use existing data
    }
    else {
        var gb;
        var name;
        for (i = 0; i < lineYCols.length; i++) {
            var gb = groupBy(jsonData, xCol, lineYCols[i]);
            var values = [];
            for (s = 0; s < gb.length; s++) {
                values.push({ 'x': gb[s][xCol], 'y': gb[s][lineYCols[i]] });
            }
            series.push({ name: lineYCols[i], values: values });
        }
        console.log(series);
    }
    return { lineData: series, colData: lineYCols, width: width, height: height, color: color }
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

    var series = [];
    var obj = null;

    if (!isInitial) {
        obj = line.data; // use existing data
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

function drawLine(divName, data, columns, width, height, lineColor) {

    d3.select("#" + divName).selectAll("svg").remove();
    _lineSvgHeight = height - 30; // svg height will be 30px smaller than panel height to leave room for title

    var line = getLine(divName);
    line.data = data;

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "lineChartSvg")
        .attr("transform", "translate(0" + _lineMarginTop + ")")
        .append("g");

    var x;
    var y;

    if (width > 400 && line.isLegend == true)
        x = d3.scaleBand().rangeRound([0, width - _lineMarginLeft - _lineMarginRight - 50 - 115]).padding(0.1);
    else
        x = d3.scaleBand().rangeRound([0, width - _lineMarginLeft - _lineMarginRight - 50]).padding(0.1);
    y = d3.scaleLinear().rangeRound([_lineSvgHeight - _lineMarginTop - _lineMarginBottom - 30, 0]);

    x.domain(data.x.map(function (d) {
        console.log(d);
        return d;
    }));
    y.domain([0, d3.max(data.series, d => d3.max(d.values))]).nice();

    // x-axis
    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight) + "," + (_lineSvgHeight - _lineMarginTop - _lineMarginBottom + 30) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    // y-axis
    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight) + ", " + (_lineMarginTop + 30) + ")")
        .call(yAxis);

    // y-axis Label
    var yColumn = line.yCol;
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", "25px")
        .attr("x", (30 - (height / 2)) + "px")
        .style("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text(yColumn);

        var color = d3.scaleOrdinal()
        .domain(columns)
        .range(lineColor);

    createLine(line, svg, data, x, y, color);
    createLineLegend(line, svg, columns, width, color);

    axisLineTooltip(line);
}

function createLine(line, svg, data, x, y, color) {
    //var lineTooltip = d3.select("#" + line.divName).append("div").attr("id", "lineTooltip").attr("class", "lineTooltip").style("display", "none");
    //var lineTooltipTriangle = d3.select("#" + line.divName).append("div").attr("class", "lineTooltipTriangle").style("display", "none");

    var line = d3.line()
        .defined(d => !isNaN(d))
        .x((d, i) => x(data.x[i]))
        .y(d => y(d))
        .curve(d3.curveLinear);

    var ccc = "#e41a1c";

    svg.append("g")
        .selectAll("path")
        .data(data.series)
        .join("path")
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight + (x.bandwidth() / 2)) + "," + (_lineMarginTop + 30) + ")")
        .attr("fill", "none")
        .attr("stroke", function (d) {
            return color(d.name)
        })
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .style("mix-blend-mode", "multiply")
        .attr("d", d => line(d.values));
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
            .attr("transform", function (d, idx) { return "translate(" + (width - 115) + "," + (10 + (idx * 15) + 30) + ")"; })
            .attr("fill", function (d) {
                //console.log(d);
                return color(d)
            });

        legend.append("text")
            .attr("transform", function (d, idx) { return "translate(" + (width - 100) + "," + (13 + (idx * 15) + 30) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "8px")
            .text(function (d) {
                return d;
            })
    }
}

function axisLineTooltip(line) {
    var axisLineLabelTooltip = d3.select("#" + line.divName).append("div").attr("class", "axisLineLabelTooltip").style("display", "none");

    d3.select("#" + line.divName)
        .selectAll(".x .tick")
        .data(line.data)
        .on("mouseover", function (event, d) {
            axisLineLabelTooltip
                .style("display", "inline-block")
                .style("position", "absolute")
                .style("height", 12 + "px")
                .html(d.x)
                .style("left", event.offsetX + "px")
                .style("top", event.offsetY - 25 + "px");
        })
        .on("mouseleave", function (d) {
            axisLineLabelTooltip
                .style("display", "none");
        });
}