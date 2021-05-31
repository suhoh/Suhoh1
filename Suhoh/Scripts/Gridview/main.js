//
// Gridview main functions
//

const _pageSize = 50;
var _gridviews = [];
var _activeGridview;

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

// Gridview callback
function dxGridview_OnBeginCallback(s, e) {
    e.customArgs["dxGridview_sender"] = s.name;
}
function dxGridview_OnEndCallback(s, e) {

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

function chkHeaderFilterChecked(s, e) {
    var pId = s.name.split('_')[0];
    var gv = getGridview(pId);
    gv.isHeaderFilter = s.GetChecked();
}

function chkGroupingChecked(s, e) {
    var pId = s.name.split('_')[0];
    var gv = getGridview(pId);
    gv.isGrouping = s.GetChecked();
}

