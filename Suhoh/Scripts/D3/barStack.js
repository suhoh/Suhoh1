//
// D3 bar chart functions
//

//var _barData;
//var _barSvg = null;

var _bars = [];
var _activeBar;
//var _testStackBarData = [{ 'X': 'banana', 'Y1': 12, 'Y2': 1, 'Y3': 13 }, { 'X': 'poacee', 'Y1': 6, 'Y2': 6, 'Y3': 33 }, { 'X': 'sorgho', 'Y1': 11, 'Y2': 28, 'Y3': 12 }];
var _testStackBarData = [{ 'X': 'banana', 'Y 1': 12, 'Y2': 1 }, { 'X': 'poacee', 'Y 1': 6, 'Y2': 6 }, { 'X': 'sorgho', 'Y 1': 11, 'Y2': 28 }];
//var _testStackBarDataColumns = ['Y1', 'Y2', 'Y3'];
var _testStackBarDataColumns = ['Y 1', 'Y2'];

function initBar(divName) {
    _bars.push({
        'divName': divName, 'xCol': null, 'yCol': null, 'data': null, 'svg': null, 'isLegend': true,
        'textLabel': null, 'color': 1, 'isLabel': false,
        'isXValue': false, 'isYValue': false, 'color': '#FF6600', 'isVertical': 1
    })

    //for (i = 0; i < _testStackBarData.length; i++) {
    //    var a = _testStackBarData[i].Y.split(',');
    //}
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
    bar.xCol = xCol;    // Applicant
    bar.yCol = yCol;    // Elevation; Quantity_m3
    bar.color = color;

    // Y columns
    var yCols = yCol.split(';');
    //var colArray = [];
    //var col = '';
    //for (i = 0; i < yCols.length; i++)
    //    col += yCols[i] + ",";
    //col = col.substring(0, col.length - 1);
    //colArray.push(col);

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

    //return { barData: xyArray, width: width, height: height, min: min, color: color }
    return { barData: xyArray, colData: yCols, width: width, height: height, color: color }
}

function drawBar(divName, data, columns, width, height, barColor) {
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
    
    var yArray = [];
    for (i = 0; i < data.length; i++) {
        //yArray.push(sumStr(data[i].Y1 + ',' + data[i].Y2 + ',' + data[i].Y3));
        var str = '';
        for (j = 0; j < columns.length; j++) {
            str += data[i][columns[j]] + ',';
        }
        str = str.substring(0, str.length - 1);
        yArray.push(sumStr(str));
    }
    var yMax = Math.max(...yArray);

    var subGroup = data.slice(1);
    //console.log(subGroup);

    var stackedData = d3.stack()
        .keys(columns)
        (data)
        .map(d => (d.forEach(v => v.key = d.key), d));
        
    if (bar.isVertical == 1) {
        x.domain(data.map(function (d) { return d.X; }));
        //y.domain([0, d3.max(data, function (d) { return d.Y; })]);
        y.domain([0, yMax]);
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

    var color = d3.scaleOrdinal()
        .domain(columns)
        .range(['#e41a1c', '#377eb8', '#4daf4a'])

    $('#barTooltip').remove();

    var barTooltip = d3.select("#" + divName).append("div").attr("id", "barTooltip").attr("class", "barTooltip").style("display", "none");
    var barTooltipTriangle = d3.select("#" + divName).append("div").attr("class", "barTooltipTriangle").style("display", "none");
    var axisLabelTooltip = d3.select("#" + divName).append("div").attr("class", "axisLabelTooltip").style("display", "none");
    //var barTextLabel = d3.select("#" + divName).append("div").attr("id", "barTextLabel").attr("class", "barTextLabel").style("display", "none");

    // bar
    if (bar.isVertical == 1) {
        svg.append("g")
            .selectAll("bar")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("fill", function (d) { return color(d.key) })
            .selectAll("rect")
            .data(function (d) { return d; })
            .enter()
            .append("rect")
            .attr("x", function (d) { return x(d.data.X) })
            .attr("y", function (d) { return y(d[1]); })
            .attr("height", function (d) { return y(d[0]) - y(d[1]); })
            .attr("width", x.bandwidth())
            .attr("transform", "translate(" + (marginLeft + marginRight) + ", 30)")
            .on('mouseenter', function (event, d) {
                var subgroupName = d3.select(this.parentNode).datum().key;
                var subgroupValue = d.data[subgroupName];

                barTooltip
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html(subgroupName + "<br>" + subgroupValue)
                    .style("opacity", 1)

                barTooltip
                    .transition()
                    .duration(200)
                    .style("left", marginLeft + marginRight + x(d.data.X) + (x.bandwidth() / 2) - (($('#barTooltip').width() / 2) + 8) + "px") // (box size / 2) + padding: 8
                    .style("top", y(d[1]) + 5 + "px");

                barTooltipTriangle
                    .transition()
                    .duration(200)
                    .style("left", marginLeft + marginRight + x(d.data.X) + (x.bandwidth() / 2) - 5 + "px")
                    .style("top", y(d[1]) + 40 + "px");

                barTooltipTriangle
                    .style("display", "inline-block")
                    .style("position", "absolute")
                    .html("&#x25BC");
            })
            .on("mouseleave", function (d) {
                barTooltip.style("display", "none");
                barTooltipTriangle.style("display", "none");
            });

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
        
    bar.textLabel = svg.append("g")
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
        .attr("x", function (d) { return x(d.data.X) })
        .attr("y", function (d) { return y(d[1]) })
        .attr("transform", "translate(" + (marginLeft + marginRight + (x.bandwidth() / 2)) + ", 30)")
        .style("text-anchor", "left")
        .style("font-size", "12px")
        .attr("display", "none");
      
    return svg;
}