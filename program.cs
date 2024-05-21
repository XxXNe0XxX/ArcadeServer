using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

class Program
{
    static readonly HttpClient client = new HttpClient();
    static async Task Main(string[] args)
    {
        try
        {
            // Testing the connection to the server
            string url = "http://localhost:3000/test-db";
            HttpResponseMessage response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            string responseBody = await response.Content.ReadAsStringAsync();
            Console.WriteLine("Current Server Time: " + responseBody);

            // Example: Add credits
            url = "http://localhost:3000/addCredits";
            var data = new
            {
                userId = "user123",
                amount = 100
            };
            var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");
            response = await client.PostAsync(url, content);
            Console.WriteLine("Response: " + await response.Content.ReadAsStringAsync());

            // Example: Check Balance
            url = "http://localhost:3000/checkBalance/user123";
            response = await client.GetAsync(url);
            Console.WriteLine("Balance: " + await response.Content.ReadAsStringAsync());
        }
        catch (HttpRequestException e)
        {
            Console.WriteLine("\nException Caught!");
            Console.WriteLine("Message :{0} ", e.Message);
        }
    }
}