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
        public string MyId { get; set; }
        public DataTable DxGridview { get; set; }

        public ViewModel()
        {
            MyId = "Hello world";
        }
    }

    public class KeyValue
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }

    // Test Gridview
    public class GridViewList
    {
        public string WellId { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        public double Top { get; set; }
        public double Base { get; set; }
        public double Depth { get; set; }
        public string TestType { get; set; }
    }
}