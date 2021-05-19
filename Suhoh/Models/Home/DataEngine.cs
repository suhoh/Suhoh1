using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Suhoh.Model
{
    public class DataEngine
    {
        public static XY GetLonLatFromSectionTable(AppConfig appConfig, string sectionId)
        {
            XY lonLat = new XY();
            string connString = GetConnectionString(appConfig);
            DataSourceInfo dInfo = appConfig.DataSources.Where(g => g.Id.ToUpper().Equals(ViewModel._gridTable.ToUpper())).First();
            string query = "select Longitude, Latitude from " + dInfo.Database + " where section_id = '" + sectionId + "'";
            DataTable dt = SelectFromTable("GetLonLatFromSectionTable", connString, query);
            if (dt == null)
                return lonLat;
            foreach (DataRow row in dt.Rows)
            {
                lonLat.X = Convert.ToDouble(row["Longitude"]);
                lonLat.Y = Convert.ToDouble(row["Latitude"]);
            }

            return lonLat;
        }

        // Using DataSet
        public static DataTable SelectFromTable(string sender, string connString, string query)
        {
            DataTable dTable = null;
            SqlConnection sqlConnection = null;
            try
            {
                DataSet dSet = new DataSet();
                sqlConnection = new SqlConnection(connString);
                SqlCommand sqlCommand = new SqlCommand();
                SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
                sqlConnection.Open();
                sqlCommand = sqlConnection.CreateCommand();
                sqlCommand.CommandText = query;
                sqlDataAdapter.SelectCommand = sqlCommand;
                dSet.Reset();
                sqlDataAdapter.Fill(dSet);
                dTable = dSet.Tables[0];
                sqlConnection.Close();
            }
            catch (Exception ex)
            {
                sqlConnection.Close();
                throw new Exception("--- " + sender + " ---\n" + query + "\n" + ex.Message);
            }
            return dTable;
        }

        public static string GetConnectionString(AppConfig appConfig)
        {
            var activeSchema = appConfig.Schemas.Where(p => p.Id.Equals(appConfig.ActiveDatabase)).First();
            string connString = "User Id=" + activeSchema.Username +
                               ";Password=" + activeSchema.Password +
                               ";Data Source=" + activeSchema.Name;
            return connString;
        }

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

        public static IEnumerable MeridianList()
        {
            List<string> meridianList = new List<string>();
            for (int i = 1; i <= 6; i++)
            {
                meridianList.Add(i.ToString());
            }
            return meridianList;
        }
    }
}