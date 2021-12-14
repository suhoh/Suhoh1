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
    
    var scatter = getScatter(divName);
    scatter.data = data;

    _scatterSvgHeight = height - 30;

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", _scatterSvgHeight)
        .attr("class", "scatterChartSvg")
        .attr("transform", "translate(0," + _scatterMarginTop + ")")
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

    // x-axis
    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + "," + (_scatterSvgHeight - _scatterMarginTop - _scatterMarginBottom) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    // y-axis
    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + ", " + _scatterMarginTop + ")")
        .call(yAxis);

    // y-axis label
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", "25px")
        .attr("x", (30 - (height / 2)) + "px")
        .style("text-anchor", "middle")
        .attr("font-weight", "bold")
        .text(scatter.yCol);

    var color = d3.scaleOrdinal()
        //.domain(zCol)
        .range(scatterColor);

    $('#scatterTooltip_' + divName).remove();

    createScatter(scatter, svg, data, width, height, x, y, color);
    createScatterTextLabel(scatter, svg, data, x, y);
    createScatterLegend(scatter, svg, width, color);
}

function createScatter(scatter, svg, data, width, height, x, y, color) {
    var scatterTooltip = d3.select("#" + scatter.divName).append("div").attr("id", "scatterTooltip_" + scatter.divName).attr("class", "scatterTooltip").style("display", "none");

    // Scatter
    svg.append("g")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + "," + _scatterMarginTop + ")")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.X) })
        .attr("cy", function (d) { return y(d.Y) })
        .attr("r", 4)
        .style("fill", function (d) {
            return color(d.Z);
        })
        .attr("clip-path", "url(#rect-clip)")
        .on("mouseenter", function (event, d) {
            scatterTooltip
                .style("display", "inline-block")
                .style("position", "absolute")
                .html(parseInt(d.X) + "<br>" + parseInt(d.Y) + "<br>" + d.Z)
                .style("opacity", 1);

            //var tooltipDivWidth = document.getElementById("scatterTooltip");
            //var tooltipWidth = tooltipDivWidth.clientWidth;

            //var tooltipWidth = $("#scatterTooltip").width();

            scatterTooltip
                .transition()
                .duration(200)
                //.style("left", _scatterMarginLeft + _scatterMarginRight + x(d.X) - (tooltipWidth / 2) + "px")
                .style("left", _scatterMarginLeft + _scatterMarginRight + x(d.X) - ($("#scatterTooltip_" + scatter.divName).width() / 2) + "px")
                .style("top", y(d.Y) + "px");

            console.log($("#scatterTooltip_" + scatter.divName).width());
        })
        .on("mouseleave", function (d) {
            scatterTooltip
                .style("display", "none");
        });

    // clip Path
    var clipX;
    if (width > 400 && scatter.isLegend == true)
        clipX = width - 244;
    else
        clipX = width - 130;
    var clipY = height - 120;

    svg.append("clipPath")
        .attr("id", "rect-clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", clipX)
        .attr("height", clipY);

    // border
    svg.append("rect")
        .attr("x", _scatterMarginLeft + _scatterMarginRight)
        .attr("y", _scatterMarginTop)
        .attr("width", clipX)
        .attr("height", clipY)
        .style("stroke", "black")
        .style("fill", "none")
        .style("stroke-width", "1px");

    // gridlines
    var scatterXGridlines = d3.axisBottom(x)
        .tickSize(clipY)
        .tickFormat('')
        .ticks(10);

    var scatterYGridlines = d3.axisLeft(y)
        .tickSize(-clipX)
        .tickFormat("")
        .ticks(10);
       
    svg.append("g")
        .attr("class", "scatterGrid")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + "," + _scatterMarginTop + ")")
        .call(scatterXGridlines);
    
    svg.append("g")
        .attr("class", "scatterGrid")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + ", " + _scatterMarginTop + ")")
        .call(scatterYGridlines);

    // zoom

    var zoom = d3.zoom()
        .scaleExtent([.5, 20])  // This control how much you can unzoom (x0.5) and zoom (x20)
        .extent([[0, 0], [1000, 1000]])
        .on("zoom", updateChart);

    svg.append("rect")
        .attr("width", 1000)
        .attr("height", 1000)
        .style("fill", "none")
        .style("pointer-events", "all")
        .attr('transform', 'translate(30, 30)')
        .call(zoom);

    function updateChart() {
        console.log('entered');
        var newX = d3.event.transform.rescaleX(x);
        var newY = d3.event.transform.rescaleY(y);
    }

}

function createScatterTextLabel(scatter, svg, data, x, y) {
    scatter.textLabel = svg.append("g")
        .selectAll("scatter")
        .data(data)
        .enter()
        .append("g")
        .attr("transform", "translate(" + (_scatterMarginLeft + _scatterMarginRight) + "," + _scatterMarginTop + ")")
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
            .attr("transform", function (d, idx) { return "translate(" + (width - 115) + "," + (10 + (idx * 15)) + ")"; })
            .attr("fill", function (d) {
                return color(d);
            });

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