using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Suhoh.Model
{
    public class ViewModel
    {
        // Panels
        public int ActivePanelSettings { get; set; }    // 3 panels
        public int MainPanelCount { get; set; }         // initial number of panels to start with
        public string MainPanelJson { get; set; }
        public List<Panel> MainPanels { get; set; }
        // Add new pane
        public string AddPaneSender { get; set; }
        public int AddPaneType { get; set; }            // 1: Horizontal, 2: Vertical
        public int AddPaneDirection { get; set; }       // 1: Graph, 2: Map: 3: Gridview

        // Gridview
        public DataTable DxGridview { get; set; }

        // Graph Pie
        public string D3GraphTitleProperty { get; set; }
        public bool ChkPercentageLabel { get; set; }
        public bool ChkYValueLabel { get; set; }
        public bool ChkXValueLabel { get; set; }
        public string DdXColumn { get; set; }
        public string DdYColumn { get; set; }
        public int ColorRampPie { get; set; }

        // Graph Bar
        public string D3BarTitleProperty { get; set; }

        // OpenLayers
        public string OpenLayerTitleProperty { get; set; }
        public string GoToLocationX { get; set; }
        public string GoToLocationY { get; set; }
        public bool ChkShowCoordinates { get; set; }
        public bool ChkShowLabel { get; set; }
        public string ActiveBasemap { get; set; }

        // Left Pane Search 
        public string cbLeftPanelSearchSEC { get; set; }
        public string cbLeftPanelSearchTWP { get; set; }
        public string cbLeftPanelSearchRGE { get; set; }
        public string cbLeftPanelSearchMER { get; set; }

        public ViewModel()
        {
            ChkPercentageLabel = false;
            ChkYValueLabel = false;
            ChkXValueLabel = false;
            DdXColumn = "";
            DdYColumn = "";
            ColorRampPie = 1;

            GoToLocationX = "-114.066666";
            GoToLocationY = "51.049999";
            ChkShowCoordinates = false;
            ChkShowLabel = false;
            ActiveBasemap = "Streets";

            AddPaneDirection = 1;
            AddPaneType = 1;

            cbLeftPanelSearchSEC = "";
            cbLeftPanelSearchTWP = "";
            cbLeftPanelSearchRGE = "";
            cbLeftPanelSearchMER = "";

            ActivePanelSettings = 3;
            MainPanelCount = 3;
            MainPanelJson = @"[{'name': 'Panel1', 'type': ['Map']}, {'name': 'Panel2', 'type': ['Graph']}, {'name': 'Panel3', 'type': ['Gridview']}]";
        }
    }

    public class Panel
    {
        public string Name { get; set; }
        public IList<string> Type { get; set; }     // Graph, Map: Gridview
    }

    public enum PaneType
    {
        Map,
        Graph,
        Gridview
    }
}