//
// Gridview main functions
//

var _gridviews = [];    // { 'name': name }

function initGridview( name) {
    _gridviews.push({ 'name': name });
}

function btnGridviewMaximizeClick(s) {
    var pId = s.id.split('|')[0];
    var map = getMap(pId);
    var p = splitterMain.GetPaneByName(pId);
    p.Expand();
    map.isMaximized = !map.isMaximized;
}

function btnGridviewLegendClick(s) {

}

function btnGridviewCloseClick(s) {

}