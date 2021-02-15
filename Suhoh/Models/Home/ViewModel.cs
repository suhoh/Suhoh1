using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Suhoh.Model
{
    public class ViewModel
    {
        public string MyId { get; set; }
        public IEnumerable DxGridview;



        public ViewModel()
        {
            MyId = "Hello world";
        }
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