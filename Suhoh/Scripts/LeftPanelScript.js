
// 
// Left panel scripts
//

var _activePanelSettings;
var _testEmail = "suhohconsultingltd@gmail.com";

function navBarMainChanged(s, e) {
    var gExpand = s.groupsExpanding;
}

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
        panels.push({ 'name': 'Panel1', 'type': [type + '1'] });
    }
    if (nPanel == 2) {
        var type = cb2_1PanelType.GetText();
        panels.push({ 'name': 'Panel1', 'type': [type + '1'] });
        type = cb2_2PanelType.GetText();
        panels.push({ 'name': 'Panel2', 'type': [type + '1'] });
    }
    if (nPanel == 3) {
        var type = cb3_1PanelType.GetText();
        panels.push({'name':'Panel1', 'type':[type + '1']});
        type = cb3_2PanelType.GetText();
        panels.push({ 'name': 'Panel2', 'type': [type + '1'] });
        type = cb3_3PanelType.GetText();
        panels.push({ 'name': 'Panel3', 'type': [type + '1'] });
    }
    if (nPanel == 4) {
        var type = cb4_1PanelType.GetText();
        panels.push({ 'name': 'Panel1', 'type': [type + '1'] });
        type = cb4_2PanelType.GetText();
        panels.push({ 'name': 'Panel2', 'type': [type + '1'] });
        type = cb4_3PanelType.GetText();
        panels.push({ 'name': 'Panel3', 'type': [type + '1'] });
        type = cb4_4PanelType.GetText();
        panels.push({ 'name': 'Panel4', 'type': [type + '1'] });
    }

    clearAllPanels();   // clears arrays

    // Push gridview panel info
    panels.forEach(function (p) {
        p.type.forEach(function (t) {
            if (t.toUpperCase().indexOf('GRIDVIEW') > -1)
                initGridview(p.name + t);   // Moved out of DxGridview.cshtml under <Script> section due to callback issue
                                            // When callback, DxGridview gets refresh and no code should be included
        })
    });

    // Could use PerformCallback
    var url = "Home/RightPanelPartial";
    $.ajax({
        type: "POST",
        url: url,
        //dataType: "json",
        data: { 'sender': 'leftPanel', 'paneDir': -1, 'paneType': -1, 'jsonPanels': JSON.stringify(panels), 'isNewLayout': true },
        success: function (data) {
            $('#divRightPanelPartial').html(data);

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

function getItemTextIndex(cb, item) {
    for (var i = 0; i < cb.GetItemCount(); i++) {
        if (cb.GetItem(i).text == item)
            return i;
    }
    return null;
}

function replaceItemText(cb, from, to) {
    var idx = getItemTextIndex(cbLeftPanelAttributeSearch2, from);
    if (idx != null) {
        cbLeftPanelAttributeSearch2.RemoveItem(idx);
        cbLeftPanelAttributeSearch2.AddItem(to);
    }
}

function cbLeftPanelAttributeSearch1Changed(s, e) {
    var column = cbLeftPanelAttributeSearch1.GetText();
    var type = getColumnInfo(_columnNames, column).Type;
    if (type == "Int64" || type == "Double")    // change Like dropdown2 to Between and vice versa
        replaceItemText(cbLeftPanelAttributeSearch2, 'Like', 'Between');
    else 
        replaceItemText(cbLeftPanelAttributeSearch2, 'Between', 'Like');

    cbLeftPanelAttributeSearch3.ClearItems();
    var distinctValues = getDistinctValues(_jsonData, column);
    distinctValues.sort();
    distinctValues.forEach(function (v) {
        cbLeftPanelAttributeSearch3.AddItem(v.toString());
    });
    cbLeftPanelAttributeSearch3.SetSelectedIndex(0);
}

function cbLeftPanelAttributeSearch2Changed(s, e) {

}

function cbLeftPanelAttributeSearch3Changed(s, e) {

}

function btnLeftPanelAttributeSearchClick(s, e) {

}

//
// Load My Project
//
function radioLeftPanelSaveLoadClick(s, e) {
    var radioSelected = radioLeftPanelSaveLoad.GetValue();

    if (radioSelected == 1) {   // Save
        $("#divLeftPanelSaveProject").show();
        $("#divLeftPanelLoadProject").hide();
    }
    else {                      // Load
        $("#divLeftPanelSaveProject").hide();
        $("#divLeftPanelLoadProject").show();
        if (!_isSaveProject)
            gvLeftPanelProjects.Refresh();
    }
}

// Save project
var _isSaveProject = false;
function btnLeftPanelSaveProjectNameClick(s, e) {
    var pName = tbLeftPanelSaveProjectName.GetText();
    if (pName.length == 0) {
        showMessage("Enter project name and click 'Save'.", "Message");
        return;
    }
    var url = "Home/GetProjectCount";
    $.ajax({
        type: "POST",
        url: url,
        data: { 'projectName': pName },
        dataType: "json",
        success: successFunc,
        error: errorFunc
    });

    function successFunc(data, status) {
        if (data > 0) {
            showMessage("Project name already exist.", "Message");
            return;
        }
        else {
            url = "Home/SaveProject"
            $.ajax({
                type: "POST",
                url: url,
                data: { 'projectName': pName },
                dataType: "json",
                success: successFunc2,
                error: errorFunc2
            });

            function successFunc2(data, status) {
                _isSaveProject = true;
                radioLeftPanelSaveLoad.SetValue(2); // switch to save GUI
                radioLeftPanelSaveLoadClick();
                refreshProjectList(_testEmail);
            }

            function errorFunc2(data, status) {

            }

        }
    }

    function errorFunc(data, status) {

    }
}

// Delete project
function btnConfirmOkCancel(s, e) {
    var isDelete = false;
    if (s.name == 'btnConfirmCancel') {
        pcConfirmModalDialog.Hide();
        return;
    }

    var projectName = gvLeftPanelProjects.GetRowKey(gvLeftPanelProjects.GetFocusedRowIndex());
    if (projectName == undefined) {
        showMessage("Select project to delete.", "Warning");
        return;
    }

    var url = "Home/DeleteProject"
    $.ajax({
        type: "POST",
        url: url,
        data: { 'projectName': projectName },
        dataType: "json",
        success: successFunc,
        error: errorFunc
    });
    function successFunc(data, status) {
        refreshProjectList(_testEmail);
        pcConfirmModalDialog.Hide();

    }
    function errorFunc(data, status) {
        pcConfirmModalDialog.Hide();
    }

}

function btnLeftPanelDeleteProjectNameClick(s, e) {
    var projectName = gvLeftPanelProjects.GetRowKey(gvLeftPanelProjects.GetFocusedRowIndex());
    if (projectName == undefined) {
        showMessage("Select project to delete.", "Warning");
        return;
    }
    confirmMessage.SetText("Are you sure you want to delete '" + projectName + "' project?");
    pcConfirmModalDialog.Show();
}


// Get project list from database
// Stores list to ViewModel.Projects
// Refreshes gridview
function refreshProjectList(email) {
    var url = "Home/RefreshProjectList"
    $.ajax({
        type: "POST",
        url: url,
        data: { 'email': email },
        dataType: "json",
        success: successFunc,
        error: errorFunc
    });
    function successFunc(data, status) {
        gvLeftPanelProjects.PerformCallback();
    }

    function errorFunc(data, status) {
    }
}

// Load project
function btnLeftPanelLoadProjectNameClick(s, e) {
    gvLeftPanelProjects.PerformCallback();
}

function gvLeftPanelProjectsFocusedRowChanged(s, e) {
    var projectName = s.GetRowKey(s.GetFocusedRowIndex());
}

function gvLeftPanelProjectsSelectionChanged(s, e) {
    s.GetSelectedFieldValues("ProjectName", function (values) {
        var pName = values.join(',');
    });
}

function gvLeftPanelProjects_OnBeginCallback(s, e) {
}

function gvLeftPanelProjects_OnEndCallback(s, e) {
    if (_isSaveProject) {
        _isSaveProject = false;
        // Make last added project name focused.
        gvLeftPanelProjects.MakeRowVisible(gvLeftPanelProjects.pageRowCount - 1);
        gvLeftPanelProjects.SetFocusedRowIndex(gvLeftPanelProjects.pageRowCount - 1);
    }
}
