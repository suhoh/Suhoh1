//
// D3 pie chart functions
//

var _pies = [];     
var _activePie;


//var _pieData;
//var _pieSvg = null;
//var _pieTextLabel;

function initPie(divName) {
    _pies.push({
        'title': null, 'divName': divName, 'xCol': null, 'yCol': null, 'data': null, 'svg': null, 'sum': null, 'isLegend': true,
        'textLabel': null, 'colorRamp': 1, 'isLabel': false,
        'isPercentage': false, 'isYValue': false, 'isXValue': false
    })
}

function getPie(divName) {
    for (i = 0; i < _pies.length; i++) {
        if (_pies[i].divName == divName)
            return _pies[i]
    }
    return null;
}

function getPieData(paneId, jsonData, xCol, yCol, isInitial) {
    if (jsonData == null)
        return null;

    var pGraph = splitterMain.GetPaneByName(paneId);
    var width = pGraph.GetClientWidth();
    var height = pGraph.GetClientHeight();
    var min = Math.min(width, height);

    var pie = getPie(paneId);
    pie.xCol = xCol;
    pie.yCol = yCol;
    var xyArray = [];
    if (!isInitial) {
        xyArray = pie.data;
    }
    else {
        var xy = groupBy(jsonData, xCol, yCol);
        for (i = 0; i < xy.length; i++) {
            xyArray.push({ "X": xy[i][xCol], "Y": xy[i][yCol] });
        }
    }

    return { pieData: xyArray, width: width, height: height, min: min }
}

function drawPie(divName, data, width, height, radius) {
    if (data == undefined)
        return null;

    var pie = getPie(divName);
    pie.data = data;    // make it global

    pie.sum = d3.sum(pie.data, function (d) { return d.Y });
    d3.select("#" + divName).selectAll("svg").remove();

    var innerRadius = 0;
    var outerRadius = radius * 0.7;
    var arcInRadius = radius * 0.7;
    var arcOverRadius = radius * 0.75;
    var colorTheme;

    if (pie.colorRamp == 1)
        colorTheme = _colorScaleHSL;
    else if (pie.colorRamp == 2)
        colorTheme = _colorScaleRainbow;
    else if (pie.colorRamp == 3)
        colorTheme = _colorScaleViridis;
    else if (pie.colorRamp == 4)
        colorTheme = _colorScaleCool;
    else if (pie.colorRamp == 5)
        colorTheme = _colorScaleHcl;
    else
        colorTheme = _colorScaleGrey;

    var color = interpolateColors(data.length, colorTheme, _colorRangeInfo);

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");
        
    var pieData = d3.pie()
        .value(function (d) { return d.Y; })
        (data);

    var arc = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .padAngle(.01)
        .padRadius(50);

    var arcOver = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(arcOverRadius)
        .padAngle(.01)
        .padRadius(50);

    var arcIn = d3.arc()
        .innerRadius(innerRadius)
        .outerRadius(arcInRadius)
        .padAngle(.01)
        .padRadius(50);

    var pieTooltip = d3.select("#" + divName).append("div").attr("class", "pieTooltip").style("display", "none");

    if (width > 400 && pie.isLegend == true) {
        svg.selectAll("allSlices")
            .data(pieData)
            .enter()
            .append("path")
            .attr('d', arc)
            .attr("fill", function (d, idx) { return (color[idx]) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .attr("transform", "translate(" + ((width - 115) / 2) + "," + height / 2 + ")")
            .on("mouseenter", function (event, d) {
                d3.select(this)
                    .attr("stroke", "black")
                    .transition()
                    .duration(200)
                    .attr("d", arcOver)
                    .attr("stroke-width", 2);

                pieTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute");
            })
            .on("mousemove", function (event, d) {
                pieTooltip
                    .html(d.data.X + "<br/>" + (d.data.Y).toFixed(1) + "<br/>" + Math.round((d.data.Y / pie.sum) * 100).toFixed(1) + "%")
                    .style("left", event.offsetX + 10 + "px")
                    .style("top", event.offsetY - 60 + "px")
            })
            .on("mouseleave", function (d) {
                d3.select(this)
                    .attr("stroke", "black")
                    .transition()
                    .duration(200)
                    .attr("d", arcIn)
                    .attr("stroke-width", 2);

                pieTooltip.style("display", "none");
            });
    }
    else {
        svg.selectAll("allSlices")
            .data(pieData)
            .enter()
            .append("path")
            .attr('d', arc)
            .attr("fill", function (d, idx) { return (color[idx]) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7)
            .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")")
            .on("mouseenter", function (data) {
                d3.select(this)
                    .attr("stroke", "black")
                    .transition()
                    .duration(200)
                    .attr("d", arcOver)
                    .attr("stroke-width", 2);

                pieTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute");
            })
            .on("mousemove", function (event, d) {
                pieTooltip
                    .html(d.data.X + "<br/>" + (d.data.Y).toFixed(1) + "<br/>" + Math.round((d.data.Y / pie.sum) * 100).toFixed(1) + "%")
                    .style("left", event.offsetX + 10 + "px")
                    .style("top", event.offsetY - 60 + "px")
            })
            .on("mouseleave", function (data) {
                d3.select(this)
                    .attr("stroke", "black")
                    .transition()
                    .duration(200)
                    .attr("d", arcIn)
                    .attr("stroke-width", 2);

                pieTooltip.style("display", "none");
            });
    }

    var g = svg.append("g")
    if (pie.isLegend == true) {
        g.attr("transform", "translate(" + ((width - 115) / 2) + "," + ((height / 2) + 5) + ")");
    }
    else {
        g.attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");
    }

    pie.textLabel = g.selectAll("allSlices")
            .data(pieData)
            .enter()
            .append('text')
            .attr("transform", function (d) { return "translate(" + (arc.centroid(d)) + ")"; })
            .style("text-anchor", "middle")
            .style("font-size", 12)
            .attr("display", "none");

    var legend = svg.selectAll(".legend")
        .data(data)
        .enter().append("g")
        .attr("class", "D3Legend")
        .attr("id", function (d, idx) { return "D3Legend" + idx});

    if (width > 400 && pie.isLegend == true) {
        legend.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("transform", function (d, idx) { return "translate(" + (width - 115) + "," + (40 + (idx * 15)) + ")"; })
            .attr("fill", function (d, idx) { return (color[idx]) });

        legend.append("text")
            .attr("transform", function (d, idx) { return "translate(" + (width - 100) + "," + (43 + (idx * 15)) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "8px")
            .text(function (data) { return data.X; });
    }

    return svg;
}