//
// D3 bar chart functions
//

var _barData;
var _barSvg = null;

function drawBar(divName, data, width, height) {

    var svgHeight = height - 30; // svg height will be 30px smaller than panel height to leave room for title
    var marginTop = 30;
    var marginRight = 30;
    var marginLeft = 50;
    var marginBottom = 30;

    tbPropertyTitleKeyUp();

    if (data == undefined)
        return;

    _barData = data;
    d3.select("#" + divName).selectAll("svg").remove();

    var svg = d3.select("#" + divName)
        .append("svg")
        .attr("width", width)
        .attr("height", svgHeight)
        .attr("class", "barChart")
        .attr("transform", "translate(0," + marginTop + ")")
        .append("g");

    var x;
    // x and y band
    if (width > 400 && _isD3PieLegend == true)
        x = d3.scaleBand().rangeRound([0, width - marginLeft - marginRight - 50 - 115]).padding(0.1);
    else
        x = d3.scaleBand().rangeRound([0, width - marginLeft - marginRight - 50]).padding(0.1);
    var y = d3.scaleLinear().rangeRound([svgHeight - marginTop - marginBottom - 30, 0]);

    x.domain(data.map(function (d) { return d.X; }));
    y.domain([0, d3.max(data, function (d) { return d.Y; })]);

    // x-axis
    var xAxis = d3.axisBottom(x);
    svg.append("g")
        .attr("transform", "translate(" + (marginLeft + marginRight) + ", " + (svgHeight - marginTop - marginBottom) + ")")
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(30)")
        .style("text-anchor", "start");

    // y-axis
    var yAxis = d3.axisLeft(y);
    svg.append("g")
        .attr("transform", "translate(" + (marginLeft + marginRight) + ", " + marginTop + ")")
        .call(yAxis);

    var barTooltip = d3.select("#" + divName).append("div").attr("class", "barTooltip").style("display", "none");

    // bar
    svg.selectAll("bar")
        .data(data)
        .enter()
        .append("rect")
        .style("fill", "#FF00FF")
        .attr("x", function (d) { return x(d.X); })
        .attr("y", function (d) { return y(d.Y); })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return svgHeight - y(d.Y) - marginTop - marginBottom - 30; })
        .attr("transform", "translate(" + (marginLeft + marginRight) + ", 30)")
        .on("mouseenter", function (event, d) {
            barTooltip
                .transition()
                .duration(200)
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

    var yColumn = cbYColumnDropDown.GetText();
    
    var legend = svg.selectAll(".legend")
        .data(data)
        .enter().append("g")
        .attr("class", "D3Legend")
        .attr("id", function (d, idx) { return "D3Legend" + idx });

    if (width > 400 && _isD3PieLegend == true) {
        legend.append("rect")
            .attr("width", 7)
            .attr("height", 7)
            .attr("transform", function (d, idx) { return "translate(" + (width - 115) + "," + (10 + (idx * 15)) + ")"; })
            .attr("fill", "#FF00FF");

        legend.append("text")
            .attr("transform", function (d, idx) { return "translate(" + (width - 100) + "," + (13 + (idx * 15)) + ")"; })
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .style("font-size", "8px")
            .text(yColumn);
    }

    return svg;
}