﻿//
// D3 chart functions
//

var _pieData;
var _pieSvg = null;
var _pieTextLabel;
var _isD3Label;

function drawPie(divName, data, width, height, radius) {
    if (data == undefined)
        return;

    _pieData = data;
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

    var pieLegendData

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

    if (width > 400) {
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
        .attr("transform", "translate(" + ((width - 115) / 2) + "," + ((height / 2) + 5) + ")");

    _pieTextLabel = g.selectAll("allSlices")
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
        .attr("class", "legend");
        
    if (width > 400) {
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