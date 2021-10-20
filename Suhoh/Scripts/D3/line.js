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
var _testData = [{ X: "CLENNETT, DAVID", Y: 1565 }, { X: "SARUK, JESSIE", Y: 85 }, { X: "STELMASCHUK, OREST", Y: 998 }, { X: "MAURICE & NATALIE CLENNETT", Y: 1423.4 }, { X: "FUNDYTUS, LEONARD", Y: 70 }, { X: "PIDRUCHNEY, JOE", Y: 1344 }]

var _multiLineData = {
    'y': "DEM",
    'series': [{ 'name': 'series1', 'values': [1565, 85, 998, 1423.4] }, { 'name': 'serie2', 'values': [1000, 165, 398, 1450] }, { 'name': 'serie3', 'values': [1526, 1452, 328, 198] }],
    'x': ["CLENNETT, DAVID", "SARUK, JESSIE", "STELMASCHUK, OREST"]
}

var _testPoint = [{
    'name': 'DEM',
    'values': [
        { 'x': 'Unknown', "y": 4025, color: 'DEM' },
        { 'x': '', "y": 11397, color: 'DEM' },
        { 'x': 'Pump', "y": 5356, color: 'DEM' },
        { 'x': 'Air', "y": 1322, color: 'DEM' },
        { 'x': 'Pump & Air', "y": 2038, color: 'DEM' },
        { 'x': 'Not Applicable', "y": 4634, color: 'DEM' },
        { 'x': 'Bailer', "y": 2604, color: 'DEM' },
        { 'x': 'Bailer & Pump', "y": 680, color: 'DEM' }
    ]
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
                values.push({ 'x': gb[s][xCol], 'y': gb[s][lineYCols[i]], 'color': lineYCols[i] });
            }
            series.push({ name: lineYCols[i], values: values });
        }
        console.log(series);
    }
    return { lineData: series, colData: lineYCols, width: width, height: height, color: color }
}

function getLineDataOld(paneId, jsonData, xCol, yCol, color, isInitial) {
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
        //console.log(obj);
    }
    return { lineData: obj, colData: lineYCols, width: width, height: height, color: color }
}

function drawLine(divName, data, columns, width, height, lineColor) {
    d3.select("#" + divName).selectAll("svg").remove();
    _lineSvgHeight = height - 30;

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

    // It always returns at least one series of data
    x.domain(data[0].values.map(function (d) {
        return d.x;
    }));

    y.domain([0, d3.max(data, function (c) {
        return d3.max(c.values, function (v) { return v.y; });
    })]);

    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight) + "," + (_lineSvgHeight - _lineMarginTop - _lineMarginBottom + 30) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight) + ", " + (_lineMarginTop + 30) + ")")
        .call(yAxis);

    var yColumn = line.yCol;
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", "25px")
        .attr("x", (- (height / 2)) + "px")
        .style("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text(yColumn);

    var color = d3.scaleOrdinal()
        .domain(columns)
        .range(lineColor);

    $('#lineTooltip').remove();

    createLine(line, svg, data, x, y, color);
    createLineTextLabel(line, svg, data, x, y);
    createLineLegend(line, svg, columns, width, color);

    axisLineTooltip(line, data);
}

function createLine(line, svg, data, x, y, color) {
    var lineTooltip = d3.select("#" + line.divName).append("div").attr("id", "lineTooltip").attr("class", "lineTooltip").style("display", "none");

    var curveType;
    var curveTypeValue = 1;

    if (typeof radioLineShape != "undefined" && ASPxClientUtils.IsExists(radioLineShape))
        curveTypeValue = radioLineShape.GetValue();

    if (curveTypeValue == 1)
        curveType = d3.curveLinear;
    else if (curveTypeValue == 2)
        curveType = d3.curveCatmullRom.alpha(0.5);
    else
        curveType = d3.curveMonotoneX;

    var lines = d3.line()
        .x(function (d) { return x(d.x); })
        .y(function (d) { return y(d.y); })
        .curve(curveType);

    // Line
    svg.append("g")
        .selectAll("path")
        .data(data)
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
        .attr("d", function (d) {
            return lines(d.values)
        });

    // Dot
    svg.selectAll("lineSvg")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight + (x.bandwidth() / 2)) + "," + (_lineMarginTop + 30) + ")")
        .selectAll("circle")
        .data(function (d) { return d.values; })
        .enter()
        .append("circle")
        .attr("class", "lineDot")
        .attr("r", 3)
        .attr("cx", function (d) {
            //console.log("x: " + d.x);
            return x(d.x);
        })
        .attr("cy", function (d) {
            //console.log("y: " + d.y);
            return y(d.y);
        })
        .style("fill", function (d) {
            //console.log(d.color);
            return color(d.color);
        })
        .on("mouseenter", function (event, d) {
            lineTooltip
                .style("display", "inline-block")
                .style("position", "absolute")
                .html(d.x + "<br>" + parseInt(d.y))
                .style("opacity", 1);

            var tooltipDiv = document.getElementById("lineTooltip");
            var tooltipRect = tooltipDiv.getBoundingClientRect();

            var tooltipWidth = tooltipRect.width;

            lineTooltip
                .transition()
                .duration(200)
                .style("left", _lineMarginLeft + _lineMarginRight + _lineMarginRight + (x.bandwidth() / 2) + x(d.x) - (tooltipWidth / 2) + "px")
                .style("top", y(d.y) + 8 + "px");

            //console.log("lineBand: " + x.bandwidth());
            //console.log("lineX :" + x(d.x));
            //console.log("lineTooltipWidth: " + $('#lineTooltip').width());
            //console.log("tootipWidth: " + tooltipWidth);
        })
        .on("mouseleave", function (d) {
            lineTooltip
                .style("display", "none");
        });
}

function createLineTextLabel(line, svg, data, x, y) {
    line.textLabel = svg.selectAll("lineSvg")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", "translate(" + (_lineMarginLeft + _lineMarginRight + (x.bandwidth() / 2)) + ", 60)")
        .selectAll("circle")
        .data(function (d) { return d.values; })
        .enter()
        .append("text")
        .attr("id", "lineTextLabel")
        .attr("class", "lineTextLabel")
        .style("text-anchor", "left")
        .style("font-size", "12px")
        .attr("display", "none")
        .attr("x", function (d) { return x(d.x) })
        .attr("y", function (d) { return y(d.y) });
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

function axisLineTooltip(line, data) {
    var axisLineLabelTooltip = d3.select("#" + line.divName).append("div").attr("class", "axisLineLabelTooltip").style("display", "none");

    d3.select("#" + line.divName)
        .selectAll(".x .tick")
        .data(data[0].values)
        .on("mouseover", function (event, d) {
            axisLineLabelTooltip
                .style("display", "inline-block")
                .style("position", "absolute")
                .html(d.x)
                .style("left", event.offsetX + "px")
                .style("top", event.offsetY - 40 + "px");
            //alert("hi");
        })
        .on("mouseleave", function (d) {
            axisLineLabelTooltip
                .style("display", "none");
            //alert("end");
        });
}