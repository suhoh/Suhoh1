﻿
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

//var _pieSum;
//var _isD3PieLegend = true;
//var _radioColorRampPieValue = 1;
var _isD3BarLegend = true;


// Panel1Pie1, Panel2Bar1, ...
function initGraph(divName) {
    if (divName.toUpperCase().indexOf('PIE') > -1)
        initPie(divName);
    else if (divName.toUpperCase().indexOf('BAR') > -1)
        initBar(divName);
    //else if (divName.toUpperCase().indexOf('LINE') > -1)
    //    initPie(divName);
    //else if (divName.toUpperCase().indexOf('SCATTER') > -1)
    //    initPie(divName);
    //else
        return 1;
}

function showHideLegend(s, e) {
    var id = s.id.split('|')[0];
    var pie = null;
    if (id.toUpperCase().indexOf('PIE') > -1) {
        pie = getPie(id);
    }
    if (pie == null)
        return;

    pie.isLegend = !pie.isLegend;
    pie.xCol = cbPieXColumn.GetText();
    pie.yCol = cbPieYColumn.GetText();

    var pieData = getPieData(pie.divName, _jsonData, pie.xCol, pie.yCol, false);
    if (pieData == null)
        return;
    if (pie.isLegend == true)
        for (i = 0; i < pieData.pieData.length; i++) {
            $('#D3Legend' + i).show(500);
        }
    else
        for (i = 0; i < pieData.pieData.length; i++) {
            $('#D3Legend' + i).hide(500);
        }
    drawPie(pie.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
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
    var pie = getPie(_activePie.divName);
    var isPercentageLabel, isYValueLabel, isXValueLabel;

    if (s == undefined) {
        isPercentageLabel = pie.isPercentage;
        isYValueLabel = pie.isYValue;
        isXValueLabel = pie.isXValue;
    }
    else {
        isPercentageLabel = pie.isPercentage = eval("chkPiePercentageLabel").GetChecked();
        isYValueLabel = pie.isYValue = eval("chkPieYValueLabel").GetChecked();
        isXValueLabel = pie.isXValue = eval("chkPieXValueLabel").GetChecked();
    }

    if (isYValueLabel && !isXValueLabel && !isPercentageLabel) {
        pie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) > 5)
                    return (d.data.Y).toFixed(1)
            })
            .attr("display", "block");
    }
    else if (isXValueLabel && !isYValueLabel && !isPercentageLabel) {
        pie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) > 5)
                    return d.data.X
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && !isXValueLabel && !isYValueLabel) {
        pie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) > 5)
                    return (Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) + "%"
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isYValueLabel && !isXValueLabel) {
        pie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) > 5)
                    return (d.data.Y).toFixed(1) + ", " + "(" + (Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isXValueLabel && !isYValueLabel) {
        pie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + "(" + (Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else if (isYValueLabel && isXValueLabel && !isPercentageLabel) {
        pie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + (d.data.Y).toFixed(1)
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isYValueLabel && isXValueLabel) {
        pie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + (d.data.Y).toFixed(1) + ", " + "(" + (Math.round((d.data.Y / pie.sum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else {
        pie.textLabel.attr("display", "none");
    }

}

function showPropertyPopup(s) {
    // callback begin/end functions are in MainScript.js
    _activePropertyName = s.id; // Panel2Bar1|Property
    callbackPopupGraphProperty.PerformCallback({
        'sender': s.id      
    });
}

function tbPiePropertyTitleKeyUp(s, e) {
    var caller;
    if (s.name == undefined)    // called manually
        caller = s + "|Title";
    else
        caller = _activePie.divName + "|Title";

    if (typeof propertyPieTitle !== "undefined" && ASPxClientUtils.IsExists(propertyPieTitle))
        document.getElementById(caller).innerHTML = propertyPieTitle.GetText();
}

function cbXYColumnDropDownChanged(s, e) {
    var pie = getPie(_activePie.divName);
    pie.xCol = cbPieXColumn.GetText();
    pie.yCol = cbPieYColumn.GetText();

    var pieData = getPieData(pie.divName, _jsonData, pie.xCol, pie.yCol, true);
    drawPie(pie.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);

    propertyPieTitle.SetText(pie.xCol + " vs " + pie.yCol);
    document.getElementById(pie.divName + "|Title").innerHTML = pie.xCol + " vs " + pie.yCol;
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
    var pie = getPie(_activePie.divName);
    pie.colorRamp = eval("radioColorRampPie").GetValue();

    var canvas;
    if (pie.colorRamp == 1) {
        canvas = ramp(_colorScaleHSL);
    }
    else if (pie.colorRamp == 2) {
        canvas = ramp(_colorScaleRainbow);
    }
    else if (pie.colorRamp == 3) {
        canvas = ramp(_colorScaleViridis);
    }
    else if (pie.colorRamp == 4) {
        canvas = ramp(_colorScaleCool);
    }
    else if (pie.colorRamp == 5) {
        canvas = ramp(_colorScaleHcl);
    }
    else {
        canvas = ramp(_colorScaleGrey);
    }
    var div = document.getElementById('divColorRampPie');
    div.appendChild(canvas);

    var pieData = getPieData(pie.divName, pie.data, pie.xCol, pie.yCol, false);
    drawPie(pie.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
    chkPieLabelClicked();
}

// bar chart
function chkBarLabelClicked(s, e) {

}

function cbBarXYColumnChanged(s, e) {
    var bar = getBar(_activeBar.divName);
    bar.xCol = cbBarXColumn.GetText();
    bar.yCol = lbBarYColumn.GetText();

    var barData = getBarData(bar.divName, bar.data, bar.xCol, bar.yCol, false);
    drawBar(bar.divName, barData.barData, barData.width, barData.height);

    propertyBarTitle.SetText(bar.xCol + " vs " + bar.yCol);
    document.getElementById(bar.divName + "|Title").innerHTML = bar.xCol + " vs " + bar.yCol;
}

function chkBarTransposeClicked(s, e) {

}

function tbBarPropertyTitleKeyUp(s, e) {
    var caller;
    if (s.name != undefined)    // called manually
        caller = s + "|Title";
    else
        caller = s;

    if (typeof propertyBarTitle !== "undefined" && ASPxClientUtils.IsExists(propertyBarTitle))
        document.getElementById(caller).innerHTML = propertyBarTitle.GetText();
}
