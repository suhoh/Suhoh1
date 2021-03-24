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
        public DataTable DxGridview { get; set; }

        // Graph
        public string D3GraphTitleProperty { get; set; }
        public bool ChkPercentageLabel { get; set; }
        public bool ChkYValueLabel { get; set; }
        public bool ChkXValueLabel { get; set; }
        public string DdXColumn { get; set; }
        public string DdYColumn { get; set; }

        // OpenLayers
        public string OpenLayerTitleProperty { get; set; }
        public string GoToLocationX { get; set; }
        public string GoToLocationY { get; set; }
        public bool ChkShowCoordinates { get; set; }
        public bool ChkShowLabel { get; set; }
        public string ActiveBasemap { get; set; }

        // Add new pane
        public string AddPaneSender { get; set; }
        public int AddPaneType { get; set; }            // 1: Horizontal, 2: Vertical
        public int AddPaneDirection { get; set; }       // 1: Graph, 2: Map: 3: Gridview

        // Left Pane Search 
        public string cbLeftPanelSearchSEC { get; set; }
        public string cbLeftPanelSearchTWP { get; set; }
        public string cbLeftPanelSearchRGE { get; set; }
        public string cbLeftPanelSearchMER { get; set; }

        public ViewModel()
        {
            D3GraphTitleProperty = "Title";
            ChkPercentageLabel = false;
            ChkYValueLabel = false;
            ChkXValueLabel = false;
            DdXColumn = "";
            DdYColumn = "";

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
        }

    }

}