using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace Suhoh.Model
{
    public class DataEngine
    {
        public static void JsonToList()
        {
            //const string json = "[{\"ID\":2,\"fname\":\"Jorge\",\"lname\":\"Pasada\",\"phone\":\"5555555555\",\"company\":\"Test Company1\",\"email\":\"test2@test.com\",\"pass\":\"UHVycGxlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==\",\"registrationdate\":null,\"userrole\":\"A\",\"approveduser\":\"Yes\"}";
            string json = "[{\"ID\":1,\"fname\":\"Jorge\"}, {\"ID\":2,\"fname\":\"Michael\"}]";
            //var message = JsonConvert.DeserializeObject<List<KeyValue>>(json);
            //foreach (var pair in message)
            //{
            //    Console.WriteLine("{0}: {1}", pair.Key, pair.Value);
            //}

            //DataSet dset = JsonConvert.DeserializeObject<DataSet>(json);

            DataTable dt = (DataTable)JsonConvert.DeserializeObject(json, (typeof(DataTable)));
        }
    }
}