//
// D3 chart functions
//
function drawPie(divName, data, width, height, radius) {
    if (data == undefined)
        return;

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
        .append("g")
        .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

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

    svg.selectAll("allSlices")
        .data(pieData)
        .enter()
        .append("path")
        .attr('d', arc)
        .attr("fill", function (d) { return (color(d.data.X)) })
        .attr("stroke", "black")
        .style("stroke-width", "2px")
        .style("opacity", 0.7)
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

    if (_isD3Label == true) {
        svg.selectAll("allSlices")
            .data(pieData)
            .enter()
            .append('text')
            .text(function (d) { return d.data.X })
            .attr("transform", function (d) { return "translate(" + arc.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .style("font-size", 14)
    }
}