
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
    else if (divName.toUpperCase().indexOf('LINE') > -1)
        initLine(divName);
    else if (divName.toUpperCase().indexOf('SCATTER') > -1)
        initScatter(divName);
    else
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

function sumStr(str) {
    let strArr = str.toString().split(",");
    let sum = strArr.reduce(function (total, num) {
        return parseFloat(total) + parseFloat(num);
    });

    return sum;
}

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

function chkPieLabelClicked(s, e, id) {
    var pie;
    if (id != null)
        pie = getPie(id);
    else
        pie = getPie(_activePie.divName);
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

    if (pie.textLabel == null)
        return;

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
        caller = s + "_Title";
    else
        caller = _activePie.divName + "_Title";

    if (typeof tbPropertyPieTitle !== "undefined" && ASPxClientUtils.IsExists(tbPropertyPieTitle))
        document.getElementById(caller).innerHTML = tbPropertyPieTitle.GetText();   // updates title in Panel
}

function cbPieXYColumnChanged(s, e) {
    var pie = getPie(_activePie.divName);
    pie.xCol = cbPieXColumn.GetText();
    pie.yCol = cbPieYColumn.GetText();

    var jsonData = _jsonData;
    if (_filteredData != null)
        jsonData = _filteredData;

    var pieData = getPieData(pie.divName, jsonData, pie.xCol, pie.yCol, true);
    drawPie(pie.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);

    tbPropertyPieTitle.SetText(pie.xCol + " vs " + pie.yCol);
    document.getElementById(pie.divName + "_Title").innerHTML = pie.xCol + " vs " + pie.yCol;

    chkPieLabelClicked(null, null, pie.divName);
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
    chkPieLabelClicked(null, null, pie.divName);
}

// bar chart
function chkBarLabelClicked(s, e, id) {
    var bar;
    if (id != null)
        bar = getBar(id);
    else
        bar = getBar(_activeBar.divName);
    var isXValueLabel, isYValueLabel;

    if (s == undefined) {
        isXValueLabel = bar.isXValue;
        isYValueLabel = bar.isYValue;
    }
    else {
        isXValueLabel = bar.isXValue = eval("chkBarXValueLabel").GetChecked();
        isYValueLabel = bar.isYValue = eval("chkBarYValueLabel").GetChecked();
    }
    if (bar.textLabel == null)
        return;

    if (isXValueLabel && !isYValueLabel) {
        bar.textLabel
            .text(function (d) {
                return (d.key);
            })
            .attr("display", "block");
        //var text_element = bar.svg.select(".barTextLabel");
        //var textBox = text_element.getBBox();
        //var textWidth = textBox.width;
    }
    else if (!isXValueLabel && isYValueLabel) {
        bar.textLabel
            .text(function (d) {
                return (d[1].toFixed(1));
            })
            .attr("display", "block");
        
    }
    else if (isXValueLabel && isYValueLabel) {
        bar.textLabel
            .text(function (d) {
                return (d.key + ", " + d[1].toFixed(1));
            })
            .attr("display", "block");
    }
    else
        bar.textLabel.attr("display", "none");
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
    bar.xCol = cbBarXColumn.GetText();

    var selectedItems = lbBarYColumn.GetSelectedItems();
    ddBarYColumn.SetText(getSelectedItemsText(selectedItems));  // Consumptive Use_M3;Latitude

    if(selectedItems.length == 0)
        $('#divBarColorPicker').remove();

    bar.yCol = getSelectedItemsText(selectedItems);
    //bar.color = ceBarColorPicker.GetText();
    //bar.color = ['#e41a1c', '#377eb8', '#4daf4a', '#800080', '#333399', '#999999', '#FF00FF'];
    bar.color = _barColors;

    var jsonData = _jsonData;
    if (_filteredData != null)
        jsonData = _filteredData;

    var barData = getBarData(bar.divName, jsonData, bar.xCol, bar.yCol, bar.color, true);
    drawBar(bar.divName, barData.barData, barData.colData, barData.width, barData.height, barData.color);

    tbPropertyBarTitle.SetText(bar.xCol + " vs " + bar.yCol);
    document.getElementById(bar.divName + "_Title").innerHTML = bar.xCol + " vs " + bar.yCol;

    //var yCols = getSelectedItemsText(selectedItems).split(';');

    //var items = lbBarYColumn.GetSelectedItems();
    //var text = "";
    //for (var i = 0; i < items.length; i++) {
    //    text += items[i].text + ";";
    //}
    //text = text.substr(0, text.length - 1);
    //DropDownEdit.SetText(text);
    chkBarLabelClicked(null, null, bar.divName);

    if (s.name == 'lbBarYColumn')
        callbackBarColorPickers.PerformCallback({ 'barYcol': bar.yCol, 'barColors': bar.color });

}

function tbBarPropertyTitleKeyUp(s, e) {
    var caller;
    if (s.name == undefined)    // called manually
        caller = s + "_Title";
    else
        caller = _activeBar.divName + "_Title";

    if (typeof tbPropertyBarTitle !== "undefined" && ASPxClientUtils.IsExists(tbPropertyBarTitle))
        document.getElementById(caller).innerHTML = tbPropertyBarTitle.GetText();
}

function showHideLegend(s) {
    var id = s.id.split('_')[0];

    if (id.toUpperCase().indexOf('PIE') > -1) {
        var pie = getPie(id);
        if (pie == null)
            return;

        _activePie = pie;
        pie.isLegend = !pie.isLegend;

        //chkPiePercentageLabel.SetChecked(pie.isPercentage);
        //chkPieYValueLabel.SetChecked(pie.isYValue);
        //chkPieXValueLabel.SetChecked(pie.isXValue);

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
        chkPieLabelClicked(null, null, id);
    }

    if (id.toUpperCase().indexOf('BAR') > -1) {
        var bar = getBar(id);
        if (bar == null)
            return;

        _activeBar = bar;
        bar.isLegend = !bar.isLegend;

        //chkBarXValueLabel.SetChecked(bar.isXValue);
        //chkBarYValueLabel.SetChecked(bar.isYValue);
        //if (typeof ceBarColorPicker !== "undefined" && ASPxClientUtils.IsExists(ceBarColorPicker))
        //    bar.color = ceBarColorPicker.GetText();

        var barData = getBarData(bar.divName, _jsonData, bar.xCol, bar.yCol, bar.color, false);
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
        drawBar(bar.divName, barData.barData, barData.colData, barData.width, barData.height, barData.color);
        chkBarLabelClicked(null, null, id);
    }

    if (id.toUpperCase().indexOf('LINE') > -1) {
        var line = getLine(id);
        if (line == null)
            return;

        _activeLine = line;
        line.isLegend = !line.isLegend;

        var lineData = getLineData(line.divName, _jsonData, line.xCol, line.yCol, line.color, false);
        if (lineData == null)
            return;
        if (line.isLegend == true)
            for (i = 0; i < lineData.lineData.length; i++) {
                $('#' + line.divName + 'lineLegend' + i).show(500);
            }
        else
            for (i = 0; i < lineData.lineData.length; i++) {
                $('#' + line.divName + 'lineLegend' + i).hide(500);
            }
        drawLine(line.divName, lineData.lineData, lineData.colData, lineData.width, lineData.height, lineData.color);
        chkLineLabelClicked(null, null, id);
    }

    if (id.toUpperCase().indexOf('SCATTER') > -1) {
        var scatter = getScatter(id);
        if (scatter == null)
            return;

        _activeScatter = scatter;
        scatter.isLegend = !scatter.isLegend;

        var scatterData = getScatterData(scatter.divName, _jsonData, scatter.xCol, scatter.yCol, scatter.zCol, scatter.color, false);
        if (scatterData == null)
            return;
        if (scatter.isLegend == true)
            for (i = 0; i < scatterData.scatterData.length; i++) {
                $('#' + scatter.divName + 'scatterLegend' + i).show(500);
            }
        else
            for (i = 0; i < scatterData.scatterData.length; i++) {
                $('#' + scatter.divName + 'scatterLegend' + i).hide(500);
            }
        createScatter(scatter.divName, scatterData.scatterData, scatterData.width, scatterData.height, scatterData.color);
        chkScatterLabelClicked(null, null, id);
    }
}

function radioOrientationBarClicked(s, e) {
    var bar = getBar(_activeBar.divName);
    bar.isVertical = radioOrientationBar.GetValue();

    var barData = getBarData(bar.divName, _jsonData, bar.xCol, bar.yCol, bar.color, true);
    drawBar(bar.divName, barData.barData, barData.colData, barData.width, barData.height, barData.color);
    chkBarLabelClicked(null, null, bar.divName);
}

function ceBarColorPickerClicked(s, e) {
    if (_activeBar == undefined)
        return;

    var cIdx = s.name.substr(s.name.length - 1, 1);
    _barColors[cIdx] = s.GetText();
    //console.log(cIdx);

    var bar = getBar(_activeBar.divName);
    //bar.color = ceBarColorPicker.GetText();
    //bar.color = ['#e41a1c', '#377eb8', '#4daf4a', '#800080', '#333399', '#999999', '#FF00FF'];
    bar.color = _barColors;
    
    var barData = getBarData(bar.divName, _jsonData, bar.xCol, bar.yCol, bar.color, true);
    drawBar(bar.divName, barData.barData, barData.colData, barData.width, barData.height, barData.color);

    chkBarLabelClicked(null, null, bar.divName);
    callbackBarColorPickers.PerformCallback({ 'ycol': bar.yCol, 'barColors': bar.color });
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

function callbackBarColorPickers_OnBeginCallback(s, e) {

}

function callbackBarColorPickers_OnEndCallback(s, e) {
    //ceBarColorPicker.SetColor("#0000FF");
}

// Line Chart
function tbLinePropertyTitleKeyUp(s, e) {
    var caller;
    if (s.name == undefined)    // called manually
        caller = s + "_Title";
    else
        caller = _activeLine.divName + "_Title";

    if (typeof tbPropertyLineTitle !== "undefined" && ASPxClientUtils.IsExists(tbPropertyLineTitle))
        document.getElementById(caller).innerHTML = tbPropertyLineTitle.GetText();
}

function cbLineXYColumnChanged(s, e) {
    if (_activeLine == undefined)
        return;
    var line = getLine(_activeLine.divName);
    line.xCol = cbLineXColumn.GetText();

    var selectedItems = lbLineYColumn.GetSelectedItems();
    ddLineYColumn.SetText(getSelectedItemsText(selectedItems));  // Consumptive Use_M3;Latitude

    if (selectedItems.length == 0)
        $('#divLineColorPicker').remove();

    line.yCol = getSelectedItemsText(selectedItems);
    line.color = _lineColors;

    var jsonData = _jsonData;
    if (_filteredData != null)
        jsonData = _filteredData;

    var lineData = getLineData(line.divName, jsonData, line.xCol, line.yCol, line.color, true);
    drawLine(line.divName, lineData.lineData, lineData.colData, lineData.width, lineData.height, lineData.color);

    tbPropertyLineTitle.SetText(line.xCol + " vs " + line.yCol);
    document.getElementById(line.divName + "_Title").innerHTML = line.xCol + " vs " + line.yCol;

    chkLineLabelClicked(null, null, line.divName);

    if (s.name == 'lbLineYColumn')
        callbackLineColorPickers.PerformCallback({ 'lineYcol': line.yCol, 'lineColors': line.color });
}

function chkLineLabelClicked(s, e, id) {
    var line;
    if (id != null)
        line = getLine(id);
    else
        line = getLine(_activeLine.divName);

    var isXValueLabel, isYValueLabel;

    if (s == undefined) {
        isXValueLabel = line.isXValue;
        isYValueLabel = line.isYValue;
    }
    else {
        isXValueLabel = line.isXValue = eval("chkLineXValueLabel").GetChecked();
        isYValueLabel = line.isYValue = eval("chkLineYValueLabel").GetChecked();
    }

    if (line.textLabel == null)
        return;

    if (isXValueLabel && !isYValueLabel) {
        line.textLabel
            .text(function (d) {
                return d.x;
            })
            .attr("display", "block");
    }
    else if (!isXValueLabel && isYValueLabel) {
        line.textLabel
            .text(function (d) {
                return parseInt(d.y);
            })
            .attr("display", "block");
    }
    else if (isXValueLabel && isYValueLabel) {
        line.textLabel
            .text(function (d) {
                return (d.x + ", " + parseInt(d.y));
            })
            .attr("display", "block");
    }
    else
        line.textLabel.attr("display", "none");
}

function radioLineShapeClicked(s, e) {

    var line = getLine(_activeLine.divName);
    var lineData = getLineData(line.divName, _jsonData, line.xCol, line.yCol, line.color, true);

    drawLine(line.divName, lineData.lineData, lineData.colData, lineData.width, lineData.height, lineData.color);
    chkLineLabelClicked(null, null, line.divName);
}

function callbackLineColorPickers_OnBeginCallback(s, e) {

}

function callbackLineColorPickers_OnEndCallback(s, e) {
    
}

function ceLineColorPickerClicked(s, e) {
    if (_activeLine == undefined)
        return;

    var cIdx = s.name.substr(s.name.length - 1, 1);
    _lineColors[cIdx] = s.GetText();

    var line = getLine(_activeLine.divName);
    line.color = _lineColors;

    var lineData = getLineData(line.divName, _jsonData, line.xCol, line.yCol, line.color, true);
    drawLine(line.divName, lineData.lineData, lineData.colData, lineData.width, lineData.height, lineData.color);

    chkLineLabelClicked(null, null, line.divName);
    callbackLineColorPickers.PerformCallback({ 'lineYcol': line.yCol, 'lineColors': line.color });
}

// Scatter Chart
function tbScatterPropertyTitleKeyUp(s, e) {
    var caller;
    if (s.name == undefined)    // called manually
        caller = s + "_Title";
    else
        caller = _activeScatter.divName + "_Title";

    if (typeof tbPropertyScatterTitle !== "undefined" && ASPxClientUtils.IsExists(tbPropertyScatterTitle))
        document.getElementById(caller).innerHTML = tbPropertyScatterTitle.GetText();
}

function cbScatterXYColumnChanged(s, e) {
    if (_activeScatter == undefined)
        return;

    var scatter = getScatter(_activeScatter.divName);
    scatter.xCol = cbScatterXColumn.GetText();
    scatter.yCol = cbScatterYColumn.GetText();
    scatter.zCol = cbScatterZColumn.GetText();

    //if (selectedItems.length == 0)
    //    $('#divScatterColorPicker').remove();

    //scatter.yCol = getSelectedItemsText(selectedItems);
    //scatter.color = _lineColors;

    var jsonData = _jsonData;
    if (_filteredData != null)
        jsonData = _filteredData;

    var scatterData = getScatterData(scatter.divName, jsonData, scatter.xCol, scatter.yCol, scatter.zCol, scatter.color, true);
    createScatter(scatter.divName, scatterData.scatterData, scatterData.width, scatterData.height, scatterData.color);

    tbPropertyScatterTitle.SetText(scatter.xCol + " vs " + scatter.yCol);
    document.getElementById(scatter.divName + "_Title").innerHTML = scatter.xCol + " vs " + scatter.yCol;

    chkScatterLabelClicked(null, null, scatter.divName);

    //if (s.name == 'cbScatterYColumn')
    //    callbackLineColorPickers.PerformCallback({ 'lineYcol': line.yCol, 'lineColors': line.color });
}

function chkScatterLabelClicked(s, e, id) {
    var scatter;
    if (id != null)
        scatter = getScatter(id);
    else
        scatter = getScatter(_activeScatter.divName);

    var isXValueLabel, isYValueLabel, isZValueLabel;

    if (s == undefined) {
        isXValueLabel = scatter.isXValue;
        isYValueLabel = scatter.isYValue;
        isZValueLabel = scatter.isZValue;
    }
    else {
        isXValueLabel = scatter.isXValue = eval("chkScatterXValueLabel").GetChecked();
        isYValueLabel = scatter.isYValue = eval("chkScatterYValueLabel").GetChecked();
        isZValueLabel = scatter.isZValue = eval("chkScatterZValueLabel").GetChecked();
    }

    if (scatter.textLabel == null)
        return;

    if (isXValueLabel && !isYValueLabel && !isZValueLabel) {
        scatter.textLabel
            .text(function (d) {
                return d.X;
            })
            .attr("display", "block");
    }
    else if (!isXValueLabel && isYValueLabel && !isZValueLabel) {
        scatter.textLabel
            .text(function (d) {
                return d.Y;
            })
            .attr("display", "block");
    }
    else if (!isXValueLabel && !isYValueLabel && isZValueLabel) {
        scatter.textLabel
            .text(function (d) {
                return d.Z;
            })
            .attr("display", "block");
    }
    else if (isXValueLabel && isYValueLabel && !isZValueLabel) {
        scatter.textLabel
            .text(function (d) {
                return d.X + ", " + d.Y;
            })
            .attr("display", "block");
    }
    else if (isXValueLabel && !isYValueLabel && isZValueLabel) {
        scatter.textLabel
            .text(function (d) {
                return d.X + ", " + d.Z;
            })
            .attr("display", "block");
    }
    else if (!isXValueLabel && isYValueLabel && isZValueLabel) {
        scatter.textLabel
            .text(function (d) {
                return d.Y + ", " + d.Z;
            })
            .attr("display", "block");
    }
    else if (isXValueLabel && isYValueLabel && isZValueLabel) {
        scatter.textLabel
            .text(function (d) {
                return d.X + ", " + d.Y + ", " + d.Z;
            })
            .attr("display", "block");
    }
    else
        scatter.textLabel.attr("display", "none");
}