
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

function tbPiePropertyTitleKeyUp(s, e) {
    var caller;
    if (s.name == undefined)    // called manually
        caller = s + "|Title";
    else
        caller = _activePie.divName + "|Title";

    if (typeof tbPropertyPieTitle !== "undefined" && ASPxClientUtils.IsExists(tbPropertyPieTitle))
        document.getElementById(caller).innerHTML = tbPropertyPieTitle.GetText();   // updates title in Panel
}

function cbXYColumnDropDownChanged(s, e) {
    var pie = getPie(_activePie.divName);
    pie.xCol = cbPieXColumn.GetText();
    pie.yCol = cbPieYColumn.GetText();

    var pieData = getPieData(pie.divName, _jsonData, pie.xCol, pie.yCol, true);
    drawPie(pie.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);

    tbPropertyPieTitle.SetText(pie.xCol + " vs " + pie.yCol);
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

var textSeparator = ";";
function getSelectedItemsText(items) {
    var texts = [];
    for (var i = 0; i < items.length; i++)
        texts.push(items[i].text);
    return texts.join(textSeparator);
}

function cbBarXYColumnChanged(s, e) {
    if (_activeBar == undefined)
        return;
    var bar = getBar(_activeBar.divName);
    bar.yCol = cbBarYColumn.GetText();

    var selectedItems = lbBarXColumn.GetSelectedItems();
    ddBarXColumn.SetText(getSelectedItemsText(selectedItems));  // Consumptive Use_M3;Latitude

    bar.xCol = getSelectedItemsText(selectedItems);
    //var yCols = getSelectedItemsText(selectedItems).split(';');

    //var items = lbBarYColumn.GetSelectedItems();
    //var text = "";
    //for (var i = 0; i < items.length; i++) {
    //    text += items[i].text + ";";
    //}
    //text = text.substr(0, text.length - 1);
    //DropDownEdit.SetText(text);

    var barData = getBarData(bar.divName, _jsonData, bar.xCol, bar.yCol, true);
    drawBar(bar.divName, barData.barData, barData.width, barData.height);

    //tbPropertyBarTitle.SetText(bar.xCol + " vs " + bar.yCol);
    //document.getElementById(bar.divName + "|Title").innerHTML = bar.xCol + " vs " + bar.yCol;
}

function chkBarTransposeClicked(s, e) {

}

function tbBarPropertyTitleKeyUp(s, e) {
    var caller;
    if (s.name == undefined)    // called manually
        caller = s + "|Title";
    else
        caller = _activeBar.divName + "|Title";

    if (typeof tbPropertyBarTitle !== "undefined" && ASPxClientUtils.IsExists(tbPropertyBarTitle))
        document.getElementById(caller).innerHTML = tbPropertyBarTitle.GetText();
}

function showHideLegend(s) {
    var id = s.id.split('_')[0];

    if (id.toUpperCase().indexOf('PIE') > -1) {
        var pie = getPie(id);
        if (pie == null)
            return;

        pie.isLegend = !pie.isLegend;

        var pieData = getPieData(pie.divName, _jsonData, pie.xCol, pie.yCol, false);
        if (pieData == null)
            return;
        if (pie.isLegend == true)
            for (i = 0; i < pieData.pieData.length; i++) {
                $('#' + pie.divName + 'pieLegend' + i).show(500);
            }
        else
            for (i = 0; i < pieData.pieData.length; i++) {
                $('#' + pie.divName + 'pieLegend' + i).hide(500);
            }
        drawPie(pie.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
    }

    if (id.toUpperCase().indexOf('BAR') > -1) {
        var bar = getBar(id);
        if (bar == null)
            return;

        bar.isLegend = !bar.isLegend;

        var barData = getBarData(bar.divName, _jsonData, bar.xCol, bar.yCol, false);
        if (barData == null)
            return;
        if (bar.isLegend == true)
            for (i = 0; i < barData.barData.length; i++) {
                $('#' + bar.divName + 'barLegend' + i).show(500);
            }
        else
            for (i = 0; i < barData.barData.length; i++) {
                $('#' + bar.divName + 'barLegend' + i).hide(500);
            }
        drawBar(bar.divName, barData.barData, barData.width, barData.height);
    }
}

function btnBarMaximizeClick(s) {
    //var pId = s.id.split('_')[0];
    //var bar = getBar(pId);

    //var p1 = splitterMain.GetPaneByName('Panel1Map1');
    //var p11 = p1.GetParentPane();

    //var p2 = splitterMain.GetPaneByName('Panel2Bar1');
    //var p3 = splitterMain.GetPaneByName('Panel3Gridview1');
    //p2.Collapse(p1);
    //p3.Collapse(p1);
}

function btnBarCloseClick(s) {

}