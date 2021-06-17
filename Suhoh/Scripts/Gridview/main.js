//
// Gridview main functions
//

const _pageSize = 50;
var _gridviews = [];
var _activeGridview;
var _headerFilterPanel, _groupingPanel;

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
    var headerFilter = s.name + "_HeaderFilter";
    eval(headerFilter).SetChecked(gv.isHeaderFilter);
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

    eval(pId).PerformCallback();   // Refresh gridview
}


