
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

function btnChangeLayoutClicked(s, e) {

}