using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace protheta.Controllers
{
    public class ValuesController : ApiController
    {
        // GET api/values
        public IEnumerable<string> Get()
        {
            List<string> users = new List<string>();
            using (MySqlDB db = new MySqlDB())
            {
                if (db.Connect())
                {
                    string sql = "SELECT * FROM tbl_users";
                    MySqlCommand cmd = new MySqlCommand();
                    cmd.CommandText = sql;
                    cmd.Connection = db.Connection();
                    MySqlDataReader dataReader = cmd.ExecuteReader();

                    while (dataReader.Read())
                    {
                        users.Add(dataReader["name"].ToString());
                    }
                }

                return users;
            }
        }

        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/values
        public void Post([FromBody]string value)
        {
        }

        // PUT api/values/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/values/5
        public void Delete(int id)
        {
        }

        private void MySQLdbConnection()
        {
            using (MySqlDB db = new MySqlDB())
            {
                if (db.Connect())
                {
                    string sql = "INSERT INTO `tbl_user` (`mc_userName`, `mc_userPass`, `tw_userName`, `tw_userPass`) VALUES (@mcUserName, @mcUserPass, @twUserName, @twUserPass)";
                    MySqlCommand cmd = new MySqlCommand();
                    cmd.CommandText = sql;
                    cmd.Parameters.AddWithValue("@mcUserName", "1");
                    cmd.Parameters.AddWithValue("@mcUserPass", "1");
                    cmd.Parameters.AddWithValue("@twUserName", "1");
                    cmd.Parameters.AddWithValue("@twUserPass", "1");
                    cmd.Connection = db.Connection();
                    cmd.ExecuteNonQuery();
                }
            }

        }
    }
}
