
//
// Main script 
//

var _jsonData;

window.addEventListener('resize', function (event) {
    console.log("window - innerWidth " + window.innerWidth + ", window - innerHeight " + window.innerHeight);
})

function splitterMainResized(s, e) {
    // Update Map
    _map.updateSize();

    // Update Graph
    if (_jsonData != null && _pieSvg != null) {
        // Tried to just update Svg - not working
        //var paneSize = getPaneSize('paneGraph');
        //_pieSvg.attr("width", paneSize.width).attr("height", paneSize.height);
        var pieData = getPieData('paneGraph', _jsonData, 'Applicant', 'Quantity_m3', false);
        drawPie('pieChart', pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
    }

    // Update Gridview
    var pGridview = splitterMain.GetPaneByName('paneGridview');
    dxGridview.SetHeight(pGridview.GetClientHeight() - 10);
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

                convertJsonToDataTable(jsonData);   // For Gridview
            })
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsBinaryString(file);
    };
};

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
        addPointLayer(_jsonData, 'Latitude', 'Longitude');

        dxGridview.PerformCallback();

        var pieData = getPieData('paneGraph', _jsonData, 'Applicant', 'Quantity_m3', true);
        _pieSvg = drawPie('pieChart', pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
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
        var fileName = e.target.files[0].name;
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
        data: { 'sender': sender, 'paneDir': paneDir, 'paneType': paneType },
        success: function (data) {
            $('#divRightPanelPartial').html(data);
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
