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

namespace Suhoh.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewModel model = new ViewModel();

            Session["viewModel"] = model;
            return View(model);
        }
        public ActionResult OpenLayerMap(ViewModel vm)
        {
            return View();
        }
        public ActionResult OpenLayerMapProperty(ViewModel vm)
        {
            return View();
        }
        public ActionResult D3Graph(ViewModel vm)
        {
            return View();
        }
        public ActionResult D3GraphProperty(ViewModel vm)
        {
            return View();
        }
        public ActionResult DxGridview(ViewModel vm)
        {
            ViewModel viewModel = (ViewModel)Session["viewModel"];
            return PartialView("DxGridview", viewModel);
        }
        public ActionResult DxGridviewProperty(ViewModel vm)
        {
            return View();
        }

        public ActionResult RightPanelPartial(string sender, int paneDir, int paneType)
        {
            ViewModel vm = (ViewModel)Session["viewModel"];
            vm.AddPaneSender = sender;
            vm.AddPaneType = paneType;
            vm.AddPaneDirection = paneDir;

            return PartialView("RightPanelPartial", vm);
        }

        [HttpPost]
        public ActionResult ConvertJsonToDataTable(string json)
        {
            ViewModel vm = (ViewModel)Session["viewModel"];
            json = json.Replace("\"\"", "null");    // change 2 double quotes to null due to Json error
            vm.DxGridview = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)), 
                new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore, MissingMemberHandling = MissingMemberHandling.Ignore });

            Session["viewModel"] = vm;
            return Json("Success", JsonRequestBehavior.AllowGet);
        }

    }
}