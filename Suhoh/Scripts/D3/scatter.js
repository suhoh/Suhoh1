//
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
        'isXValue': false, 'isYValue': false,
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
        sData.push({ 'X': gb[s][xCol], 'Y': gb[s][yCol], 'Z': gb[s][zCol] });
    }

    return { scatterData: sData, xCol: scatter.xCol, yCol: scatter.yCol, zCol: scatter.zCol, width: width, height: height, color: color }
}

function drawScatter(divName, data, xCol, yCol, zCol, width, height, scatterColor) {
    d3.select("#" + divName).selectAll("svg").remove();
    _scatterSvgHeight = height - 30;

    var scatter = getScatter(divName);
    scatter.data = data;

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "lineChartSvg")
        .attr("transform", "translate(0" + _lineMarginTop + ")")
        .append("g");

    var x;
    var y;

    if (width > 400 && scatter.isLegend == true)
        x = d3.scaleLinear().range([0, width - _scatterMarginLeft - _scatterMarginRight - 50 - 115]);
    else
        x = d3.scaleLinear().range([0, width - _scatterMarginLeft - _scatterMarginRight - 50]);
    y = d3.scaleLinear().range([_scatterSvgHeight - _scatterMarginTop - _scatterMarginBottom - 30, 0]);

    x.domain([0, d3.max(data, function (d) {
        return d.x;
    })]);
    y.domain([0, d3.max(data, function (d) {
        return d.y;
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

    //var clipX = width - _scatterMarginRight;

    //var xGridlines = d3.axisBottom()
    //    .tickFormat("")
    //    .tickSize(-clipX)
    //    .scale(x);

    var dataPoints = svg.append("g")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + "," + (_scatterMarginTop + 30) + ")")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.x) })
        .attr("cy", function (d) { return y(d.y) })
        .attr("r", 3);
        //.call(xGridlines);


 
}

