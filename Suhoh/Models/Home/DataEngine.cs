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

        public static IEnumerable RefreshProjectList(AppConfig appConfig, string email)
        {
            string result = string.Empty;
            string connString = GetConnectionString(appConfig);
            DataSourceInfo dInfo = appConfig.DataSources.Where(g => g.Id.ToUpper().Equals(ViewModel._projectTable.ToUpper())).First();
            string query = "select Email, Name, CreationDate, UpdatedDate from " + dInfo.Database + " where email = '" + email + "' and Flag = 'C' order by updatedDate";
            DataTable dt = SelectFromTable("SelectProject", connString, query);
            if (dt == null)
                return null;
            IEnumerable e = dt.AsEnumerable().Select(row => new Project
            {
                Email = row["Email"].ToString(),
                ProjectName = row["Name"].ToString(),
                CreationDate = Convert.ToDateTime(row["CreationDate"]),
                UpdatedDate = Convert.ToDateTime(row["CreationDate"])
            }).ToList();

            return e;
        }

        public static int GetProjectCount(AppConfig appConfig, string email, string name)
        {
            string connString = GetConnectionString(appConfig);
            DataSourceInfo dInfo = appConfig.DataSources.Where(g => g.Id.ToUpper().Equals(ViewModel._projectTable.ToUpper())).First();
            string query = "select count(*) count from " + dInfo.Database + " where email = '" + email + "' and name = '" + name + "' and Flag = 'C'";
            DataTable dt = SelectFromTable("GetProjectCount", connString, query);
            int count = Convert.ToInt16(dt.Rows[0][0]);
            return count;
        }

        public static string SaveProject(AppConfig appConfig, string email, string name)
        {
            string result = string.Empty;
            string connString = GetConnectionString(appConfig);
            DataSourceInfo dInfo = appConfig.DataSources.Where(g => g.Id.ToUpper().Equals(ViewModel._projectTable.ToUpper())).First();
            string query = "insert into " + dInfo.Database + " values(" +
                           "'" + email + "'," +
                           "'" + name + "'," +
                           "'" + DateTime.Now + "'," +  // created date
                           "'" + DateTime.Now + "'," +   // updated date
                           "'C')";           // create
            result = RunNonSelectQuery(connString, query);
            return result;
        }

        public static string DeleteProject(AppConfig appConfig, string email, string name)
        {
            string result = "Fail";
            string connString = GetConnectionString(appConfig);
            DataSourceInfo dInfo = appConfig.DataSources.Where(g => g.Id.ToUpper().Equals(ViewModel._projectTable.ToUpper())).First();
            string query = "update " + dInfo.Database + " set Flag = 'D', UpdatedDate = '" + DateTime.Now + "' where Email = '" + email + "'" + " and Name = '" + name + "'";
            result = RunNonSelectQuery(connString, query);
            return result;
        }

        // update, insert or delete
        public static string RunNonSelectQuery(string connString, string query)
        {
            SqlConnection sqlConnection = new SqlConnection(connString);
            SqlCommand sqlCommand = new SqlCommand();
            SqlDataAdapter sqlDataAdapter = new SqlDataAdapter();
            try
            {
                sqlConnection.Open();
                sqlCommand = sqlConnection.CreateCommand();
                sqlCommand.CommandText = query;
                sqlCommand.ExecuteNonQuery();
            }
            catch (Exception ex)
            {
                sqlConnection.Close();
                return ex.Message;
            }
            finally
            {
                sqlCommand.Dispose();
                if (sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
            }
            return "Success";
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

        public static IEnumerable ProjectList()
        {
            List<Project> projects = new List<Project>();
            projects.Add(new Project { ProjectName = "Henry Suh", CreationDate = DateTime.Now });
            projects.Add(new Project { ProjectName = "Sangmin Lee", CreationDate = DateTime.Now });
            projects.Add(new Project { ProjectName = "James Suh", CreationDate = DateTime.Now });
            projects.Add(new Project { ProjectName = "Jae", CreationDate = DateTime.Now });
            projects.Add(new Project { ProjectName = "Test project", CreationDate = DateTime.Now });
            return projects;
        }
    }
}