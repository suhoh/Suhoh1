﻿//
// D3 scatter chart functions
//

const _scatterMarginTop = 30;
const _scatterMarginRight = 30;
const _scatterMarginLeft = 50;
const _scatterMarginBottom = 30;

var _scatters = [];
var _activeScatter;
var _scatterSvgHeight;
var _scatterColors = ['#e41a1c', '#377eb8', '#4daf4a', '#800080', '#333399', '#999999', '#FF00FF'];

var _scatterTestPoint = [
    { 'x': 1000, "y": 1000, "z": 'Belly River' },
    { 'x': 2000, "y": 4000, "z": 'Quaternary' },
    { 'x': 3000, "y": 5000, "z": 'Unknown' },
    { 'x': 4000, "y": 11000, "z": 'Belly River' },
    { 'x': 5000, "y": 8000, "z": 'Quaternary' },
    { 'x': 6000, "y": 500, "z": 'Unknown' },
    { 'x': 7000, "y": 9000, "z": 'Belly River' },
    { 'x': 8000, "y": 3000, "z": 'Quaternary' }
];

function initScatter(divName) {
    _scatters.push({
        'divName': divName, 'xCol': null, 'yCol': null, 'zCol': null, 'data': null, 'svg': null, 'isLegend': true,
        'textLabel': null, 'isLabel': false,
        'isXValue': false, 'isYValue': false, 'isZValue': false,
        'color': _scatterColors
    })
}

function getScatter(divName) {
    for (i = 0; i < _scatters.length; i++) {
        if (_scatters[i].divName == divName)
            return _scatters[i]
    }
    return null;
}

function getScatterData(paneId, jsonData, xCol, yCol, zCol, color, isInitial) {
    if (jsonData == null)
        return null;

    var sGraph = splitterMain.GetPaneByName(paneId);
    var width = sGraph.GetClientWidth();
    var height = sGraph.GetClientHeight();
    var scatter = getScatter(paneId);

    scatter.xCol = xCol;
    scatter.yCol = yCol;
    scatter.zCol = zCol;
    scatter.color = color;

    var sData = [];

    if (!isInitial) {
        sData = scatter.data; // use existing data
    }
    else {
        for (i = 0; i < jsonData.length; i++) {
            if (jsonData[i][xCol].toString().length == 0 || jsonData[i][yCol].toString().length == 0)
                continue;
            sData.push({ 'X': jsonData[i][xCol], 'Y': jsonData[i][yCol], 'Z': jsonData[i][zCol] })
        }
    }
    return { scatterData: sData, xCol: scatter.xCol, yCol: scatter.yCol, zCol: scatter.zCol, width: width, height: height, color: color }
}

function drawScatter(divName, data, width, height, scatterColor) {
    d3.select("#" + divName).selectAll("svg").remove();
    _scatterSvgHeight = height - 30;

    var scatter = getScatter(divName);
    scatter.data = data;

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "lineChartSvg")
        .attr("transform", "translate(0" + _scatterMarginTop + ")")
        .append("g");

    var x;
    var y;

    if (width > 400 && scatter.isLegend == true)
        x = d3.scaleLinear().range([0, width - _scatterMarginLeft - _scatterMarginRight - 50 - 115]);
    else
        x = d3.scaleLinear().range([0, width - _scatterMarginLeft - _scatterMarginRight - 50]);
    y = d3.scaleLinear().range([_scatterSvgHeight - _scatterMarginTop - _scatterMarginBottom - 30, 0]);

    x.domain([0, d3.max(data, function (d) {
        return d.X;
    })]);
    y.domain([0, d3.max(data, function (d) {
        return d.Y;
    })]);

    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + "," + (_scatterSvgHeight - _scatterMarginTop - _scatterMarginBottom + 30) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + ", " + (_scatterMarginTop + 30) + ")")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", "25px")
        .attr("x", (- (height / 2)) + "px")
        .style("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text(scatter.yCol);

    var color = d3.scaleOrdinal()
        //.domain(zCol)
        .range(scatterColor);
    
    $('#scatterTooltip').remove();

    createScatter(scatter, svg, data, x, y, color);
    createScatterTextLabel(scatter, svg, data, x, y);
    createScatterLegend(scatter, svg, width, color);
}

function createScatter(scatter, svg, data, x, y, color) {
    var scatterTooltip = d3.select("#" + scatter.divName).append("div").attr("id", "scatterTooltip").attr("class", "scatterTooltip").style("display", "none");

    svg.append("g")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + "," + (_scatterMarginTop + 30) + ")")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.X) })
        .attr("cy", function (d) { return y(d.Y) })
        .attr("r", 3)
        .style("fill", function (d) {
            return color(d.Z);
        })
        .on("mouseenter", function (event, d) {
            scatterTooltip
                .style("display", "inline-block")
                .style("position", "absolute")
                .html(parseInt(d.X) + "<br>" + parseInt(d.Y) + "<br>" + d.Z)
                .style("opacity", 1);

            var tooltipDiv = document.getElementById("scatterTooltip");
            var tooltipRect = tooltipDiv.getBoundingClientRect();

            var tooltipWidth = tooltipRect.width;

            scatterTooltip
                .transition()
                .duration(200)
                .style("left", _scatterMarginLeft + _scatterMarginRight + _scatterMarginRight + x(d.X) - (tooltipWidth / 2) + "px")
                .style("top", y(d.Y) + "px");
        })
        .on("mouseleave", function (d) {
            scatterTooltip
                .style("display", "none");
        });
}

function createScatterTextLabel(scatter, svg, data, x, y) {
    scatter.textLabel = svg.append("g")
        .selectAll("scatter")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + ", 60)")
        .append("text")
        .attr("id", "scatterTextLabel")
        .attr("class", "scatterTextLabel")
        .style("text-anchor", "left")
        .style("font-size", "12px")
        .attr("display", "none")
        .attr("x", function (d) { return x(d.X) })
        .attr("y", function (d) { return y(d.Y) });
}

function createScatterLegend(scatter, svg, width, color) {
    // group by zCol
    var uniqueNames = scatter.data.map(function (d) { return d.Z; }).filter((v, i, a) => a.indexOf(v) === i)

    var legend = svg.selectAll("legend")
        .data(uniqueNames)
        .enter()
        .append("g")
        .attr("class", "scatterLegend")
        .attr("id", function (d, idx) { return scatter.divName + "scatterLegend" + idx });

    if (width > 400 && scatter.isLegend == true) {
        legend.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("transform", function (d, idx) { return "translate(" + (width - 115) + "," + (10 + (idx * 15) + 30) + ")"; })
            .attr("fill", function (d) {
                //console.log(d);
                return color(d);
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