using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebChat.Models;

namespace WebChat.Controllers
{
    public class ChatController : Controller
    {
        private readonly ILogger _logger;
        private readonly HttpClient _client;

        public ChatController(ILogger<ChatController> logger)
        {
            _logger = logger;
            _client = new HttpClient();
        }
        public async Task<IActionResult> Send([FromBody]PushRegisterModel model)
        {
            StringContent content = new StringContent(model.Payload);
            var resp = await _client.PostAsync(model.Endpoint,content);

            if((int)resp.StatusCode >= 400) {
                _logger.LogError(resp.Content.ReadAsStringAsync().Result);
                throw new System.Exception(resp.StatusCode.ToString());
            }

            return Created("Created", null);
        }
    }
}