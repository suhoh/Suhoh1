﻿//
// D3 bar chart functions
//

//var _barData;
//var _barSvg = null;

var _bars = [];
var _activeBar;

function initBar(divName) {
    _bars.push({
        'divName': divName, 'xCol': null, 'yCol': null, 'data': null, 'svg': null, 'isLegend': true,
        'textLabel': null, 'color': 1, 'isLabel': false,
        'isXValue': false, 'isYValue': false, 'color': '#FF6600', 'isVertical': 1
    })
}

function getBar(divName) {
    for (i = 0; i < _bars.length; i++) {
        if (_bars[i].divName == divName)
            return _bars[i]
    }
    return null;
}

function getBarData(paneId, jsonData, xCol, yCol, color, isInitial) {
    if (jsonData == null)
        return null;

    var bGraph = splitterMain.GetPaneByName(paneId);
    var width = bGraph.GetClientWidth();
    var height = bGraph.GetClientHeight();
    //var min = Math.min(width, height);

    var bar = getBar(paneId);
    bar.xCol = xCol;
    bar.yCol = yCol;
    bar.color = color;

    var xyArray = [];
    if (!isInitial) {
        xyArray = bar.data;
    }
    else {
        var xy = groupBy(jsonData, xCol, yCol);
        for (i = 0; i < xy.length; i++) {
            xyArray.push({ "X": xy[i][xCol], "Y": xy[i][yCol] });
        }
    }

    //return { barData: xyArray, width: width, height: height, min: min, color: color }
    return { barData: xyArray, width: width, height: height, color: color }
}

function drawBar(divName, data, width, height, barColor) {
    var svgHeight = height - 30; // svg height will be 30px smaller than panel height to leave room for title
    var marginTop = 30;
    var marginRight = 30;
    var marginLeft = 50;
    var marginBottom = 30;

    if (data == undefined)
        return null;

    var bar = getBar(divName);
    bar.data = data;    // make it global

    d3.select("#" + divName).selectAll("svg").remove();

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", svgHeight)
        .attr("class", "barChart")
        .attr("transform", "translate(0," + marginTop + ")")
        .append("g");

    var x;
    var y;
    // x and y band
    if (bar.isVertical == 1) {
        if (width > 400 && bar.isLegend == true)
            x = d3.scaleBand().rangeRound([0, width - marginLeft - marginRight - 50 - 115]).padding(0.1);
        else
            x = d3.scaleBand().rangeRound([0, width - marginLeft - marginRight - 50]).padding(0.1);
        y = d3.scaleLinear().rangeRound([svgHeight - marginTop - marginBottom - 30, 0]);
    }
    else {
        if (width > 400 && bar.isLegend == true)
            x = d3.scaleLinear().rangeRound([0, width - marginLeft - marginRight - 50 - 115]);
        else
            x = d3.scaleLinear().rangeRound([0, width - marginLeft - marginRight - 50]);
        y = d3.scaleBand().rangeRound([svgHeight - marginTop - marginBottom - 30, 0]);
    }

    if (bar.isVertical == 1) {
        x.domain(data.map(function (d) { return d.X; }));
        y.domain([0, d3.max(data, function (d) { return d.Y; })]);
    }
    else {
        x.domain([0, d3.max(data, function (d) { return d.Y; })]);
        y.domain(data.map(function (d) { return d.X; }));
    }
    // x-axis
    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (marginLeft + marginRight) + ", " + (svgHeight - marginTop - marginBottom) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    // y-axis
    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (marginLeft + marginRight) + ", " + marginTop + ")")
        .call(yAxis);

    var yColumn = bar.yCol;
    if (bar.isVertical == 1) {
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", "25px")
            .attr("x", (30 - (height / 2)) + "px")
            .style("text-anchor", "middle")
            .attr("font-weight", "bold")
            .text(yColumn);
    }
    else {
        if (width > 400 && bar.isLegend == true) {
            svg.append("text")
                .attr("x", ((width - 115) / 2) + "px")
                .attr("y", (height - 40) + "px")
                .style("text-anchor", "middle")
                .attr("font-weight", "bold")
                .text(yColumn);
        }
        else {
            svg.append("text")
                .attr("x", (width / 2) + "px")
                .attr("y", (height - 40) + "px")
                .style("text-anchor", "middle")
                .attr("font-weight", "bold")
                .text(yColumn);
        }
    }

    var barTooltip = d3.select("#" + divName).append("div").attr("class", "barTooltip").style("display", "none");
    var barTooltipTriangle = d3.select("#" + divName).append("div").attr("class", "barTooltipTriangle").style("display", "none");

    // bar
    if (bar.isVertical == 1) {
        svg.selectAll("bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .style("fill", barColor)
            .attr("x", function (d) { return x(d.X); })
            .attr("y", function (d) { return y(d.Y); })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return svgHeight - y(d.Y) - marginTop - marginBottom - 30; })
            .attr("transform", "translate(" + (marginLeft + marginRight) + ", 30)")
            .on("mouseenter", function (event, d) {
                barTooltip
                    .transition()
                    .duration(200)
                    .style("left", marginLeft + marginRight + x(d.X) + "px")
                    .style("top", event.offsetY + (y(d.Y) - event.offsetY) + 6 + "px");

                barTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html(d.X + "<br/>" + (d.Y).toFixed(1));

                barTooltipTriangle
                    .transition()
                    .duration(200)
                    .style("left", marginLeft + marginRight + x(d.X) + (x.bandwidth() / 2) - 5 + "px")
                    .style("top", event.offsetY + (y(d.Y) - event.offsetY) + 40 + "px")

                barTooltipTriangle
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html("&#x25BC");
            })

            .on("mouseleave", function (d) {
                barTooltip.style("display", "none");
                barTooltipTriangle.style("display", "none");
            });

        var g = svg.append("g")

        bar.textLabel = g.selectAll("text")
            .data(data)
            .enter()
            .append('text')
            .attr("transform", "translate(" + (marginLeft + marginRight) + "," + (height / 2) + ")")
            .attr("x", function (d) { return x(d.X) + x.bandwidth() / 2 })
            .attr("y", function (d) { return (y(d.Y) / 2) - 25 })
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .attr("display", "none");
    }
    else {
        svg.selectAll("bar")
            .data(data)
            .enter()
            .append("rect")
            .style("fill", barColor)
            .attr("x", marginLeft + marginRight)
            .attr("y", function (d) { return y(d.X) + marginTop + (y.bandwidth() / 4); })
            .attr("height", y.bandwidth() / 2)
            .attr("width", function (d) {
                if (x(d.Y) < 0)
                    return;
                else
                    return x(d.Y);
            })
            .on("mouseenter", function (event, d) {
                barTooltip
                    .transition()
                    .duration(100)
                    .style("opacity", 0.7)
                    .attr("stroke", "black")
                    .attr("stroke-width", 2);

                barTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute");
            })
            .on("mousemove", function (event, d) {
                barTooltip
                    .html(d.X + "<br/>" + (d.Y).toFixed(1))
                    .style("left", event.offsetX - 15 + "px")
                    .style("top", event.offsetY - 15 + "px")
            })
            .on("mouseleave", function (d) {
                barTooltip.style("display", "none");
            });
    }

    var xColumn = bar.xCol;
    var d = [];
    d.push('');

    var legend = svg.selectAll("legend")
        .data(d)
        .enter()
        .append("g")
        .attr("class", "barLegend")
        .attr("id", function (d, idx) { return bar.divName + "barLegend" + idx });

    if (width > 400 && bar.isLegend == true) {
        legend.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("transform", function (d, idx) { return "translate(" + (width - 115) + "," + (10 + (idx * 15)) + ")"; })
            .attr("fill", barColor);

        legend.append("text")
            .attr("transform", function (d, idx) { return "translate(" + (width - 100) + "," + (13 + (idx * 15)) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "8px")
            .text(xColumn);
    }

    d3.selectAll(".x .tick")
        .data(data)
        .on("mouseover", function (event, d) {
            barTooltip
                .style("display", "inline-block")
                .style("position", "absolute")
                .html(d.X)
                .style("left", event.offsetX + "px")
                .style("top", event.offsetY - 25 + "px");
        })
        .on("mouseleave", function (d) {
            barTooltip.style("display", "none");
        });


    return svg;
}