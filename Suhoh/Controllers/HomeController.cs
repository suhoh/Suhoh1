using DevExpress.Web.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Suhoh.Model;
using System.Data;
using Newtonsoft.Json;
using static Suhoh.Model.ViewModel;
using System.Web.Hosting;
using System.Xml.Serialization;
using System.IO;

namespace Suhoh.Controllers
{    public class HomeController : Controller
    {
        AppConfig _appConfig;

        public ActionResult Index()
        {
            _appConfig = ReadConfigXml("App_Data", "AppConfig.xml");
            Session["appConfig"] = _appConfig;

            ViewModel model = new ViewModel();
            model.AppConfig = _appConfig;

            // @"[{'name': 'Panel1', 'type': ['Map']}, {'name': 'Panel2', 'type': ['Pie']}, {'name': 'Panel3', 'type': ['Gridview']}]"
            model.MainPanels = JsonConvert.DeserializeObject<List<Panel>>(model.MainPanelJson);
            model.Projects = DataEngine.GetProjectList(_appConfig, "suhohconsultingltd@gmail.com");

            ViewData["RightPanelPartialCallback"] = false;  // test
            Session["viewModel"] = model;
            return View(model);
        }

        public ActionResult CallbackPopupPanelProperty(ViewModel vm, string sender)
        {
            ViewModel viewModel = (ViewModel)Session["viewModel"];
            viewModel.ActiveProperty = sender;
            Session["viewModel"] = viewModel;
            return PartialView("CallbackPopupPanelProperty", viewModel);
        }

        public ActionResult DxGridview(ViewModel vm, string name)
        {
            ViewModel viewModel = (ViewModel)Session["viewModel"];
            if (string.IsNullOrEmpty(name))
                viewModel.CreatePanelName = Request.Params["dxGridview_sender"];    // called from gridview
            else
                viewModel.CreatePanelName = name;                                   // called from PerformCallback
            Session["viewModel"] = viewModel;
            return PartialView("DxGridview", viewModel);
        }

        public ActionResult LeftPanelProjectGridview(ViewModel vm)
        {
            ViewModel viewModel = (ViewModel)Session["viewModel"];

            Session["viewModel"] = viewModel;
            return PartialView("LeftPanelProjectGridview", viewModel);
        }

        [HttpPost]
        public ActionResult RightPanelPartial(string sender, int paneDir, int paneType, string jsonPanels)
        {
            ViewModel vm = (ViewModel)Session["viewModel"];
            vm.AddPaneSender = sender;
            vm.AddPaneType = paneType;
            vm.AddPaneDirection = paneDir;

            var p = Request.Params["OnBeginCallback"];  // test - send from DevExpress PerformCallback

            ViewBag.IsChangePanels = true;
            jsonPanels = jsonPanels.Replace("\"", null);    // remove double quot
            vm.MainPanels = JsonConvert.DeserializeObject<List<Panel>>(jsonPanels);
            vm.ActivePanelSettings = vm.MainPanels.Count;

            Session["viewModel"] = vm;
            return PartialView("RightPanelPartial", vm);
        }

        [HttpPost]
        public ActionResult ConvertJsonToDataTable(string json)
        {
            ViewModel vm = (ViewModel)Session["viewModel"];
            json = json.Replace("\"\"", "null");    // change 2 double quotes to null due to Json error
            vm.DxGridview = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)),
                new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });

            // Column name/type
            vm.ColumnInfos.Clear();
            foreach (DataColumn c in vm.DxGridview.Columns)
                vm.ColumnInfos.Add(new ColumnInfo { Name = c.ColumnName, Type = c.DataType.Name });
            vm.ColumnInfos.Sort((a1, a2) => a1.Name.CompareTo(a2.Name));

            Session["viewModel"] = vm;
            return Json(vm.ColumnInfos, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetLonLatFromSectionTable(string sectionId)
        {
            AppConfig appConfig = (AppConfig)Session["appConfig"];
            XY lonLat = DataEngine.GetLonLatFromSectionTable(appConfig, sectionId);
            return Json(lonLat, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetProjectList(string email)
        {
            ViewModel vm = (ViewModel)Session["viewModel"];
            AppConfig appConfig = (AppConfig)Session["appConfig"];            
            vm.Projects = DataEngine.GetProjectList(appConfig, email);
            Session["viewModel"] = vm;
            return Json("Success", JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult SaveProject(string projectName)
        {
            string result = string.Empty;
            AppConfig appConfig = (AppConfig)Session["appConfig"];
            string email = "suhohconsultingltd@gmail.com";
            result = DataEngine.SaveProject(appConfig, email, projectName);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        // Setting Flag to D in database
        public ActionResult DeleteProject(string projectName)
        {
            string result = string.Empty;
            AppConfig appConfig = (AppConfig)Session["appConfig"];
            string email = "suhohconsultingltd@gmail.com";
            result = DataEngine.DeleteProject(appConfig, email, projectName);
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        public AppConfig ReadConfigXml(string folder, string filename)
        {
            AppConfig appConfig = new AppConfig();
            string filePath = Path.Combine(HostingEnvironment.ApplicationPhysicalPath, folder, filename);
            XmlSerializer serializer = new XmlSerializer(typeof(AppConfig));

            StreamReader sr = new StreamReader(filePath);
            appConfig = (AppConfig)serializer.Deserialize(sr);
            sr.Close();

            return appConfig;
        }

    }
}