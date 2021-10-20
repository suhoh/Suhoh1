
//
// Main script 
//

var _initialLoad = true;    // initGridview is being called
var _jsonData;              // loaded data in JSON
var _jsonDataGridview       // stringify data for only Gridview
var _columnNames;           // loaded column names    
var _filename;              // loaded filename
var _filetype               // .zip, .xls, .xlsx, csv
var _activePropertyName     // currently active property when clicked from panel

window.addEventListener('resize', function (event) {
    //console.log("window - innerWidth " + window.innerWidth + ", window - innerHeight " + window.innerHeight);
})

function showMessage(msg, level) {
    errorLabel.SetText(msg);
    pcErrorModalDialog.SetHeaderText(level);
    pcErrorModalDialog.Show();
}

function clearAllPanels() {
    // clear array
    _maps = [];
    _pies = [];
    _bars = [];
    _lines = [];
    _scatters = [];
    _gridviews = [];
}

function clearAllAttributes() {
    _maps.forEach(function (m) {
        m.xCol = m.yCol = m.zCol = null;
    });
    _pies.forEach(function (p) {    // Add attributes to clear

    });
    _bars.forEach(function (b) {

    });
    _lines.forEach(function (l) {

    })
    _gridviews.forEach(function (g) {

    })
}

function splitterMainResized(s, e) {
    // Update all panes
    updateMaps(_maps);
    updatePies(_pies, false);
    updateBars(_bars, false);
    updateLines(_lines, false);
    updateScatters(_scatters, false);
    updateGridviewHeights(_gridviews);
}

function updateMaps(maps) {
    maps.forEach(function (m) {
        m.map.updateSize();
    })
}

function updatePies(pies, isInitial) {
    if (pies.length == 0)
        return;
    pies.forEach(function (p) {
        // Tried to just update Svg - not working
        //var paneSize = getPaneSize('paneGraph');
        //_pieSvg.attr("width", paneSize.width).attr("height", paneSize.height);
        var pieData = getPieData(p.divName, p.data, p.xCol, p.yCol, isInitial);
        if (pieData != null)
            drawPie(p.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
        _activePie = p;
        // check and see if chkPiePercentageLabel already created. It gets created when opening up Property.
        if (typeof chkPiePercentageLabel != "undefined" && ASPxClientUtils.IsExists(chkPiePercentageLabel))
            chkPieLabelClicked(null, null, p.divName);
    });
}

function updatePie(p, isInitial) {
    var pieData = getPieData(p.divName, p.data, p.xCol, p.yCol, isInitial);
    if (pieData != null)
        drawPie(p.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
    _activePie = p;
    // check and see if chkPiePercentageLabel already created. It gets created when opening up Property.
    if (typeof chkPiePercentageLabel != "undefined" && ASPxClientUtils.IsExists(chkPiePercentageLabel))
        chkPieLabelClicked(null, null, p.divName);
}

function updateBars(bars, isInitial) {
    if (bars.length == 0)
        return;
    bars.forEach(function (b) {
        var barData = getBarData(b.divName, b.data, b.xCol, b.yCol, b.color, isInitial);     // used to be PaneId
        if (barData != null) {
            var barSvg = drawBar(b.divName, barData.barData, barData.colData, barData.width, barData.height, barData.color);
            b.svg = barSvg;
        }
        _activeBar = b;
        //if (typeof cbBarXColumn != "undefined" && ASPxClientUtils.IsExists(cbBarXColumn))
            chkBarLabelClicked(null, null, b.divName);
    });
}

function updateBar(b, isInitial) {
    var barData = getBarData(b.divName, b.data, b.xCol, b.yCol, b.color, isInitial);     // used to be PaneId
    if (barData != null) {
        var barSvg = drawBar(b.divName, barData.barData, barData.colData, barData.width, barData.height, barData.color);
        b.svg = barSvg;
    }
    _activeBar = b;
    if (typeof cbBarXColumn != "undefined" && ASPxClientUtils.IsExists(cbBarXColumn))
        chkBarLabelClicked(null, null, b.divName);
}

function updateLines(lines, isInitial) {
    if (lines.length == 0)
        return;
    lines.forEach(function (l) {
        var lineData = getLineData(l.divName, l.data, l.xCol, l.yCol, l.color, isInitial);     // used to be PaneId
        if (lineData != null) {
            var lineSvg = drawLine(l.divName, lineData.lineData, lineData.colData, lineData.width, lineData.height, lineData.color);
            l.svg = lineSvg;
        }
        _activeLine = l;
        //if (typeof cbLineXColumn != "undefined" && ASPxClientUtils.IsExists(cbLineXColumn))
            chkLineLabelClicked(null, null, l.divName);
    });
}

function updateLine(l, isInitial) {
    var lineData = getLineData(l.divName, l.data, l.xCol, l.yCol, l.color, isInitial);     // used to be PaneId
    if (lineData != null) {
        var lineSvg = drawLine(l.divName, lineData.lineData, lineData.colData, lineData.width, lineData.height, lineData.color);
        l.svg = lineSvg;
    }
    _activeLine = l;
    if (typeof cbLineXColumn != "undefined" && ASPxClientUtils.IsExists(cbLineXColumn))
        chkLineLabelClicked(null, null, l.divName);
}

function updateScatters(scatters, isInitial) {
    if (scatters.length == 0)
        return;
    scatters.forEach(function (s) {
        updateScatter(s, isInitial);
    });
}

function updateScatter(s, isInitial) {
    var scatterData = getScatterData(s.divName, s.data, s.xCol, s.yCol, s.zCol, s.color, isInitial);     // used to be PaneId
    if (scatterData != null) {
        var scatterSvg = drawScatter(s.divName, scatterData.scatterData, scatterData.width, scatterData.height, scatterData.color);
        s.svg = scatterSvg;
    }
    _activeScatter = s;
    //if (typeof cbScatterXColumn != "undefined" && ASPxClientUtils.IsExists(cbScatterXColumn))
        chkScatterLabelClicked(null, null, s.divName);
}

function updateGridviews(gridviews) {
    if (gridviews.length == 0)
        return;
    gridviews.forEach(function (g) {
        var gv = eval(g.name);
        gv.PerformCallback({ 'isReLoad': false });
        console.log('gv.PerformCallback: updateGridviews');
        document.getElementById(g.name + "_Title").innerHTML = _filename;
    })
}

// Update single gridview
function updateGridviewHeight(gridview) {
    if (gridview == undefined)
        return;
    var pane = splitterMain.GetPaneByName(gridview.name);
    var gv = eval(gridview.name);
    gv.SetHeight(pane.GetClientHeight() - 10); // leave room for header
}

// Update all gridviews
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

//
// Load data
//
function loadDataSource(evt) {
    var sourceType = radioSelectDataSource.GetValue();
    var sourceFile = document.createElement('input');
    sourceFile.type = 'file';
    sourceFile.id = 'sourceFile';
    if (sourceType == 1)
        sourceFile.accept = '.zip';
    else if (sourceType == 2)
        sourceFile.accept = '.xls, .xlsx';
    else if (sourceType == 3)
        sourceFile.accept = '.csv';
    else
        sourceFile.accept = '.zip, .xls, .xlsx, .csv';  // shape zip file, Excel and CSV

    document.body.appendChild(sourceFile);

    $('input[type="file"]').change(function (e) {

        loadingPanel.Hide();
        loadingPanel.Show();
        clearAllAttributes();

        _filename = e.target.files[0].name;
        _filetype = _filename.substr(_filename.lastIndexOf('.') + 1, _filename.length - _filename.lastIndexOf('.') - 1).toUpperCase();    // ZIP, XLS, XLSX, CSV
        tbSourceFilename.SetText(_filename);
        if (_filetype == 'ZIP') {
            var shp2json = new shapeToJSON();
            shp2json.parseShape(e.target.files[0]);
        }
        if (_filetype == 'XLS' || _filetype == 'XLSX') {
            var xl2json = new ExcelToJSON();
            xl2json.parseExcel(e.target.files[0]);
        }
        if (_filetype == 'CSV') {
            var csv2Json = new csvToJson();
            csv2Json.parseCsv(e.target.files[0])
        }
    });
    sourceFile.click();
}

//
// Excel to Json
//
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
                _jsonData = addSeqNo(_jsonData);    // add sequence number
                //_jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: true, dateNF: 'yyyy-mm-dd' });   // array - _jsonData[0][column name]
                _jsonDataGridview = JSON.stringify(_jsonData);   // [{'applicant':'aaa', 'project:'bbbb'...}, { ...}]
                var columnNames = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 })[0]; 
                columnNames.sort();
                for (var i = 0; i < _maps.length; i++) {
                    _maps[i].type = 'XLS';
                }

                // Enable XY column for map property if already shown
                if (typeof cbMapXColumn != "undefined" && ASPxClientUtils.IsExists(cbMapXColumn)) {
                    cbMapXColumn.SetEnabled(true);
                    cbMapYColumn.SetEnabled(true);
                }

                updateAllViews(_jsonData, _jsonDataGridview);   // Populate Gridview and update all views
                console.log('updateAllViews: ExcelToJSON');
            })
        };
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsBinaryString(file);
    };
};

//
// Load CSV
//
var csvToJson = function () {
    this.parseCsv = function (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var csvFile = e.target.result;
            d3.csv(csvFile).then(function (data) {
                _jsonData = addSeqNo(data);    // add sequence number
                _jsonDataGridview = JSON.stringify(_jsonData);   // [{'applicant':'aaa', 'project:'bbbb'...}, { ...}]

                for (var i = 0; i < _maps.length; i++) {
                    _maps[i].type = 'CSV';
                }
                // Enable XY column for map property if already shown
                if (typeof cbMapXColumn != "undefined" && ASPxClientUtils.IsExists(cbMapXColumn)) {
                    cbMapXColumn.SetEnabled(true);
                    cbMapYColumn.SetEnabled(true);
                }

                updateAllViews(_jsonData, _jsonDataGridview);   // Populate Gridview and update all views
                console.log('updateAllViews: csvToJson');
            });
        }
        reader.onerror = function (ex) {
            console.log(ex);
        };
        reader.readAsDataURL(file);
    }
}

//
// zipped shape file to Json
//
var shpLoaded = false;
var shapeToJSON = function () {
    this.parseShape = function (zipFile) {
        loadshp({
            //url: 'TestPt_wgs84.zip',
            url: zipFile,
            encoding: 'big5',   // default: utf-8, big5
            EPSG: 4326  // wgs84
        },
        function (data) {
            if (shpLoaded) {    // This gets called twice all the time. Load it once
                shpLoaded = false;
                return;
            }
            if (data == null) {
                alert('No shape records found.');
                return;
            }
            shpLoaded = true;

            var features = new ol.format.GeoJSON().readFeatures(data, { featureProjection: 'EPSG:4326' });  // WGS84
            if (features.length == 0)
                return;
            var geomType = features[0].getGeometry().getType(); // Point, LineString, Polygon

            _jsonData = [];
            var symbols = [];
            var myFeat = [];    // { 'geom': item.getGeometry(), 'seq': index }
            var lat, lon;
            $.each(features, function (index, item) {
                myFeat.push({ 'geom': item.getGeometry(), 'Seq': index });
                item.values_['Seq'] = index;    // Add sequence here which matches with index
                delete item.values_.geometry;
                _jsonData.push(item.values_);
            });

            _geometry = myFeat; // Save as global. Used when Change Layout

            for (var i = 0; i < _maps.length; i++) { // Set map's type to SHPb
                _maps[i].type = 'SHP';
                _maps[i].features = myFeat;
            }

            // Disable XY column since shape already has coordinates
            if (typeof cbMapXColumn != "undefined" && ASPxClientUtils.IsExists(cbMapXColumn)) {
                cbMapXColumn.SetEnabled(false);
                cbMapYColumn.SetEnabled(false);
            }

            //_jsonData = addSeqNo(_jsonData);
            _jsonDataGridview = JSON.stringify(_jsonData);   // [{'applicant':'aaa', 'project:'bbbb'...}, { ...}]
            updateAllViews(_jsonData, _jsonDataGridview);   // Populate Gridview and update all views
            console.log('updateAllViews: shapeToJSON');
        });
    }
}

function addSeqNo(json) {
    for (var i = 0; i < json.length; i++) {
        json[i]['Seq'] = i;
    }
    return json;
}

// Initial loading
// Panes already created.
// Ajax: convert Json to DataTable and will show in Gridview
function updateAllViews(jsonData, jsonDataGridview) {
    if (jsonData == undefined || jsonDataGridview == undefined) {
        console.log("updateAllViews: jsonData or jsonDataGridview is null.");
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

    // Update all views
    function successFunc(data, status) {    // returns list of column name and type. DataTypes: int64, String, DateTime, Date, Double )
        if (status != 'success') {
            console.log("ConvertJsonToDataTable: no column names returned.");
            return;
        }
        _columnNames = data;

        populateLeftPanelSearchColumn(_columnNames);

        _filteredData = null;   // Reset filtered data to null which applies all panel

        // Maps
        // if property is open and Show Label is checked
        if (typeof cbShowLabel != "undefined" && ASPxClientUtils.IsExists(cbShowLabel) && ASPxClientUtils.IsExists(chkShowLabel)) {
            chkShowLabel.SetChecked(false); // uncheck show label checkbox when loading new data
        }
         var cNames = getLonLatColumnNames(data);
        _maps.forEach(function (m) {
            m.isLabelOn = false;    // set it to false when loading new data
            m.zCol = cNames.zCol;
            addPointLayer(jsonData, m, cNames.xCol, cNames.yCol, cNames.zCol, true); // true: zoom to layer
            console.log("addPointLayer: updateAllViews");
        })

        // Gridviews
        _gridviews.forEach(function (g) {
            g.isHeaderFilter = false;   
            g.isGrouping = false;       
            var gv = eval(g.name);      // DevExpress control
            gv.ClearFilter();
            gv.PerformCallback({ 'isReLoad': true });
            console.log('gv.PerformCallback: updateAllViews');
            document.getElementById(g.name + "_Title").innerHTML = _filename;
        })

        // Pies
        var pieColNames = getPieColNames(data);
        _pies.forEach(function (p) {
            var pieData = getPieData(p.divName, jsonData, pieColNames.xCol, pieColNames.yCol, true);
            if (pieData != null) {
                var pieSvg = drawPie(p.divName, pieData.pieData, pieData.width, pieData.height, pieData.min / 2);
                p.svg = pieSvg;
            }
            document.getElementById(p.divName + "_Title").innerHTML = p.xCol + " vs " + p.yCol;   // title in panel
        });

        // Bars
        var barColNames = getBarColNames(data);
        _bars.forEach(function (b) {
            var barData = getBarData(b.divName, jsonData, barColNames.xCol, barColNames.yCol, b.color, true);
            if (barData != null) {
                var barSvg = drawBar(b.divName, barData.barData, barData.colData, barData.width, barData.height, barData.color);
                b.svg = barSvg;
            }
            document.getElementById(b.divName + "_Title").innerHTML = b.xCol + " vs " + b.yCol;   // title in panel
        });

        // Lines
        var lineColNames = getLineColNames(data);
        _lines.forEach(function (l) {
            var lineData = getLineData(l.divName, jsonData, lineColNames.xCol, lineColNames.yCol, l.color, true);
            if (lineData != null) {
                var lineSvg = drawLine(l.divName, lineData.lineData, lineData.colData, lineData.width, lineData.height, lineData.color);
                l.svg = lineSvg;
            }
            document.getElementById(l.divName + "_Title").innerHTML = l.xCol + " vs " + l.yCol; // title in panel
        });

        // Scatter
        var scatterColNames = getScatterColNames(data);
        _scatters.forEach(function (s) {
            var scatterData = getScatterData(s.divName, jsonData, scatterColNames.xCol, scatterColNames.yCol, scatterColNames.zCol, s.color, true);
            if (scatterData != null) {
                var scatterSvg = drawScatter(s.divName, scatterData.scatterData, scatterData.width, scatterData.height, scatterData.color);
                s.svg = scatterSvg;
            }
            document.getElementById(s.divName + "_Title").innerHTML = s.xCol + " vs " + s.yCol; // title in panel
        });

        // render property popup if shown
        if (popupPanelProperty.IsVisible())
            callbackPopupPanelProperty_OnEndCallback();

        loadingPanel.Hide();
    }
    function errorFunc() {
        alert("Error: ConvertJsonToDataTable");
    }
}

function getLonLatColumnNames(columnNames) {
    if (columnNames == undefined || columnNames.length == 0)
        return;

    // get x/y column
    var xCol = null;
    var yCol = null;
    var zCol = null;    // label column
    for (i = 0; i < columnNames.length; i++) {
        if (columnNames[i].Name.toUpperCase() == _lonColName || columnNames[i].Name.toUpperCase() == _x)
            xCol = columnNames[i].Name;
        if (columnNames[i].Name.toUpperCase() == _latColName || columnNames[i].Name.toUpperCase() == _y)
            yCol = columnNames[i].Name;
    }
    if (xCol != null && yCol != null)
        zCol = columnNames[0].Name; // take the first one from list

    return { xCol: xCol, yCol: yCol, zCol: zCol }
}

function getPieColNames(columnNames) {
    if (columnNames == undefined || columnNames.length == 0)
        return;

    // xCol: String or DateTime, yCol: numbers
    var xCol = null;
    var yCol = null;
    for (i = 0; i < columnNames.length; i++) {
        if (xCol == null && (columnNames[i].Type == 'String' || columnNames[i].Type == 'DateTime' || columnNames[i].Type == 'Date' || columnNames[i].Name == 'Seq'))
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
        if (xCol == null && (columnNames[i].Type == 'String' || columnNames[i].Type == 'DateTime' || columnNames[i].Type == 'Date' || columnNames[i].Name == 'Seq'))
            xCol = columnNames[i].Name;
        if (yCol == null && (columnNames[i].Type == 'Int64' || columnNames[i].Type == 'Double'))
            yCol = columnNames[i].Name;
    }
    return { xCol: xCol, yCol: yCol }
}

function getLineColNames(columnNames) {
    if (columnNames == undefined || columnNames.length == 0)
        return;

    // xCol: String or DateTime, yCol: numbers
    var xCol = null;
    var yCol = null;
    for (i = 0; i < columnNames.length; i++) {
        if (xCol == null && (columnNames[i].Type == 'String' || columnNames[i].Type == 'DateTime' || columnNames[i].Type == 'Date' || columnNames[i].Name == 'Seq'))
            xCol = columnNames[i].Name;
        if (yCol == null && (columnNames[i].Type == 'Int64' || columnNames[i].Type == 'Double'))
            yCol = columnNames[i].Name;
    }
    return { xCol: xCol, yCol: yCol }
}

function getScatterColNames(columnNames) {
    if (columnNames == undefined || columnNames.length == 0)
        return;

    // xCol: numbers, yCol: numbers, zCol: String or DateTime
    var xCol = null;
    var yCol = null;
    var zCol = null;
    for (i = 0; i < columnNames.length; i++) {
        if (xCol == null && (columnNames[i].Type == 'Int64' || columnNames[i].Type == 'Double'))
            xCol = columnNames[i].Name;
        if (yCol == null && (columnNames[i].Type == 'Int64' || columnNames[i].Type == 'Double'))
            yCol = columnNames[i].Name;
        if (zCol == null && (columnNames[i].Type == 'String' || columnNames[i].Type == 'DateTime' || columnNames[i].Type == 'Date' || columnNames[i].Name == 'Seq'))
            zCol = columnNames[i].Name;
    }
    return { xCol: xCol, yCol: yCol, zCol: zCol }
}

// This function will be used for all 3 panels (Map, Graph and Gridview)
function radioAddPaneTypeClick(s, e) {
}

function radioAddPaneDirectionClick(s, e) {
}

var addNewPaneSender;
function addNewPane(s) {
    activateButton(s);
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

            //$('#divRightPanelPartial').empty().append.html(data); // another way

            //splitterMainResized();
            //$('#divRightPanelPartial').addClass('rightPanelPartial');
            //$("#divRightPanelPartial").load('Home');
            //$("#divRightPanelPartial").load('@Url.Content("Home/RightPanelPartial")');
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
        }
    });
}

//
// Popup property callback
// Being called from all the panels (pie, bar, map, gridview)
//
function showPropertyPopup(s) {
    activateButton(s);
    _activePropertyName = s.id; // Panel2Bar1_Property

    // Set y column for bar graph for use when property opens
    var yCol = '';
    var chart;

    // Bar & Line may have multiple yColumns
    if (_activePropertyName.toUpperCase().indexOf('BAR') > -1 || _activePropertyName.toUpperCase().indexOf('LINE') > -1) {
        var id = _activePropertyName.split('_')[0];
        if (id.toUpperCase().indexOf('BAR') > -1)
            chart = getBar(id);
        if (id.toUpperCase().indexOf('LINE') > -1)
            chart = getLine(id);
        yCol = chart.yCol;
    }

    callbackPopupPanelProperty.PerformCallback({
        'sender': s.id, 'yCol': yCol
    });
}

function callbackPopupPanelProperty_OnBeginCallback(s, e) {
    //popupPanelProperty.Show();
}

function callbackPopupPanelProperty_OnEndCallback(s, e) {
    var id = _activePropertyName.split('_')[0];
    if (id.toUpperCase().indexOf('PIE') > -1)
        renderPieProperty(id);
    if (id.toUpperCase().indexOf('BAR') > -1) 
        renderBarProperty(id)
    if (id.toUpperCase().indexOf('LINE') > -1)
        renderLineProperty(id)
    if (id.toUpperCase().indexOf('SCATTER') > -1)
        renderScatterProperty(id)
    if (id.toUpperCase().indexOf('MAP') > -1)
        renderMapProperty(id)
    if (id.toUpperCase().indexOf('GRIDVIEW') > -1)
        renderGridviewProperty(id)
}

function renderPieProperty(id) {
    var pie = getPie(id);
    if (pie.data == null)
        return;

    popupPanelProperty.Show();
    _activePie = pie;

    popupPanelProperty.SetHeaderText("Pie Property");
    if (_columnNames == undefined || _columnNames.length == 0) {
        console.log("_columnNames: null or empty.")
        return;
    }
    cbPieXColumn.ClearItems();
    cbPieYColumn.ClearItems();

    // Csv columns are always string. Had to add all the columns to X/Y dropdown
    var isCsv = false;
    if (_maps.length > 0) {
        if (_maps[0].type == 'CSV')
            isCsv = true;
    }
    _columnNames.forEach(function (c) {
        if (c.Type == 'String' || c.Type == 'DateTime' || c.Type == 'Date' || isCsv || c.Name == 'Seq')
            cbPieXColumn.AddItem(c.Name);
        if (c.Type == 'Int64' || c.Type == 'Double' || isCsv)
            cbPieYColumn.AddItem(c.Name);
    });

    var canvas = ramp(_colorScaleHSL);
    var div = document.getElementById('divColorRampPie');
    div.appendChild(canvas);

    document.getElementById(pie.divName + "_Title").innerHTML = pie.xCol + " vs " + pie.yCol;   // title in panel
    tbPropertyPieTitle.SetText(pie.xCol + " vs " + pie.yCol); // title in property

    chkPiePercentageLabel.SetChecked(pie.isPercentage);
    chkPieYValueLabel.SetChecked(pie.isYValue);
    chkPieXValueLabel.SetChecked(pie.isXValue);
    chkPieLabelClicked(null, null, pie.divName);

    cbPieXColumn.SetValue(pie.xCol);
    cbPieYColumn.SetValue(pie.yCol);
    radioColorRampPie.SetValue(pie.colorRamp);
    radioColorRampPieClicked();
}

function renderBarProperty(id) {
    var bar = getBar(id);
    if (bar.data == null)
        return;

    popupPanelProperty.Show();
    _activeBar = bar;

    popupPanelProperty.SetHeaderText("Bar Property");
    if (_columnNames == undefined || _columnNames.length == 0) {
        console.log("_columnNames: null or empty.")
        return;
    }
    cbBarXColumn.ClearItems();
    lbBarYColumn.ClearItems();

    // Csv columns are always string. Had to add all the columns to X/Y dropdown
    var isCsv = false;
    if (_maps.length > 0) {
        if (_maps[0].type == 'CSV')
            isCsv = true;
    }
    _columnNames.forEach(function (c) {
        if (c.Type == 'String' || c.Type == 'DateTime' || c.Type == 'Date' || isCsv || c.Name == 'Seq')
            cbBarXColumn.AddItem(c.Name);
        if (c.Type == 'Int64' || c.Type == 'Double' || isCsv)
            lbBarYColumn.AddItem(c.Name);
    });

    chkBarXValueLabel.SetChecked(bar.isXValue);
    chkBarYValueLabel.SetChecked(bar.isYValue);
    chkBarLabelClicked(null, null, bar.divName);
    
    cbBarXColumn.SetValue(bar.xCol);
    var items = bar.yCol.split(';');
    lbBarYColumn.SelectValues(items);

    var selectedItems = lbBarYColumn.GetSelectedItems();
    ddBarYColumn.SetText(getSelectedItemsText(selectedItems));

    document.getElementById(bar.divName + "_Title").innerHTML = bar.xCol + " vs " + bar.yCol;
    tbPropertyBarTitle.SetText(bar.xCol + " vs " + bar.yCol); // title in property

    radioOrientationBar.SetValue(bar.isVertical);
    document.getElementById('divBarColorPickerText').innerHTML = selectedItems[0].text;
    ceBarColorPicker0.SetColor(bar.color[0]); // To do AndyLee
}

function renderLineProperty(id) {
    var line = getLine(id);
    if (line.data == null)
        return;

    popupPanelProperty.Show();
    _activeLine = line;

    popupPanelProperty.SetHeaderText("Line Property");
    if (_columnNames == undefined || _columnNames.length == 0) {
        console.log("_columnNames: null or empty.")
        return;
    }

    cbLineXColumn.ClearItems();
    lbLineYColumn.ClearItems();

    // Csv columns are always string. Had to add all the columns to X/Y dropdown
    var isCsv = false;
    if (_maps.length > 0) {
        if (_maps[0].type == 'CSV')
            isCsv = true;
    }
    _columnNames.forEach(function (c) {
        if (c.Type == 'String' || c.Type == 'DateTime' || c.Type == 'Date' || isCsv || c.Name == 'Seq')
            cbLineXColumn.AddItem(c.Name);
        if (c.Type == 'Int64' || c.Type == 'Double' || isCsv)
            lbLineYColumn.AddItem(c.Name);
    });

    chkLineXValueLabel.SetChecked(line.isXValue);
    chkLineYValueLabel.SetChecked(line.isYValue);
    chkLineLabelClicked(null, null, line.divName);

    cbLineXColumn.SetValue(line.xCol);
    var items = line.yCol.split(';');
    lbLineYColumn.SelectValues(items);

    var selectedItems = lbLineYColumn.GetSelectedItems();
    ddLineYColumn.SetText(getSelectedItemsText(selectedItems));

    document.getElementById(line.divName + "_Title").innerHTML = line.xCol + " vs " + line.yCol;
    tbPropertyLineTitle.SetText(line.xCol + " vs " + line.yCol); // title in property

    document.getElementById('divLineColorPickerText').innerHTML = selectedItems[0].text;
    ceLineColorPicker0.SetColor(line.color[0]); 
}

function renderScatterProperty(id) {
    var scatter = getScatter(id);
    if (scatter.data == null)
        return;

    popupPanelProperty.Show();
    _activeScatter = scatter;

    popupPanelProperty.SetHeaderText("Scatter Property");
    if (_columnNames == undefined || _columnNames.length == 0) {
        //console.log("_columnNames: null or empty.")
        return;
    }

    cbScatterXColumn.ClearItems();
    cbScatterYColumn.ClearItems();
    cbScatterZColumn.ClearItems();

    // Csv columns are always string. Had to add all the columns to X/Y dropdown
    var isCsv = false;
    if (_maps.length > 0) {
        if (_maps[0].type == 'CSV')
            isCsv = true;
    }
    _columnNames.forEach(function (c) {
        if (c.Type == 'Int64' || c.Type == 'Double' || isCsv)
            cbScatterXColumn.AddItem(c.Name);
        if (c.Type == 'Int64' || c.Type == 'Double' || isCsv)
            cbScatterYColumn.AddItem(c.Name);
        if (c.Type == 'String' || c.Type == 'DateTime' || c.Type == 'Date' || isCsv || c.Name == 'Seq')
            cbScatterZColumn.AddItem(c.Name);
    });

    chkScatterXValueLabel.SetChecked(scatter.isXValue);
    chkScatterYValueLabel.SetChecked(scatter.isYValue);
    chkScatterZValueLabel.SetChecked(scatter.isZValue);
    chkScatterLabelClicked(null, null, scatter.divName);

    cbScatterXColumn.SetValue(scatter.xCol);
    cbScatterYColumn.SetValue(scatter.yCol);
    cbScatterZColumn.SetValue(scatter.zCol);

    document.getElementById(scatter.divName + "_Title").innerHTML = scatter.xCol + " vs " + scatter.yCol;
    tbPropertyScatterTitle.SetText(scatter.xCol + " vs " + scatter.yCol); // title in property

    //document.getElementById('divLineColorPickerText').innerHTML = selectedItems[0].text;
    //ceLineColorPicker0.SetColor(line.color[0]); 
}

function renderMapProperty(id) {
    var map = getMap(id);
    if (map.data == null)
        return;

    popupPanelProperty.Show();
    _activeMap = map;

    popupPanelProperty.SetHeaderText("Map Property");
    chkShowCoordinates.SetChecked(map.isCoordinatesOn);
    chkShowLabel.SetChecked(map.isLabelOn);
    cbShowLabel.SetEnabled(map.isLabelOn);
    tbMapGoToX.SetText(map.x);
    tbMapGoToY.SetText(map.y);
    radioMapGoTo.SetValue(map.goToLocation);
    if (map.goToLocation == 1) {    // Lon/Lat
        $("#thAtsHeader").hide();
        $('#trGoToAts').hide();
        $("#trGoToLatLonX").show();
        $("#trGoToLatLonY").show();
    }
    else {                          // ATS
        $("#thAtsHeader").show();
        $('#trGoToAts').show();
        $("#trGoToLatLonX").hide();
        $("#trGoToLatLonY").hide();
    }
    cbGoToAtsSec.SetValue(map.sec);
    cbGoToAtsTwp.SetValue(map.twp);
    cbGoToAtsRge.SetValue(map.rge);
    cbGoToAtsMer.SetValue(map.mer);
    cbBasemap.SetValue(map.basemap);

    // XY columns
    if (_columnNames == undefined || _columnNames.length == 0) {
        console.log("_columnNames: null or empty.")
        return;
    }
    cbShowLabel.ClearItems();
    cbMapXColumn.ClearItems();
    cbMapYColumn.ClearItems();

    _columnNames.forEach(function (c) {
        cbShowLabel.AddItem(c.Name);
        if ((c.Type == 'Int64' || c.Type == 'Double') || map.type == 'CSV') {   // Todo: CSV columns returns as string always
            cbMapXColumn.AddItem(c.Name);
            cbMapYColumn.AddItem(c.Name);
        }
    });

    // Enable/disable XY column in property dialog
    if (map.type == 'SHP') {
        cbMapXColumn.SetEnabled(false);
        cbMapYColumn.SetEnabled(false);
    }
    else {
        cbMapXColumn.SetEnabled(true);
        cbMapYColumn.SetEnabled(true);
    }

    cbShowLabel.SetSelectedIndex(0);
    cbMapXColumn.SetValue(map.xCol);
    cbMapYColumn.SetValue(map.yCol);

    tbPropertyMapTitle.SetText(map.xCol + " vs " + map.yCol); // title in property
}

function renderGridviewProperty(id) {
    var gv = getGridview(id);
    //if (gv.data == null) // To do Jae -- no data
    //    return;

    popupPanelProperty.Show();
    _activeGridview = gv;

    popupPanelProperty.SetHeaderText("Grid Property");
}

// add red border on property tool
function activateButton(s) {
    var prevProp = _activePropertyName;
    $("#" + prevProp).removeClass("btnPropertyBorder");
    $("#" + s.id).addClass("btnPropertyBorder")
}

function deactivateButton(s) {
    $("#" + prevProp).removeClass("btnPropertyBorder");
}

function divPanelClicked(s) {
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
