using System.Web;
using System.Web.Optimization;

namespace Suhoh
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/suhoh").Include(
                "~/Scripts/BaseScript.js",
                "~/Scripts/Ol_v650/ol.js",
                "~/Scripts/OL/layersNsymbols.js",
                "~/Scripts/OL/initMap.js",
                "~/Scripts/OL/addLayers.js",
                "~/Scripts/D3_v650/d3.js",
                "~/Scripts/D3/pie.js",
                "~/Scripts/SheetJS/xlsx.full.min.js"
            ));

            // DevExpress add jquery automatically in web.config
            // https://docs.devexpress.com/AspNet/17153/common-concepts/webconfig-modifications/webconfig-options/embed-third-party-libraries
            //bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            //    "~/Scripts/jQuery/jquery-{version}.js"));

            //bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
            //    "~/Scripts/jQuery/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at https://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                "~/Scripts/modernizr-*"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                "~/Content/Css/DxGridview.css",
                "~/Content/Css/D3Graph.css",
                "~/Content/Css/OpenLayerMap.css",
                "~/Content/Css/Content.css",
                "~/Content/Css/Layout.css",
                "~/Scripts/Ol_v650/ol.css"));

            //bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
            //        "~/Scripts/bootstrap.js",
            //        "~/Scripts/respond.js"));
        }
    }
}