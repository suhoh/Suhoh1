//
// D3 bar chart functions
//

//var _barData;
//var _barSvg = null;

var _bars = [];
var _activeBar;

function initBar_old(divName) {
    _bars.push({
        'divName': divName, 'xCol': null, 'yCol': null, 'data': null, 'svg': null, 'isLegend': true,
        'textLabel': null, 'color': 1, 'isLabel': false,
        'isXValue': false, 'isYValue': false, 'color': '#FF6600', 'isVertical': 1
    })

    //for (i = 0; i < _testStackBarData.length; i++) {
    //    var a = _testStackBarData[i].Y.split(',');
    //}
}

function getBar_old(divName) {
    for (i = 0; i < _bars.length; i++) {
        if (_bars[i].divName == divName)
            return _bars[i]
    }
    return null;
}

function getBarData_old(paneId, jsonData, xCol, yCol, color, isInitial) {
    if (jsonData == null)
        return null;

    var bGraph = splitterMain.GetPaneByName(paneId);
    var width = bGraph.GetClientWidth();
    var height = bGraph.GetClientHeight();
    //var min = Math.min(width, height);

    var bar = getBar(paneId);
    bar.xCol = xCol;    // Applicant
    bar.yCol = yCol;    // Elevation; Quantity_m3
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

function drawBar_old(divName, data, width, height, barColor) {
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
    var axisLabelTooltip = d3.select("#" + divName).append("div").attr("class", "axisLabelTooltip").style("display", "none");
    //var barTextLabel = d3.select("#" + divName).append("div").attr("class", "barTextLabel").style("display", "none");

    // bar
    if (bar.isVertical == 1) {
        svg.selectAll("bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .style("fill", barColor)
            .attr("x", function (d) { return x(d.X); })
            .attr("y", function (d) { return y(d.Y) - 5; })
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return svgHeight - y(d.Y) - marginTop - marginBottom - 30; })
            .attr("transform", "translate(" + (marginLeft + marginRight) + ", 35)")
            .on("mouseenter", function (event, d) {
                barTooltip
                    .transition()
                    .duration(200)
                    .style("left", marginLeft + marginRight + x(d.X) + "px")
                    .style("top", y(d.Y) + 6 + "px");

                barTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html(d.X + "<br/>" + (d.Y).toFixed(1));

                barTooltipTriangle
                    .transition()
                    .duration(200)
                    .style("left", marginLeft + marginRight + x(d.X) + (x.bandwidth() / 2) - 5 + "px")
                    .style("top", y(d.Y) + 40 + "px");

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
            .attr("x", marginLeft + marginRight + 1)
            .attr("y", function (d) {
                console.log(y(d.X));
                return marginTop + y(d.X) + (y.bandwidth() / 6);
            })
            .attr("height", y.bandwidth() / 1.5)
            .attr("width", function (d) {
                if (x(d.Y) < 0)
                    return;
                else
                    return x(d.Y);
            })
            .on("mouseenter", function (event, d) {
                barTooltip
                    .transition()
                    .duration(200)
                    .style("left", marginLeft + marginRight + x(d.Y) + 15 + "px")
                    .style("top", marginTop + marginTop + y(d.X) + (y.bandwidth() / 2) - 20 + "px")

                barTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html(d.X + "<br/>" + (d.Y).toFixed(1));

                barTooltipTriangle
                    .transition()
                    .duration(200)
                    .style("left", x(d.Y) + marginLeft + marginRight + 6 + "px")
                    .style("top", marginTop + marginTop + y(d.X) + (y.bandwidth() / 2) - 10 + "px");

                barTooltipTriangle
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html("&#x25C0");
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
            .attr("x", function (d) { return marginLeft + marginRight + (x(d.Y) / 2) })
            .attr("y", function (d) { return marginTop + y(d.X) + (y.bandwidth() / 2) + 5 })
            .style("text-anchor", "left")
            .style("font-size", "12px")
            .attr("display", "none");

        //barTextLabel
        //    .transition()
        //    .duration(200)
        //    .style("left", marginLeft + marginRight + 30 + "px")
        //    .style("top", marginTop + y(d.X) + (y.bandwidth() / 2) + 5 + "px")

        //barTextLabel
        //    .style("display", "inline-block")
        //    .style("position", "absolute")
        //    .html(d.X + "<br/>" + (d.Y).toFixed(1));
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

    if (bar.isVertical == 1) {
        d3.select("#" + divName)
            .selectAll(".x .tick")
            .data(data)
            .on("mouseover", function (event, d) {
                axisLabelTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .style("height", 12 + "px")
                    .html(d.X)
                    .style("left", event.offsetX + "px")
                    .style("top", event.offsetY - 25 + "px");
            })
            .on("mouseleave", function (d) {
                axisLabelTooltip.style("display", "none");
            });
    }
    else {
        d3.select("#" + divName)
            .selectAll(".y .tick")
            .data(data)
            .on("mouseover", function (event, d) {
                axisLabelTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .style("height", 12 + "px")
                    .html(d.X)
                    .style("left", event.offsetX + "px")
                    .style("top", event.offsetY - 25 + "px");
            })
            .on("mouseleave", function (d) {
                axisLabelTooltip.style("display", "none");
            });
    }


    return svg;
}