//
// D3 bar chart functions
//

const _marginTop = 30;
const _marginRight = 30;
const _marginLeft = 50;
const _marginBottom = 30;

var _bars = [];
var _activeBar;
var _svgHeight;
var _barColors = ['#e41a1c', '#377eb8', '#4daf4a', '#800080', '#333399', '#999999', '#FF00FF'];

function initBar(divName) {
    
    _bars.push({
        'divName': divName, 'xCol': null, 'yCol': null, 'data': null, 'svg': null, 'isLegend': true,
        'textLabel': null, 'isLabel': false,
        'isXValue': false, 'isYValue': false, 'isVertical': 1,
        'color': _barColors
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
    var bar = getBar(paneId);
    bar.xCol = xCol;    // Applicant
    bar.yCol = yCol;    // Elevation; Quantity_m3
    bar.color = color;

    // Y columns
    var yCols = yCol.split(';');

    var xyArray = [];
    if (!isInitial) {
        xyArray = bar.data;
    }
    else {
        var xy = [];
        for (i = 0; i < yCols.length; i++) {
            xy.push(groupBy(jsonData, xCol, yCols[i])); // 3 dimensional array
        }
        for (j = 0; j < xy[0].length; j++) {    // take first array length
            var s = { X: xy[0][j][xCol] };
            for (k = 0; k < yCols.length; k++) {
                s[yCols[k]] = xy[k][j][yCols[k]]
            }
            xyArray.push(s);
        }
    }
    return { barData: xyArray, colData: yCols, width: width, height: height, color: color }
}

function drawBar(divName, data, columns, width, height, barColor) {
    
    if (data == undefined)
        return null;

    var bar = getBar(divName);
    bar.data = data;    // make it global

    d3.select("#" + divName).selectAll("svg").remove();

    if (columns[0].length == 0) {
        $('#divColorPickerDropDown').remove();
        return;
    }
    //console.log(columns);

    _svgHeight = height - 30; // svg height will be 30px smaller than panel height to leave room for title

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", _svgHeight)
        .attr("class", "barChart")
        .attr("transform", "translate(0," + _marginTop + ")")
        .append("g");

    var stackedData = d3.stack()
        .keys(columns)
        (data)
        .map(d => (d.forEach(v => v.key = d.key), d));

    var x;
    var y;
    // x and y band
    if (bar.isVertical == 1) {
        if (width > 400 && bar.isLegend == true)
            x = d3.scaleBand().rangeRound([0, width - _marginLeft - _marginRight - 50 - 115]).padding(0.1);
        else
            x = d3.scaleBand().rangeRound([0, width - _marginLeft - _marginRight - 50]).padding(0.1);
        y = d3.scaleLinear().rangeRound([_svgHeight - _marginTop - _marginBottom - 30, 0]);
    }
    else {
        if (width > 400 && bar.isLegend == true)
            x = d3.scaleLinear().rangeRound([0, width - _marginLeft - _marginRight - 50 - 115]);
        else
            x = d3.scaleLinear().rangeRound([0, width - _marginLeft - _marginRight - 50]);
        y = d3.scaleBand().rangeRound([_svgHeight - _marginTop - _marginBottom - 30, 0]);
    }

    var yArray = [];
    for (i = 0; i < data.length; i++) {
        var str = '';
        for (j = 0; j < columns.length; j++) {
            str += data[i][columns[j]] + ',';
        }
        str = str.substring(0, str.length - 1);
        yArray.push(sumStr(str));
    }
    var yMax = Math.max(...yArray);

    if (bar.isVertical == 1) {
        x.domain(data.map(function (d) { return d.X; }));
        y.domain([0, yMax]);
    }
    else {
        x.domain([0, yMax]);
        y.domain(data.map(function (d) { return d.X; }));
    }

    // x-axis
    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (_marginLeft + _marginRight) + ", " + (_svgHeight - _marginTop - _marginBottom) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    // y-axis
    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (_marginLeft + _marginRight) + ", " + _marginTop + ")")
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

    var color = d3.scaleOrdinal()
        .domain(columns)
        //.range(['#e41a1c', '#377eb8', '#4daf4a', '#800080', '#333399', '#999999', '#FF00FF'])
        .range(barColor)

    $('#barTooltip').remove();

    // bar
    createBar(bar, svg, stackedData, x, y, color);
    createTextLabel(bar, svg, stackedData, x, y);
    createLegend(bar, svg, stackedData, width, color);

    axisTooltip(bar);

    return svg;
}

function createBar(bar, svg, stackedData, x, y, color) {
    var barTooltip = d3.select("#" + bar.divName).append("div").attr("id", "barTooltip").attr("class", "barTooltip").style("display", "none");
    var barTooltipTriangle = d3.select("#" + bar.divName).append("div").attr("class", "barTooltipTriangle").style("display", "none");
    
    var barSvg = svg.append("g")
        .selectAll("bar")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("fill", function (d) {
            //console.log(color(d.key));
            return color(d.key)
        })
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter()
        .append("rect")
        .attr("x", function (d) {
            if (bar.isVertical == 1)
                return x(d.data.X);
            else
                return x(d[0]);
        })
        .attr("y", function (d) {
            if (bar.isVertical == 1)
                return y(d[1]);
            else
                return y(d.data.X) + (y.bandwidth() / 4);
        })
        .attr("transform", "translate(" + (_marginLeft + _marginRight) + ", 30)")
        .on('mouseenter', function (event, d) {
            var subgroupName = d3.select(this.parentNode).datum().key;
            var subgroupValue = d.data[subgroupName];

            barTooltip
                .style("display", "inline-block")
                .style("position", "absolute")
                .html(subgroupName + "<br>" + subgroupValue)
                .style("opacity", 1)

            if (bar.isVertical == 1) {
                barTooltip
                    .transition()
                    .duration(200)
                    .style("left", _marginLeft + _marginRight + x(d.data.X) + (x.bandwidth() / 2) - (($('#barTooltip').width() / 2) + 8) + "px") // (box size / 2) + padding: 8
                    .style("top", y(d[1]) + 5 + "px");

                barTooltipTriangle
                    .transition()
                    .duration(200)
                    .style("left", _marginLeft + _marginRight + x(d.data.X) + (x.bandwidth() / 2) - 5 + "px")
                    .style("top", y(d[1]) + 40 + "px");

                barTooltipTriangle
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html("&#x25BC");
            }
            else {
                barTooltip
                    .transition()
                    .duration(200)
                    .style("left", _marginLeft + _marginRight + x(d[1]) + 15 + "px")
                    .style("top", _marginTop + _marginTop + y(d.data.X) + (y.bandwidth() / 2) - 20 + "px")

                barTooltipTriangle
                    .transition()
                    .duration(200)
                    .style("left", x(d[1]) + _marginLeft + _marginRight + 6 + "px")
                    .style("top", _marginTop + _marginTop + y(d.data.X) + (y.bandwidth() / 2) - 10 + "px");

                barTooltipTriangle
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html("&#x25C0");
            }
        })
        .on("mouseleave", function (d) {
            barTooltip.style("display", "none");
            barTooltipTriangle.style("display", "none");
        });

    if (bar.isVertical == 1) {
        barSvg
            .attr("width", x.bandwidth())
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
    }
    else {
        barSvg
            .attr("width", function (d) { return x(d[1]) - x(d[0]); })
            .attr("height", (y.bandwidth() / 2));
    }
}

function createTextLabel(bar, svg, stackedData, x, y) {
    var barTextLabel = bar.textLabel = svg.append("g")
        .selectAll("bar")
        .data(stackedData)
        .enter()
        .append("g")
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter()
        .append("text")
        .attr("id", "barTextLabel")
        .attr("class", "barTextLabel")
        .style("text-anchor", "left")
        .style("font-size", "12px")
        .attr("display", "none");

    if (bar.isVertical == 1) {
        barTextLabel
            .attr("x", function (d) { return x(d.data.X) })
            .attr("y", function (d) { return y(d[1]) })
            .attr("transform", "translate(" + (_marginLeft + _marginRight + (x.bandwidth() / 2)) + ", 30)");
    }
    else {
        barTextLabel
            .attr("x", function (d) { return x(d[0]) })
            .attr("y", function (d) { return y(d.data.X) + (y.bandwidth() / 2) })
            .attr("transform", "translate(" + (_marginLeft + _marginRight + (y.bandwidth() / 2)) + ", 30)");
    }
}

function createLegend(bar, svg, stackedData, width, color) {
    var legend = svg.selectAll("legend")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "barLegend")
        .attr("id", function (d, idx) { return bar.divName + "barLegend" + idx });

    if (width > 400 && bar.isLegend == true) {
        legend.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("transform", function (d, idx) { return "translate(" + (width - 115) + "," + (10 + (idx * 15)) + ")"; })
            .attr("fill", function (d) { return color(d.key) });

        legend.append("text")
            .attr("transform", function (d, idx) { return "translate(" + (width - 100) + "," + (13 + (idx * 15)) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "8px")
            .text(function (d) {
                return d.key;
            })
    }
}

function axisTooltip(bar) {
    var axisLabelTooltip = d3.select("#" + bar.divName).append("div").attr("class", "axisLabelTooltip").style("display", "none");

    if (bar.isVertical == 1) {
        d3.select("#" + bar.divName)
            .selectAll(".x .tick")
            .data(bar.data)
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
        d3.select("#" + bar.divName)
            .selectAll(".y .tick")
            .data(bar.data)
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
}

function wrap(text, width, height) {
    text.each(function (idx, elem) {
        var text = $(elem);
        text.attr("dy", height);
        var words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (elem.getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}