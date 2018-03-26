using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using WebChat.Models;

namespace WebChat.Controllers
{
    public class PushController : Controller
    {
        private readonly ILogger _logger;
        public PushController(ILogger<PushController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        public IActionResult Register([FromBody]PushRegisterModel model)
        {
            _logger.LogDebug("register push manager endpoint: {0}", model.Endpoint);
            _logger.LogDebug("register push manager p256dh: {0}", model.Key);
            _logger.LogDebug("register push manager auth: {0}", model.Secret);
            HttpContext.Session.SetString("endpoint", model.Endpoint);
            HttpContext.Session.SetString("key", model.Key);
            HttpContext.Session.SetString("secret", model.Secret);
            return Created(nameof(Created), null);
        }
    }
}