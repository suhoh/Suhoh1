
// 
// D3 main functions
//

const _colorScale = d3.interpolateRdBu;
const _colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
};

var _pieSum;
//var _isD3Legend = true;

// Panel1Pie1, Panel2Bar1, ...
function initGraph(divName) {
    if (divName.toUpperCase().indexOf('PIE') > -1)
        initPie(divName);
    //else if (divName.toUpperCase().indexOf('BAR') > -1)
    //    initPie(divName);
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
    pie.xCol = cbXColumnDropDown.GetText();
    pie.yCol = cbYColumnDropDown.GetText();

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

function getPieData(paneId, jsonData, xCol, yCol, isInitial) {
    if (jsonData == null)
        return null;

    var pGraph = splitterMain.GetPaneByName(paneId);
    var width = pGraph.GetClientWidth();
    var height = pGraph.GetClientHeight();
    var min = Math.min(width, height);

    var xyArray = [];
    if (!isInitial) {
        xyArray = getPie(paneId).data;
    }
    else {
        var xy = groupBy(jsonData, xCol, yCol);
        for (i = 0; i < xy.length; i++) {
            xyArray.push({ "X": xy[i][xCol], "Y": xy[i][yCol] });
        }
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
    var isPercentageLabel = _activePie.isPercentage = eval("percentageLabel").GetChecked();
    var isYValueLabel = _activePie.isYValue =  eval("yValueLabel").GetChecked();
    var isXValueLabel = _activePie.isXValue = eval("xValueLabel").GetChecked();

    if (isYValueLabel && !isXValueLabel && !isPercentageLabel) {
        _activePie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) > 5)
                    return (d.data.Y).toFixed(1)
            })
            .attr("display", "block");
    }
    else if (isXValueLabel && !isYValueLabel && !isPercentageLabel) {
        _activePie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) > 5)
                    return d.data.X
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && !isXValueLabel && !isYValueLabel) {
        _activePie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) > 5)
                    return (Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) + "%"
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isYValueLabel && !isXValueLabel) {
        _activePie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) > 5)
                    return (d.data.Y).toFixed(1) + ", " + "(" + (Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isXValueLabel && !isYValueLabel) {
        _activePie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + "(" + (Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else if (isYValueLabel && isXValueLabel && !isPercentageLabel) {
        _activePie.textLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + (d.data.Y).toFixed(1)
            })
            .attr("display", "block");
    }
    else if (isPercentageLabel && isYValueLabel && isXValueLabel) {
        _pieTex_activePie.textLabeltLabel
            .text(function (d) {
                if ((Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) > 5)
                    return d.data.X + ", " + (d.data.Y).toFixed(1) + ", " + "(" + (Math.round((d.data.Y / _activePie.sum) * 100)).toFixed(1) + "%" + ")"
            })
            .attr("display", "block");
    }
    else {
        _activePie.textLabel.attr("display", "none");
    }

}

function showPropertyPopup(s) {
    var id = s.id.split('|')[0];
    var pie = null;
    if (id.toUpperCase().indexOf('PIE') > -1) {
        pie = getPie(id);
    }
    if (pie == null)
        return;

    propertyTitle.SetText(pie.xCol + " vs " + pie.yCol);
    percentageLabel.SetChecked(pie.isPercentage);
    yValueLabel.SetChecked(pie.isYValue);
    xValueLabel.SetChecked(pie.isXValue);
    cbXColumnDropDown.SetValue(pie.xCol);
    cbYColumnDropDown.SetValue(pie.yCol);

    _activePie = pie;   // set active pie

    popupPaneProperty.Show();
}

function tbPropertyTitleKeyUp(s, e) {
    var caller;
    if (s.name == undefined)    // called manually
        caller = s + "|Title";
    else
        caller = s.name;
    document.getElementById(caller).innerHTML = propertyTitle.GetText();
}

function cbXYColumnDropDownChanged(s, e) {
    _activePie.xCol = cbXColumnDropDown.GetText();
    _activePie.yCol = cbYColumnDropDown.GetText();

    var pieData = getPieData(_activePie.divName, _jsonData, _activePie.xCol, _activePie.yCol, true);
    drawPie(_activePie.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);

    propertyTitle.SetText(_activePie.xCol + " vs " + _activePie.yCol);
    document.getElementById(_activePie.divName + "|Title").innerHTML = _activePie.xCol + " vs " + _activePie.yCol;
}
