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

        // Add new pane
        public string AddPaneSender { get; set; }
        public int AddPaneType { get; set; }            // 1: Horizontal, 2: Vertical
        public int AddPaneDirection { get; set; }       // 1: Graph, 2: Map: 3: Gridview

        public ViewModel()
        {
            D3GraphTitleProperty = "Applicant vs Quantity_m3";
            ChkPercentageLabel = false;
            ChkYValueLabel = false;
            ChkXValueLabel = false;
            DdXColumn = "";
            DdYColumn = "";

            AddPaneDirection = 1;
            AddPaneType = 1;
        }

    }

}