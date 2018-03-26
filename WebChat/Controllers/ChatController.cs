using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebChat.Models;
using WebPush;

namespace WebChat.Controllers
{
    public class ChatController : Controller
    {
        private readonly ILogger _logger;
        private readonly WebPushClient _client;
        private readonly VapidDetails vapidKeys;

        public ChatController(ILogger<ChatController> logger)
        {
            _logger = logger;
            _client = new WebPushClient();
            vapidKeys = VapidHelper.GenerateVapidKeys();
            vapidKeys.Subject = "mailto:hawkeyes0@hotmail.com";
            _logger.LogDebug($"Public {vapidKeys.PublicKey}");
            _logger.LogDebug($"Private {vapidKeys.PrivateKey}");
            _logger.LogDebug($"Subject {vapidKeys.Subject}");
        }
        public async Task<IActionResult> Send([FromBody]PushRegisterModel model)
        {
            var subscription = new PushSubscription(model.Endpoint, model.Key, model.Secret);
            try
            {
                await _client.SendNotificationAsync(subscription, model.Payload, vapidKeys);
            }
            catch (WebPushException e)
            {
                return StatusCode((int)e.StatusCode);
            }

            return Created("Created", null);
        }
    }
}