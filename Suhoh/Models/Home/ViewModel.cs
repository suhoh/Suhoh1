using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Xml.Serialization;

namespace Suhoh.Model
{
    public class ViewModel
    {
        public const string _gridTable = "GRID";
        public const string _projectTable = "Projects";

        // Application Config
        public AppConfig AppConfig { get; set; }

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
        public string PieTitle { get; set; }
        public bool ChkPercentageLabel { get; set; }
        public bool ChkYValueLabel { get; set; }
        public bool ChkXValueLabel { get; set; }
        public string DdXColumn { get; set; }
        public string DdYColumn { get; set; }
        public int RadioColorRampPie { get; set; }

        // Bar Chart Property
        public string BarTitle { get; set; }
        public bool CbBarYValueLabel { get; set; }
        public bool CbBarXValueLabel { get; set; }
        public string DdBarXColumn { get; set; }
        public int RadioOrientationBar { get; set; }
        public string BarYColNames { get; set; }
        public string[] BarColors { get; set; }

        // Line Chart Property
        public string LineTitle { get; set; }
        public bool CbLineXValueLabel { get; set; }
        public bool CbLineYValueLabel { get; set; }
        public string DdLineXColumn { get; set; }
        public int RadioLineShape { get; set; }
        public string LineYColNames { get; set; }
        public string[] LineColors { get; set; }

        // OpenLayers
        public string MapTitle { get; set; }
        public bool ChkShowCoordinates { get; set; }
        public bool ChkShowLabel { get; set; }
        public string ActiveBasemap { get; set; }

        // Gridview
        public string GridviewTitle { get; set; }
        public string GridviewPageSize { get; set; }
        public bool IsHeaderFilter { get; set; }
        public bool IsGrouping { get; set; }
        public string FilterExpression { get; set; }
        public string GridviewKeys { get; set; }

        // Left Pane Search 
        public bool ChkLeftPanelATS { get; set; }
        public string LeftPanelSearchSEC { get; set; }
        public string LeftPanelSearchTWP { get; set; }
        public string LeftPanelSearchRGE { get; set; }
        public string LeftPanelSearchMER { get; set; }
        public bool ChkLeftPanelAttributeSearch { get; set; }
        public string CbLeftPanelAttributeOperator { get; set; }

        // Left panel load project
        public int RadioLeftPanelSaveLoad { get; set; }

        public IEnumerable Projects;
        

        public ViewModel()
        {
            ColumnInfos = new List<ColumnInfo>();

            // Pie Chart Property
            ChkPercentageLabel = false;
            ChkYValueLabel = false;
            ChkXValueLabel = false;
            DdXColumn = "";
            DdYColumn = "";
            RadioColorRampPie = 1;

            // Bar Chart Property
            CbBarYValueLabel = false;
            CbBarXValueLabel = false;
            DdBarXColumn = "";
            RadioOrientationBar = 1;
            BarYColNames = string.Empty;
            BarColors = new string[] { "#e41a1c" }; // initial bar color

            // Line Chart Property
            CbLineXValueLabel = false;
            CbLineYValueLabel = false;
            DdLineXColumn = "";
            RadioLineShape = 1;
            LineYColNames = string.Empty;
            LineColors = new string[] { "#e41a1c" }; // initial line color

            // Map
            MapTitle = "Map Title";
            ChkShowCoordinates = true;
            ChkShowLabel = false;
            ActiveBasemap = "Streets";

            // Gridview
            GridviewTitle = "Grid Title";
            GridviewPageSize = "50";
            IsHeaderFilter = IsGrouping = false;
            FilterExpression = string.Empty;
            GridviewKeys = string.Empty;

            AddPaneDirection = 1;
            AddPaneType = 1;

            ChkLeftPanelATS = false;
            LeftPanelSearchSEC = "15";
            LeftPanelSearchTWP = "24";
            LeftPanelSearchRGE = "1";
            LeftPanelSearchMER = "5";
            ChkLeftPanelAttributeSearch = true;
            CbLeftPanelAttributeOperator = "=";

            RadioLeftPanelSaveLoad = 1;

            ActiveProperty = string.Empty;
            ActivePanelSettings = 3;
            MainPanelCount = 3;
            MainPanelJson = @"[{'name': 'Panel1', 'type': ['Line1']}, {'name': 'Panel2', 'type': ['Bar1']}, {'name': 'Panel3', 'type': ['Gridview1']}]";
        }
    }

    // XML AppConfig setting
    [Serializable]
    [XmlRoot("AppConfig")]
    public class AppConfig
    {
        [XmlElement(ElementName = "ActiveDatabase")]
        public string ActiveDatabase { get; set; }

        // Database Schema
        [XmlArray(ElementName = "SchemaNames")]
        [XmlArrayItem(typeof(SchemaName), ElementName = "SchemaName")]
        public SchemaName[] Schemas { get; set; }

        // Data sources
        [XmlArray(ElementName = "DataSources")]
        [XmlArrayItem(typeof(DataSourceInfo), ElementName = "DataSource")]
        public DataSourceInfo[] DataSources { get; set; }

        [XmlElement(ElementName = "ExcelFilePath")]
        public string ExcelFilePath { get; set; }

        [XmlElement(ElementName = "PageSizes")]
        public string PageSizes { get; set; }
    }

    public class SchemaName
    {
        [XmlAttribute(AttributeName = "id")]
        public string Id { get; set; }
        [XmlAttribute(AttributeName = "username")]
        public string Username { get; set; }
        [XmlAttribute(AttributeName = "password")]
        public string Password { get; set; }
        [XmlAttribute(AttributeName = "name")]
        public string Name { get; set; }
    }

    public class DataSourceInfo
    {
        [XmlAttribute(AttributeName = "id")]
        public string Id { get; set; }
        [XmlAttribute(AttributeName = "description")]
        public string Description { get; set; }
        [XmlAttribute(AttributeName = "type")]
        public string Type { get; set; }
        [XmlAttribute(AttributeName = "database")]
        public string Database { get; set; }
        [XmlAttribute(AttributeName = "active")]
        public bool Active { get; set; }
        [XmlAttribute(AttributeName = "subscribed")]
        public bool Subscribed { get; set; }
        [XmlAttribute(AttributeName = "show")]
        public bool Show { get; set; }
    }

    public class Project
    {
        public string Email { get; set; }
        public string ProjectName { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string Flag { get; set; }
    }

    public class XY
    {
        public double X { get; set; }
        public double Y { get; set; }
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
        Pie,
        Bar,
        Line,
        Scatter,
        Map,
        Gridview
    }
}