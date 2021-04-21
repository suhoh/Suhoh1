
// 
// D3 main functions
//

const _colorScaleHSL = t => `hsl(${t * 360},100%,50%)`;
const _colorScaleRainbow = d3.interpolateRainbow;
const _colorScaleViridis = d3.interpolateViridis;
const _colorScaleCool = d3.interpolateCool;
const _colorScaleHcl = d3.interpolateHclLong("red", "blue")
const _colorScaleGrey = d3.interpolateGreys;

const _colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
};

var _pieSum;
var _isD3PieLegend = true;
var _isD3BarLegend = true;
var _radioColorRampPieValue = 1;

function showHideLegend() {
    _isD3PieLegend = !_isD3PieLegend;   // toggle true and false

    var xColumn = cbXColumnDropDown.GetText();
    var yColumn = cbYColumnDropDown.GetText();

    var pieData = getPieData('paneGraph', _jsonData, xColumn, yColumn, false);
    if (pieData == null)
        return;
    if (_isD3PieLegend == true)
        for (i = 0; i < pieData.pieData.length; i++) {
            $('#D3Legend' + i).show(500);
        }
    else
        for (i = 0; i < pieData.pieData.length; i++) {
            $('#D3Legend' + i).hide(500);
        }
    drawPie('pieChart', pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
    //drawBar('pieChart', pieData.pieData, pieData.width, pieData.height);
}

function showPropertyPopup() {
    popupPaneProperty.Show();
}

function getPieData(paneId, jsonData, xCol, yCol, isInitial) {
    if (jsonData == null)
        return null;

    var pGraph = splitterMain.GetPaneByName(paneId);
    var width = pGraph.GetClientWidth();
    var height = pGraph.GetClientHeight();
    var min = Math.min(width, height);

    var xyArray = [];
    if (!isInitial)
        xyArray = _pieData;
    else {
        var xy = groupBy(jsonData, xCol, yCol);
        for (i = 0; i < xy.length; i++) {
            xyArray.push({ "X": xy[i][xCol], "Y": xy[i][yCol] });
        }
        //for (i = 0; i < jsonData.length; i++)
        //    xyArray.push({ "X": jsonData[i][xCol], "Y": jsonData[i][yCol] });
    }

    return { pieData: xyArray, width: width, height: height, min: min }
}


function groupBy(array, groups, valueKey) {
    var map = new Map;
    groups = [].concat(groups);
    return array.reduce((r, o) => {
        groups.reduce((m, k, i, { length }) => {
            var child;
            if (m.has(o[k])) return m.get(o[k]);
            if (i + 1 === length) {
                child = Object
                    .assign(...groups.map(k => ({ [k]: o[k] })), { [valueKey]: 0 });
                r.push(child);
            } else {
                child = new Map;
            }
            m.set(o[k], child);
            return child;
        }, map)[valueKey] += +o[valueKey];
        return r;
    }, [])
};

function calculatePoint(i, intervalSize, colorRangeInfo) {
    var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
    return (useEndAsStart
        ? (colorEnd - (i * intervalSize))
        : (colorStart + (i * intervalSize)));
}

function interpolateColors(dataLength, colorScale, colorRangeInfo) {
    var { colorStart, colorEnd } = colorRangeInfo;
    var colorRange = colorEnd - colorStart;
    var intervalSize = colorRange / dataLength;
    var i, colorPoint;
    var colorArray = [];

    for (i = 0; i < dataLength; i++) {
        colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
        colorArray.push(colorScale(colorPoint));
    }

    return colorArray;
}

function chkPieLabelClicked(s, e) {
    var isPercentageLabel = eval("percentageLabel").GetChecked();
    var isYValueLabel = eval("yValueLabel").GetChecked();
    var isXValueLabel = eval("xValueLabel").GetChecked();

    if (isYValueLabel && !isXValueLabel && !isPercentageLabel) {
        _pieTextLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) > 5)
                    return (d.data.Y).toFixed(1)
            })
            .attr("display", "block");
    }
    else if (isXValueLabel && !isYValueLabel && !isPercentageLabel) {
        _pieTextLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) > 5)
                    return d.data.X
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && !isXValueLabel && !isYValueLabel) {
        _pieTextLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) > 5)
                    return (Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) + "%"
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isYValueLabel && !isXValueLabel) {
        _pieTextLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) > 5)
                    return (d.data.Y).toFixed(1) + ", " + "(" + (Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isXValueLabel && !isYValueLabel) {
        _pieTextLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + "(" + (Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else if (isYValueLabel && isXValueLabel && !isPercentageLabel) {
        _pieTextLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + (d.data.Y).toFixed(1)
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isYValueLabel && isXValueLabel) {
        _pieTextLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + (d.data.Y).toFixed(1) + ", " + "(" + (Math.round((d.data.Y / _pieSum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else {
        _pieTextLabel.attr("display", "none");
    }

}

function tbPropertyTitleKeyUp(s, e) {
    document.getElementById("chartTitle").innerHTML = propertyTitle.GetText();
}

function cbXYColumnDropDownChanged(s, e) {
    var xColumn = cbXColumnDropDown.GetText();
    var yColumn = cbYColumnDropDown.GetText();

    var pieData = getPieData('paneGraph', _jsonData, xColumn, yColumn, true);
    drawPie('pieChart', pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
    //drawBar('pieChart', pieData.pieData, pieData.width, pieData.height)

    propertyTitle.SetText(xColumn + " vs " + yColumn);
    document.getElementById("chartTitle").innerHTML = xColumn + " vs " + yColumn;
}

// Color Ramp
function ramp(color, n = 512) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext("2d");
    canvas.style.margin = "10 -14px";
    canvas.style.width = "240px";
    canvas.style.height = "20px";
    canvas.id = "colorRampCanvas";
    canvas.style.position = "absolute";
    canvas.style.border = "1px solid";
    canvas.style.zIndex = 100;
    canvas.style.imageRendering = "-moz-crisp-edges";
    canvas.style.imageRendering = "pixelated";
    for (let i = 0; i < n; ++i) {
        context.fillStyle = color(i / (n - 1));
        context.fillRect(i, 0, 500, 500);
    }
    return canvas;
}

function radioColorRampPieClicked(s, e) {
    _radioColorRampPieValue = eval("radioColorRampPie").GetValue();
    var canvas;
    if (_radioColorRampPieValue == 1) {
        canvas = ramp(_colorScaleHSL);
    }
    else if (_radioColorRampPieValue == 2) {
        canvas = ramp(_colorScaleRainbow);
    }
    else if (_radioColorRampPieValue == 3) {
        canvas = ramp(_colorScaleViridis);
    }
    else if (_radioColorRampPieValue == 4) {
        canvas = ramp(_colorScaleCool);
    }
    else if (_radioColorRampPieValue == 5) {
        canvas = ramp(_colorScaleHcl);
    }
    else {
        canvas = ramp(_colorScaleGrey);
    }
    var div = document.getElementById('divColorRampPie');
    div.appendChild(canvas);

    var xColumn = cbXColumnDropDown.GetText();
    var yColumn = cbYColumnDropDown.GetText();
    var pieData = getPieData('paneGraph', _jsonData, xColumn, yColumn, true);
    drawPie('pieChart', pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
}

function tbBarPropertyTitleKeyUp(s, e) {
}