﻿
//
// Main script 
//

var _jsonData;
var _filename;

window.addEventListener('resize', function (event) {
    console.log("window - innerWidth " + window.innerWidth + ", window - innerHeight " + window.innerHeight);
})

function splitterMainResized(s, e) {
    // Update Map
    _maps.forEach(function (m) {
        m.map.updateSize();
    })

    // Update Graph
    _pies.forEach(function (p) {
        // Tried to just update Svg - not working
        //var paneSize = getPaneSize('paneGraph');
        //_pieSvg.attr("width", paneSize.width).attr("height", paneSize.height);
        var xColumn = p.xCol;
        var yColumn = p.yCol;
        var pieData = getPieData(p.divName, p.data, xColumn, yColumn, false);
        if (pieData != null)
            drawPie(p.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);

    });

    // Update Gridview
    _gridviews.forEach(function (g) {
        var pGridview = splitterMain.GetPaneByName(g.name);
        g.gridview.SetHeight(pGridview.GetClientHeight() - 10); // leave room for header

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
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                _jsonData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);   // array - _jsonData[0][column name]
                var jsonData = JSON.stringify(_jsonData);   // [{'applicant':'aaa', 'project;:'bbbb'...}, { ...}]
                var headerNames = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })[0];

                addColumnNames(headerNames);

                var canvas = ramp(_colorScaleHSL);
                var div = document.getElementById('divColorRampPie');
                div.appendChild(canvas);


                //updatePaneTitle();

                convertJsonToDataTable(jsonData);   // For Gridview
            })
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsBinaryString(file);
    };
};

// Todo: need to add column names to all drop downs
//       need to get column type from code behind
function addColumnNames(headerNames) {
    cbXColumnDropDown.ClearItems();
    cbYColumnDropDown.ClearItems();
    for (i = 0; i < headerNames.length; i++) {
        cbXColumnDropDown.AddItem(headerNames[i], headerNames[i]);
        cbYColumnDropDown.AddItem(headerNames[i], headerNames[i]);
    }
    if (headerNames != null) {
        // Just for testing purpose
        if (_filename.indexOf('AGWL') > -1) {
            cbXColumnDropDown.SetSelectedIndex(0);
            cbYColumnDropDown.SetSelectedIndex(5);
        }
        else if (_filename.indexOf('AWWID') > -1) {
            cbXColumnDropDown.SetSelectedIndex(16);
            cbYColumnDropDown.SetSelectedIndex(7);
        }
        else if (_filename.indexOf('WA_Licences') > -1) {
            cbXColumnDropDown.SetSelectedIndex(0);
            cbYColumnDropDown.SetSelectedIndex(14);
        }
        else {
            cbXColumnDropDown.SetSelectedIndex(0);
            cbYColumnDropDown.SetSelectedIndex(1);
        }
        // Chart Property Title Initialization
        var xColumn = cbXColumnDropDown.GetText();
        var yColumn = cbYColumnDropDown.GetText();

        propertyTitle.SetText(xColumn + " vs " + yColumn);

    }
}

// Initial loading
// Panes already created.
// Ajax: convert Json to DataTable and will show in Gridview
function convertJsonToDataTable(json) {
    var url = "Home/ConvertJsonToDataTable"
    $.ajax({
        type: "POST",
        url: url,
        data: { 'json': json },
        dataType: "json",
        success: successFunc,
        error: errorFunc
    });

    function successFunc(data, status) {
        // Maps
        _maps.forEach(function (m) {
            addPointLayer(_jsonData, m.map, 'Latitude', 'Longitude');
        })

        // Gridviews
        _gridviews.forEach(function (g) {
            g.gridview.PerformCallback();
        })

        // Graphs
        _pies.forEach(function (p) {
            p.xCol = cbXColumnDropDown.GetText();
            p.yCol = cbYColumnDropDown.GetText();
            var pieData = getPieData(p.divName, _jsonData, p.xCol, p.yCol, true);     // used to be PaneId
            if (pieData != null) {
                var pieSvg = drawPie(p.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
                p.svg = pieSvg;
            }
        });

        loadingPanel.Hide();

        //_barSvg = drawBar('pieChart', pieData.pieData, pieData.width, pieData.height)
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

        loadingPanel.Show();

        _filename = e.target.files[0].name;
        tbExcelFilename.SetText(_filename);
        var xl2json = new ExcelToJSON();
        xl2json.parseExcel(e.target.files[0]);

    });
    excelFile.click();
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

function callbackRightPanelPartial_OnBeginCallback(s, e) {
    e.customArgs["OnBeginCallback"] = "Hello World";
}
function callbackRightPanelPartial_OnEndCallback(s, e) {
    //onBrowserWindowResized();
    //_map.updateSize();
    //dxGridview.Refresh();   // test refresh
}
