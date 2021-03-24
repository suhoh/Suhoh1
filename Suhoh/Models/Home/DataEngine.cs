using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Suhoh.Model
{
    public class DataEngine
    {
        public static IEnumerable GetXColumn()
        {
            List<string> XColumn = new List<string>();
            XColumn.Add("Applicant");
            XColumn.Add("Project");
            XColumn.Add("Source");
            XColumn.Add("Specific Purpose");
            XColumn.Add("Licence Type");

            return XColumn;
        }

        public static IEnumerable GetYColumn()
        {
            List<string> YColumn = new List<string>();
            YColumn.Add("Quantity_m3");
            YColumn.Add("Consumptive Use_M3");

            return YColumn;
        }

        public static IEnumerable BasemapList()
        {
            List<string> basemapList = new List<string>();
            basemapList.Add("Streets");
            basemapList.Add("Topographic");
            basemapList.Add("Imagery");
            basemapList.Add("Natl. Geographic");
            basemapList.Add("Shaded Relief");

            return basemapList;
        }
    }
}