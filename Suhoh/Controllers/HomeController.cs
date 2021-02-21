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
        public ActionResult D3Graph(ViewModel vm)
        {
            return View();
        }

        public IEnumerable PopulateGridView()
        {
            List<GridViewList> list = new List<GridViewList>();
            list.Add(new GridViewList() { WellId = "40038", Lat = 52.410273, Lon = -112.363697, Top = 0, Base = 1490, Depth = 172, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40039", Lat = 52.229139, Lon = -112.789561, Top = 10, Base = 104, Depth = 72, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40040", Lat = 52.166147, Lon = -112.888244, Top = 40, Base = 125, Depth = 17, TestType = "Bailer" });
            list.Add(new GridViewList() { WellId = "40041", Lat = 52.146724, Lon = -113.546148, Top = 220, Base = 824, Depth = 140, TestType = "Pump" });
            list.Add(new GridViewList() { WellId = "40042", Lat = 52.146709, Lon = -113.558193, Top = 90, Base = 324, Depth = 142, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40043", Lat = 52.211858, Lon = -113.487774, Top = 0, Base = 120, Depth = 15, TestType = "Bailer" });
            list.Add(new GridViewList() { WellId = "40044", Lat = 52.204952, Lon = -113.510706, Top = 150, Base = 170, Depth = 45, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40045", Lat = 52.220791, Lon = -113.456364, Top = 115, Base = 250, Depth = 7, TestType = "Other" });
            list.Add(new GridViewList() { WellId = "40046", Lat = 52.356866, Lon = -113.987859, Top = 34, Base = 462, Depth = 3, TestType = "" });
            list.Add(new GridViewList() { WellId = "40047", Lat = 52.776565, Lon = -113.988274, Top = 23, Base = 149, Depth = 56, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40048", Lat = 52.172101, Lon = -113.993884, Top = 666, Base = 149, Depth = 87, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40049", Lat = 52.198101, Lon = -113.993984, Top = 7343, Base = 453, Depth = 99, TestType = "None" });
            list.Add(new GridViewList() { WellId = "40050", Lat = 52.982101, Lon = -113.483274, Top = 444, Base = 149, Depth = 25, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40051", Lat = 52.592101, Lon = -113.873274, Top = 75, Base = 149, Depth = 56, TestType = "Pump" });
            list.Add(new GridViewList() { WellId = "40052", Lat = 52.098101, Lon = -113.678274, Top = 456, Base = 412, Depth = 98, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40053", Lat = 52.156901, Lon = -113.976274, Top = 76, Base = 0, Depth = 21, TestType = "Other" });
            list.Add(new GridViewList() { WellId = "40054", Lat = 52.162347, Lon = -113.378274, Top = 45, Base = 53, Depth = 21, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40055", Lat = 52.162771, Lon = -113.876274, Top = 83, Base = 79, Depth = 71, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40056", Lat = 52.162881, Lon = -113.996674, Top = 55, Base = 315, Depth = 887, TestType = "Air" });
            list.Add(new GridViewList() { WellId = "40057", Lat = 52.164301, Lon = -113.985574, Top = 74, Base = 27, Depth = 44, TestType = "Other" });
            return list;
        }

        public ActionResult DxGridview(ViewModel vm)
        {
            ViewModel viewModel = (ViewModel)Session["viewModel"];
            return PartialView("DxGridview", viewModel);
        }


        [HttpPost]
        public ActionResult ConvertJsonToDataTable(string json)
        {
            ViewModel vm = (ViewModel)Session["viewModel"];
            vm.DxGridview = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));

            Session["viewModel"] = vm;
            return Json("Success", JsonRequestBehavior.AllowGet);
        }
    }
}