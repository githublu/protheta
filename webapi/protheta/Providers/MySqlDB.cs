using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MySql.Data;
using MySql.Data.MySqlClient;

namespace protheta
{
    public class MySqlDB : IDisposable
    {
        private MySqlConnection connection = null;

        public MySqlDB()
        {

        }

        public MySqlConnection Connection()
        {
            return connection;
        }

        public bool Connect()
        {
            bool isConnected = true;

            string connstring = string.Format("Server=localhost; database=project1; UID=project1; password=project1");

            if (connection == null)
            {
                connection = new MySqlConnection(connstring);
                try
                {
                    connection.Open();
                    isConnected = true;
                }
                catch
                {
                    connection.Close();
                    isConnected = false;
                }
            }

            return isConnected;
        }

        public void Dispose()
        {
            connection.Close();
            connection = null;
        }
    }
}