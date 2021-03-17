
// 
// D3 main functions
//


const _colorScale = d3.interpolateRdYlBu;

const _colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
};

function showHideLegend() {
    _isD3Label = !_isD3Label;   // toggle true and false
    var pieData = getPieData('paneGraph', _jsonData, 'Applicant', 'Quantity_m3', false);
    if (pieData == null)
        return;
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

    var xyArray = [];
    if (!isInitial)
        xyArray = _pieData;
    else {
        for (i = 0; i < jsonData.length; i++)
            xyArray.push({ "X": jsonData[i][xCol], "Y": jsonData[i][yCol] });
    }

    return { pieData: xyArray, width: width, height: height, min: min }
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

function percentageChkClick() {

}

function yValueChkClick() {

}

function xValueChkClick() {

}
