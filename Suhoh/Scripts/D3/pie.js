//
// D3 chart functions
//
// paneName = divName
// { 'data': data, 'svg': svg, 'sum': sum, 'textLabel': textLabel, 'colorRamp': colorRamp, 'isLabel': isLabel }
var _pies = [];     
var _activePie;


//var _pieData;
//var _pieSvg = null;
//var _pieTextLabel;

function initPie(divName) {
    _pies.push({
        'divName': divName, 'xCol': null, 'yCol': null, 'data': null, 'svg': null, 'sum': null, 'isLegend': true,
        'textLabel': null, 'colorRamp': null, 'isLabel': false,
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

function drawPie(divName, data, width, height, radius) {

    tbPropertyTitleKeyUp(divName);

    if (data == undefined)
        return null;

    var pie = getPie(divName);
    pie.data = data;    // make it global

    pie.sum = d3.sum(pie.data, function (d) { return d.Y });
    d3.select("#" + divName).selectAll("svg").remove();

    var margin = 40;
    //var innerRadius = radius * 0.3;
    var innerRadius = 0;
    var outerRadius = radius * 0.7;
    var arcInRadius = radius * 0.7;
    var arcOverRadius = radius * 0.75;
    
    //var color = d3.scaleOrdinal(d3.schemeCategory10);

    var color = interpolateColors(data.length, _colorScale, _colorRangeInfo);

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g");
        //.attr("transform", "translate(-115 0)");
        
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
            })
            .on("mouseleave", function (data) {
                d3.select(this)
                    .attr("stroke", "black")
                    .transition()
                    .duration(200)
                    .attr("d", arcIn)
                    .attr("stroke-width", 2);
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

    //chkPieLabelClicked();

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