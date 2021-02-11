using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Suhoh.Model;

namespace Suhoh.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult OpenLayerMap(ViewModel vm)
        {
            return View();
        }
        public ActionResult D3Graph(ViewModel vm)
        {
            return View();
        }
        public ActionResult DxGridview(ViewModel vm)
        {
            return View();
        }
    }
}