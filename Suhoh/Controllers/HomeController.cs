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

namespace Suhoh.Controllers
{    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewModel model = new ViewModel();

            // @"[{'name': 'Panel1', 'type': ['Map']}, {'name': 'Panel2', 'type': ['Pie']}, {'name': 'Panel3', 'type': ['Gridview']}]"
            model.MainPanels = JsonConvert.DeserializeObject<List<Panel>>(model.MainPanelJson);

            ViewData["RightPanelPartialCallback"] = false;
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

        public ActionResult DxGridview(ViewModel vm)
        {
            ViewModel viewModel = (ViewModel)Session["viewModel"];
            return PartialView("DxGridview", viewModel);
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

    }
}