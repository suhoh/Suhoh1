﻿
//
// Main script 
//

var _jsonData;              // loaded data in JSON
var _jsonDataGridview       // stringify data for only Gridview
var _columnNames;           // loaded column names    
var _filename;              // loaded filename
var _activePropertyName     // currently active property when clicked from panel

window.addEventListener('resize', function (event) {
    console.log("window - innerWidth " + window.innerWidth + ", window - innerHeight " + window.innerHeight);
})

function clearAllPanels() {
    // clear array
    _maps = [];
    _pies = [];
    _bars = [];
    _gridviews = [];
}

function splitterMainResized(s, e) {
    // Update all panes
    updateMaps(_maps);
    updatePies(_pies);
    updateBars(_bars);
    updateGridviewHeights(_gridviews);
}

function updateMaps(maps) {
    maps.forEach(function (m) {
        m.map.updateSize();
    })
}

function updatePies(pies) {
    if (pies.length == 0)
        return;
    pies.forEach(function (p) {
        // Tried to just update Svg - not working
        //var paneSize = getPaneSize('paneGraph');
        //_pieSvg.attr("width", paneSize.width).attr("height", paneSize.height);
        var pieData = getPieData(p.divName, p.data, p.xCol, p.yCol, false);
        if (pieData != null)
            drawPie(p.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
        _activePie = p;
        // check and see if chkPiePercentageLabel already created. It gets created when opening up Property.
        if (typeof chkPiePercentageLabel != "undefined" && ASPxClientUtils.IsExists(chkPiePercentageLabel))
            chkPieLabelClicked();
    });

}

function updateBars(bars) {
    if (bars.length == 0)
        return;
    bars.forEach(function (b) {
        var barData = getBarData(b.divName, b.data, b.xCol, b.yCol, b.color, false);     // used to be PaneId
        if (barData != null) {
            var barSvg = drawBar(b.divName, barData.barData, barData.width, barData.height, barData.color);
            b.svg = barSvg;
        }
        _activeBar = b;
        if (typeof cbBarXValue != "undefined" && ASPxClientUtils.IsExists(cbBarXValue))
            chkBarLabelClicked();
    });
}

function updateGridviews(gridviews) {
    if (gridviews.length == 0)
        return;
    _gridviews.forEach(function (g) {
        var gv = eval(g.name);
        gv.PerformCallback();
        document.getElementById(g.name + "|Title").innerHTML = _filename;
    })
}

function updateGridviewHeights(gridviews) {
    if (gridviews.length == 0)
        return;
    gridviews.forEach(function (g) {
        var pane = splitterMain.GetPaneByName(g.name);
        var gv = eval(g.name);
        gv.SetHeight(pane.GetClientHeight() - 10); // leave room for header

    });
}

function getPaneSize(paneId) {
    var pGraph = splitterMain.GetPaneByName(paneId);
    var width = pGraph.GetClientWidth();
    var height = pGraph.GetClientHeight();
    return { width: width, height: height }
}


var ExcelToJSON = function () {
    this.parseExcel = function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary', cellDates: true, cellText: false
            });
            workbook.SheetNames.forEach(function (sheetName) {  // https://github.com/SheetJS/sheetjs/issues/841
                _jsonData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName], { raw: true, dateNF: 'yyyy-mm-dd' });   // array - _jsonData[0][column name]
                //_jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true, dateNF: 'yyyy-mm-dd' });   // array - _jsonData[0][column name]
                _jsonDataGridview = JSON.stringify(_jsonData);   // [{'applicant':'aaa', 'project:'bbbb'...}, { ...}]
                var columnNames = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })[0]; 
                columnNames.sort();
                convertJsonToDataTable(_jsonData, _jsonDataGridview);   // For Gridview
            })
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsBinaryString(file);
    };
};

// Initial loading
// Panes already created.
// Ajax: convert Json to DataTable and will show in Gridview
function convertJsonToDataTable(jsonData, jsonDataGridview) {
    if (jsonData == undefined || jsonDataGridview == undefined) {
        console.log("convertJsonToDataTable: jsonData or jsonDataGridview is null.");
        return;
    }

    var url = "Home/ConvertJsonToDataTable"
    $.ajax({
        type: "POST",
        url: url,
        data: { 'json': jsonDataGridview },
        dataType: "json",
        success: successFunc,
        error: errorFunc
    });

    function successFunc(data, status) {    // returns list of column name and type. DataTypes: int64, String, DateTime, Date, Double )
        if (status != 'success') {
            console.log("ConvertJsonToDataTable: no column names returned.");
            return;
        }
        _columnNames = data;

        populateLeftPanelSearchColumn(_columnNames);

        // Maps
        var mapColNames = getLonLatColumnNames(data);
        _maps.forEach(function (m) {
            addPointLayer(jsonData, m, mapColNames.xCol, mapColNames.yCol);
        })

        // Gridviews
        updateGridviews(_gridviews)

        // Pies
        var pieColNames = getPieColNames(data);
        _pies.forEach(function (p) {
            var pieData = getPieData(p.divName, jsonData, pieColNames.xCol, pieColNames.yCol, true);
            if (pieData != null) {
                var pieSvg = drawPie(p.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
                p.svg = pieSvg;
            }
            document.getElementById(p.divName + "|Title").innerHTML = p.xCol + " vs " + p.yCol;   // title in panel
        });

        // Bars
        var barColNames = getBarColNames(data);
        _bars.forEach(function (b) {
            var barData = getBarData(b.divName, jsonData, barColNames.xCol, barColNames.yCol, b.color,  true);
            if (barData != null) {
                var barSvg = drawBar(b.divName, barData.barData, barData.width, barData.height, barData.color);
                b.svg = barSvg;
            }
            document.getElementById(b.divName + "|Title").innerHTML = b.xCol + " vs " + b.yCol;   // title in panel
        });

        loadingPanel.Hide();
    }
    function errorFunc() {
        alert("Error: ConvertJsonToDataTable");
    }
}

function loadExcelFile(evt) {
    var excelFile = document.createElement('input');
    excelFile.type = 'file';
    excelFile.accept = '.xls, .xlsx'
    excelFile.id = 'excelFile';

    document.body.appendChild(excelFile);

    $('input[type="file"]').change(function (e) {

        loadingPanel.Hide();
        loadingPanel.Show();

        _filename = e.target.files[0].name;
        tbExcelFilename.SetText(_filename);
        var xl2json = new ExcelToJSON();
        xl2json.parseExcel(e.target.files[0]);

    });
    excelFile.click();
}

function getLonLatColumnNames(columnNames) {
    if (columnNames == undefined || columnNames.length == 0)
        return;

    // get x/y column
    var xCol = null;
    var yCol = null;
    for (i = 0; i < columnNames.length; i++) {
        if (columnNames[i].Name == _lonColName)
            xCol = columnNames[i].Name;
        if (columnNames[i].Name == _latColName)
            yCol = columnNames[i].Name;
    }
    return { xCol: xCol, yCol: yCol }
}

function getPieColNames(columnNames) {
    if (columnNames == undefined || columnNames.length == 0)
        return;

    // xCol: String or DateTime, yCol: numbers
    var xCol = null;
    var yCol = null;
    for (i = 0; i < columnNames.length; i++) {
        if (xCol == null && (columnNames[i].Type == 'String' || columnNames[i].Type == 'DateTime' || columnNames[i].Type == 'Date'))
            xCol = columnNames[i].Name;
        if (yCol == null && (columnNames[i].Type == 'Int64' || columnNames[i].Type == 'Double'))
            yCol = columnNames[i].Name;
    }
    return { xCol: xCol, yCol: yCol }
}

function getBarColNames(columnNames) {
    if (columnNames == undefined || columnNames.length == 0)
        return;

    // xCol: String or DateTime, yCol: numbers
    var xCol = null;
    var yCol = null;
    for (i = 0; i < columnNames.length; i++) {
        if (xCol == null && (columnNames[i].Type == 'String' || columnNames[i].Type == 'DateTime' || columnNames[i].Type == 'Date'))
            xCol = columnNames[i].Name;
        if (yCol == null && (columnNames[i].Type == 'Int64' || columnNames[i].Type == 'Double'))
            yCol = columnNames[i].Name;
    }
    return { xCol: xCol, yCol: yCol }
}

// This function will be used for all 3 panels (Map, Graph and Gridview)
function radioAddPaneTypeClick(s, e) {
}

function radioAddPaneDirectionClick(s, e) {
}

var addNewPaneSender;
function addNewPane(s) {
    addNewPaneSender = s.name;
    popupAddNewPane.Show();
}

function btnAddNewPaneClick(s, e) {
    var sender = s.name;
    var paneDir = radioAddPaneDirection.GetValue();
    var paneType = radioAddPaneType.GetValue();

    //var url = '@Url.Action("RightPanelPartial", "Home")';
    var url = "Home/RightPanelPartial";
    $.ajax({
        type: "POST",
        url: url,
        data: { 'sender': sender, 'paneDir': paneDir, 'paneType': paneType, 'jsonPanels': null },
        success: function (data) {
            $('#divRightPanelPartial').html(data);
            //splitterMainResized();
            //$('#divRightPanelPartial').addClass('rightPanelPartial');
            //$("#divRightPanelPartial").load('Home');
            //$("#divRightPanelPartial").load('@Url.Content("Home/RightPanelPartial")');
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
        }
    });

    //cbRightPanelPartial.PerformCallback({
    //    'sender': addNewPaneSender, 'paneDir': paneDir, 'paneType': paneType
    //});
}

//
// Popup property callback
// Being called from all the panels (pie, bar, map, gridview)
//
function showPropertyPopup(s) {
    _activePropertyName = s.id; // Panel2Bar1|Property
    callbackPopupPanelProperty.PerformCallback({
        'sender': s.id
    });
}

function callbackPopupPanelProperty_OnBeginCallback(s, e) {
    popupPanelProperty.Show();
}

function callbackPopupPanelProperty_OnEndCallback(s, e) {
    var id = _activePropertyName.split('|')[0];
    if (id.toUpperCase().indexOf('PIE') > -1)
        renderPieProperty(id);
    if (id.toUpperCase().indexOf('BAR') > -1) 
        renderBarProperty(id)
    if (id.toUpperCase().indexOf('MAP') > -1)
        renderMapProperty(id)
}

function renderPieProperty(id) {
    popupPanelProperty.SetHeaderText("Pie Property");
    if (_columnNames == undefined || _columnNames.length == 0) {
        console.log("_columnNames: null or empty.")
        return;
    }
    cbPieXColumn.ClearItems();
    cbPieYColumn.ClearItems();
    _columnNames.forEach(function (c) {
        if (c.Type == 'String' || c.Type == 'DateTime' || c.Type == 'Date')
            cbPieXColumn.AddItem(c.Name);
        if (c.Type == 'Int64' || c.Type == 'Double')
            cbPieYColumn.AddItem(c.Name);
    });

    var canvas = ramp(_colorScaleHSL);
    var div = document.getElementById('divColorRampPie');
    div.appendChild(canvas);

    var pie = getPie(id);
    _activePie = pie;
    document.getElementById(pie.divName + "|Title").innerHTML = pie.xCol + " vs " + pie.yCol;   // title in panel
    tbPropertyPieTitle.SetText(pie.xCol + " vs " + pie.yCol); // title in property

    chkPiePercentageLabel.SetChecked(pie.isPercentage);
    chkPieYValueLabel.SetChecked(pie.isYValue);
    chkPieXValueLabel.SetChecked(pie.isXValue);
    chkPieLabelClicked();

    cbPieXColumn.SetValue(pie.xCol);
    cbPieYColumn.SetValue(pie.yCol);
    radioColorRampPie.SetValue(pie.colorRamp);
    radioColorRampPieClicked();
}

function renderBarProperty(id) {
    popupPanelProperty.SetHeaderText("Bar Property");
    if (_columnNames == undefined || _columnNames.length == 0) {
        console.log("_columnNames: null or empty.")
        return;
    }
    cbBarXColumn.ClearItems();
    lbBarYColumn.ClearItems();
    _columnNames.forEach(function (c) {
        if (c.Type == 'String' || c.Type == 'DateTime' || c.Type == 'Date')
            cbBarXColumn.AddItem(c.Name);
        if (c.Type == 'Int64' || c.Type == 'Double')
            lbBarYColumn.AddItem(c.Name);
    });

    var bar = getBar(id);
    _activeBar = bar;

    cbBarXColumn.SetValue(bar.xCol);
    lbBarYColumn.SetValue(bar.yCol);

    var selectedItems = lbBarYColumn.GetSelectedItems();
    ddBarYColumn.SetText(getSelectedItemsText(selectedItems));

    document.getElementById(bar.divName + "|Title").innerHTML = bar.xCol + " vs " + bar.yCol;
    tbPropertyBarTitle.SetText(bar.xCol + " vs " + bar.yCol); // title in property

    ceBarColorPicker.SetColor(bar.color);
}

function renderMapProperty(id) {
    popupPanelProperty.SetHeaderText("Map Property");

    //if (_columnNames == undefined || _columnNames.length == 0) {
    //    console.log("_columnNames: null or empty.")
    //    return;
    //}

    var map = getMap(id);
    _activeMap = map;
}

//
// Right panel(main) callback
//
function callbackRightPanelPartial_OnBeginCallback(s, e) {
    e.customArgs["OnBeginCallback"] = "Hello World";
}
function callbackRightPanelPartial_OnEndCallback(s, e) {
    //onBrowserWindowResized();
    //_map.updateSize();
    //dxGridview.Refresh();   // test refresh
}
