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
        public static IEnumerable GetPaneType()
        {
            List<string> dropdownList = new List<string>();
            dropdownList.Add("Pie");
            dropdownList.Add("Bar");
            dropdownList.Add("Line");
            dropdownList.Add("Scatter");
            dropdownList.Add("Map");
            dropdownList.Add("Gridview");
            return dropdownList;
        }
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

        public static IEnumerable SectionList()
        {
            List<string> sectionList = new List<string>();
            for (int i = 1; i <= 36; i++)
            {
                sectionList.Add(i.ToString());
            }                               
            return sectionList;
        }

        public static IEnumerable TownshipList()
        {
            List<string> townshipList = new List<string>();
            for (int i = 1; i <= 126; i++)
            {
                townshipList.Add(i.ToString());
            }
            return townshipList;
        }

        public static IEnumerable RangeList()
        {
            List<string> rangeList = new List<string>();
            for (int i = 1; i <= 30; i++)
            {
                rangeList.Add(i.ToString());
            }
            return rangeList;
        }
    }
}