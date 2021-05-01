﻿using System;
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
        public int ActivePanelSettings { get; set; }    // # of panel setting count
        public int MainPanelCount { get; set; }         // initial number of panels to start with
        public string MainPanelJson { get; set; }
        public string CreatePanelName { get; set; }     // used when creating panel - Panel1Map1, Panel1Pie1...
        public List<Panel> MainPanels { get; set; }
        public string ActiveProperty { get; set; }      // active property clicked from panel

        // Add new pane
        public string AddPaneSender { get; set; }
        public int AddPaneType { get; set; }            // 1: Horizontal, 2: Vertical
        public int AddPaneDirection { get; set; }       // 1: Graph, 2: Map: 3: Gridview

        // Gridview
        public DataTable DxGridview { get; set; }
        public List<ColumnInfo> ColumnInfos { get; set; }   // column name and type

        // Pie Chart Property
        public string D3GraphTitleProperty { get; set; }
        public bool ChkPercentageLabel { get; set; }
        public bool ChkYValueLabel { get; set; }
        public bool ChkXValueLabel { get; set; }
        public string DdXColumn { get; set; }
        public string DdYColumn { get; set; }
        public int ColorRampPie { get; set; }

        // Bar Chart Property
        public string TbBarTitleProperty { get; set; }
        public bool CbBarYValueLabel { get; set; }
        public bool CbBarXValueLabel { get; set; }
        public string DdBarYColumn { get; set; }
        public bool CbBarTranspose { get; set; }

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
            ColumnInfos = new List<ColumnInfo>();

            // Pie Chart Property
            ChkPercentageLabel = false;
            ChkYValueLabel = false;
            ChkXValueLabel = false;
            DdXColumn = "";
            DdYColumn = "";
            ColorRampPie = 1;

            // Bar Chart Property
            CbBarYValueLabel = false;
            CbBarXValueLabel = false;
            DdBarYColumn = "";
            CbBarTranspose = false;

            // Map
            OpenLayerTitleProperty = "Map Title";
            GoToLocationX = "-114.066666";
            GoToLocationY = "51.049999";
            ChkShowCoordinates = true;
            ChkShowLabel = false;
            ActiveBasemap = "Streets";

            AddPaneDirection = 1;
            AddPaneType = 1;

            cbLeftPanelSearchSEC = "";
            cbLeftPanelSearchTWP = "";
            cbLeftPanelSearchRGE = "";
            cbLeftPanelSearchMER = "";

            ActiveProperty = string.Empty;
            ActivePanelSettings = 3;
            MainPanelCount = 3;
            MainPanelJson = @"[{'name': 'Panel1', 'type': ['Map1']}, {'name': 'Panel2', 'type': ['Bar1']}, {'name': 'Panel3', 'type': ['Gridview1']}]";
        }
    }

    public class ColumnInfo
    {
        public string Name { get; set; }
        public string Type { get; set; }
    }

    public class Panel
    {
        public string Name { get; set; }
        public IList<string> Type { get; set; }     // Graph, Map: Gridview
    }

    public enum PaneType
    {
        Map = 1,
        Graph = 2,
        Gridview = 3
    }
}