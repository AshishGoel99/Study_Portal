using System.Web.Mvc;

namespace Study_Portal.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            return View();
        }

        //public JsonResult 
    }
}
