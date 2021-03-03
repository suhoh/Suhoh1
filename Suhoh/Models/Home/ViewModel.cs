using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

namespace Suhoh.Model
{
    public class ViewModel
    {
        public DataTable DxGridview { get; set; }

        public string TitleProperty { get; set; }

        public bool ChkPercentageLabel { get; set; }
        public bool ChkYValueLabel { get; set; }
        public bool ChkXValueLabel { get; set; }

        public ViewModel()
        {
            TitleProperty = "Title";
            ChkPercentageLabel = false;
            ChkYValueLabel = false;
            ChkXValueLabel = false;
        }
    }

    public class KeyValue
    {
        public string Key { get; set; }
        public string Value { get; set; }
    }


}