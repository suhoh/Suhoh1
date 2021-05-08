//
// Gridview main functions
//

var _gridviews = [];    // { 'name': name }
var _activeGridview;

function initGridview(name) {
    _gridviews.push({ 'name': name });  // DevExpress control name
}

function getGridview(divName) {
    for (i = 0; i < _gridviews.length; i++) {
        if (_gridviews[i].name == divName)
            return _gridviews[i]
    }
    return null;
}

function cbGridviewPageSizeChanged(s, e) {

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