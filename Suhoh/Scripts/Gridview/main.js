//
// Gridview main functions
//

const _pageSize = 50;
var _gridviews = [];
var _activeGridview;
var _headerFilterPanel, _groupingPanel;
var _gridviewKeys = '';     // stored filtered keys (Seq)
var _filteredData = null;  // stores filtered data from Gridview

function initGridview(name) {
    _gridviews.push({ 'name': name, 'isHeaderFilter': false, 'isGrouping': false, 'pageSize': _pageSize });  // DevExpress control name
}

function getGridview(divName) {
    for (i = 0; i < _gridviews.length; i++) {
        if (_gridviews[i].name == divName)
            return _gridviews[i]
    }
    return null;
}

function dxGridview_OnBeginCallback(s, e) {
    var gv = getGridview(s.name);
    e.customArgs["dxGridview_sender"] = s.name;
    e.customArgs["dxGridview_HeaderFilter"] = gv.isHeaderFilter;
    e.customArgs["dxGridview_Grouping"] = gv.isGrouping;
}
function dxGridview_OnEndCallback(s, e) {
    var gv = getGridview(s.name);
    // Adjust checkboxes
    var headerFilter = s.name + "_HeaderFilter";
    eval(headerFilter).SetChecked(gv.isHeaderFilter);
    var grouping = s.name + "_Grouping";
    eval(grouping).SetChecked(gv.isGrouping);

    // Re-draw charts and maps
    var url = "Home/GetGridviewKeys"
    $.ajax({
        type: "POST",
        url: url,
        data: { },
        dataType: "json",
        success: successFunc,
        error: errorFunc
    });

    function successFunc(data, status) {    // data: 11|33|234
        if (data.length == 0)
            return;
        var orClause = getOrClause('x.Seq', data);
        _filteredData = _jsonData.filter(function (x) {
            return eval(orClause);
        });

        // Update dataset and Redraw pies
        _pies.forEach(function (p) {
            p.data = _filteredData;
        });
        updatePies(_pies, true);    // true: isInitial

        // Update dataset and Redraw bars
        _bars.forEach(function (b) {
            b.data = _filteredData;
        });
        updateBars(_bars, true);    // true: isInitial

        // Update dataset and Redraw maps
        _maps.forEach(function (m) {
            m.isLabelOn = false;    // set it to false when loading new data
            addPointLayer(_filteredData, m, null, null, null, true); // true: zoom to layer
        })
    }

    function errorFunc(data, status) {
        console.log('Home/GetGridviewKeys: ' + status);
    }
}

function getOrClause(operand, keys) {
    var k = keys.split('|');
    var orClause = "";
    k.forEach(function (c) {
        orClause += operand + "==" + c + "||";
    });
    orClause = orClause.substr(0, orClause.length - 2); // remove ||
    return orClause;
}

function dxGridview_Init(s, e) {
    if (_initialLoad) {
        initGridview(s.name);
        var pane = splitterMain.GetPaneByName(s.name);
        var gv = eval(s.name);
        gv.SetHeight(pane.GetClientHeight() - 10); // resize height
        _initialLoad = false;
    }
}

function btnGridviewMaximizeClick(s) {
    var pId = s.id.split('_')[0];
    var map = getMap(pId);
    var p = splitterMain.GetPaneByName(pId);
    p.Expand();
    map.isMaximized = !map.isMaximized;
}

function btnGridviewLegendClick(s) {

}

function btnGridviewCloseClick(s) {

}

function chkHeaderFilterGroupingChecked(s, e) {
    var pId = s.name.split('_')[0];
    var gv = getGridview(pId);
    gv.isHeaderFilter = eval(pId + "_HeaderFilter").GetChecked();
    gv.isGrouping = eval(pId + "_Grouping").GetChecked();

    eval(pId).PerformCallback({ 'isLoad': false });   // Refresh gridview
}


