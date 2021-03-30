
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
var _isD3Legend = true;

function showHideLegend() {
    _isD3Legend = !_isD3Legend;   // toggle true and false

    var xColumn = cbXColumnDropDown.GetText();
    var yColumn = cbYColumnDropDown.GetText();

    var pieData = getPieData('paneGraph', _jsonData, xColumn, yColumn, false);
    if (pieData == null)
        return;
    if (_isD3Legend == true)
        for (i = 0; i < pieData.pieData.length; i++) {
            $('#D3Legend' + i).show(500);
        }
    else
        for (i = 0; i < pieData.pieData.length; i++) {
            $('#D3Legend' + i).hide(500);
        }
    drawPie('pieChart', pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
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

    console.log(groupBy(jsonData, xCol, yCol));

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

    propertyTitle.SetText(xColumn + " vs " + yColumn);
    document.getElementById("chartTitle").innerHTML = xColumn + " vs " + yColumn;
}
