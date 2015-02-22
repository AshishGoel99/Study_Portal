using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace WebApp1.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return PartialView();
        }

        public ActionResult Course(int Id = 0)
        {
            ViewBag.CourseId = Id;
            return PartialView();
        }

        public ActionResult Subject(int Id = 0)
        {
            ViewBag.SubjectId = Id;
            return PartialView();
        }

        public ActionResult BookReader(string url)
        {
            ViewBag.BookUrl = url;
            return PartialView();
        }
    }
}
