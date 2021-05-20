
// 
// Left panel scripts
//

var _activePanelSettings;

function radioActivePanelSettingsClicked(s, e) {
    SetAllPanelSettings(false);
    var panel = radioActivePanelSettings.GetValue();
    if (panel == 1) {
        $('#cb1PanelType').show();
    }
    if (panel == 2) {
        $('#cb2_1PanelType').show();
        $('#cb2_2PanelType').show();
    }
    if (panel == 3) {
        $('#cb3_1PanelType').show();
        $('#cb3_2PanelType').show();
        $('#cb3_3PanelType').show();
    }
    if (panel == 4) {
        $('#cb4_1PanelType').show();
        $('#cb4_2PanelType').show();
        $('#cb4_3PanelType').show();
        $('#cb4_4PanelType').show();
    }
}

function SetAllPanelSettings(flag) {
    $('#cb1PanelType').hide();
    $('#cb2_1PanelType').hide();
    $('#cb2_2PanelType').hide();
    $('#cb3_1PanelType').hide();
    $('#cb3_2PanelType').hide();
    $('#cb3_3PanelType').hide();
    $('#cb4_1PanelType').hide();
    $('#cb4_2PanelType').hide();
    $('#cb4_3PanelType').hide();
    $('#cb4_4PanelType').hide();
}

//"[{'name': 'Panel1', 'type': ['Map1']}, {'name': 'Panel2', 'type': ['Graph1']}, {'name': 'Panel3', 'type': ['Gridview1']}]"
function btnChangeLayoutClicked(s, e) {
    loadingPanel.Hide();
    popupPanelProperty.Hide();
    var nPanel = radioActivePanelSettings.GetValue();
    var panels = [];
    if (nPanel == 1) {
        var type = cb1PanelType.GetText();
        panels.push("{'name':'Panel1', 'type':['" + type + "1']}");
    }
    if (nPanel == 2) {
        var type = cb2_1PanelType.GetText();
        panels.push("{'name':'Panel1', 'type':['" + type + "1']}");
        type = cb2_2PanelType.GetText();
        panels.push("{'name':'Panel2', 'type':['" + type + "1']}");
    }
    if (nPanel == 3) {
        var type = cb3_1PanelType.GetText();
        panels.push("{'name':'Panel1', 'type':['" + type + "1']}");
        type = cb3_2PanelType.GetText();
        panels.push("{'name':'Panel2', 'type':['" + type + "1']}");
        type = cb3_3PanelType.GetText();
        panels.push("{'name':'Panel3', 'type':['" + type + "1']}");
    }
    if (nPanel == 4) {
        var type = cb4_1PanelType.GetText();
        panels.push("{'name':'Panel1', 'type':['" + type + "1']}");
        type = cb4_2PanelType.GetText();
        panels.push("{'name':'Panel2', 'type':['" + type + "1']}");
        type = cb4_3PanelType.GetText();
        panels.push("{'name':'Panel3', 'type':['" + type + "1']}");
        type = cb4_4PanelType.GetText();
        panels.push("{'name':'Panel4', 'type':['" + type + "1']}");
    }

    clearAllPanels();   // clears arrays

    var url = "Home/RightPanelPartial";
    $.ajax({
        type: "POST",
        url: url,
        //dataType: "json",
        data: { 'sender': 'leftPanel', 'paneDir': -1, 'paneType': -1, 'jsonPanels': JSON.stringify(panels) },
        success: function (data) {
            $('#divRightPanelPartial').html(data);
            //splitterMainResized();
            //$('#divRightPanelPartial').addClass('rightPanelPartial');
            //$("#divRightPanelPartial").load('Home');
            //$("#divRightPanelPartial").load('@Url.Content("Home/RightPanelPartial")');

            convertJsonToDataTable(_jsonData, _jsonDataGridview);
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('Request Status: ' + xhr.status + '; Status Text: ' + textStatus + '; Error: ' + errorThrown);
        }
    });

}

//
// Left Panel Search by ATS and attributes
//
function populateLeftPanelSearchColumn(items) {
    // Fill in operand1
    cbLeftPanelAttributeSearch1.ClearItems();
    for (i = 0; i < items.length; i++) {
        cbLeftPanelAttributeSearch1.AddItem(items[i].Name);
    }
    if (items.length > 0)
        cbLeftPanelAttributeSearch1.SetSelectedIndex(0);    // set first item as selected

    // Fill in operand3
    cbLeftPanelAttributeSearch3.ClearItems();
    var column = cbLeftPanelAttributeSearch1.GetText();
    var type = getColumnInfo(items, column).Type;
    if (type == 'String') {
        var distinctValues = getDistinctValues(_jsonData, column);
        distinctValues.sort();
        distinctValues.forEach(function (v) {
            cbLeftPanelAttributeSearch3.AddItem(v);
        });
        cbLeftPanelAttributeSearch3.SetSelectedIndex(0);
    }
}

function getColumnInfo(items, columnName) {
    for (i = 0; i < items.length; i++)
        if (items[i].Name == columnName)
            return items[i];
    return null;
}

function getDistinctValues(jsonData, column) {
    var lookup = {};
    var items = jsonData;
    var result = [];

    for (var item, i = 0; item = items[i++];) {
        var name = item[column];

        if (!(name in lookup)) {
            lookup[name] = 1;
            result.push(name);
        }
    }
    return result;
}

function cbLeftPanelAttributeSearch1Changed(s, e) {
    var column = cbLeftPanelAttributeSearch1.GetText();
    cbLeftPanelAttributeSearch3.ClearItems();
    var distinctValues = getDistinctValues(_jsonData, column);
    distinctValues.sort();
    distinctValues.forEach(function (v) {
        cbLeftPanelAttributeSearch3.AddItem(v);
    });
    cbLeftPanelAttributeSearch3.SetSelectedIndex(0);
}

function cbLeftPanelAttributeSearch2Changed(s, e) {

}

function cbLeftPanelAttributeSearch3Changed(s, e) {

}

function btnLeftPanelAttributeSearchClick(s, e) {

}
