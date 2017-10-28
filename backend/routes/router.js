var express = require("express");
var router = express.Router();

var mainCtrl = require("./../controller/controllers");

router.get("/", mainCtrl.sayHello);
//
// router.get("/blogs", mainCtrl.sendHTML);
// router.get("/blogs/new", mainCtrl.sendHTML);
// router.get("/blogs/:id", mainCtrl.sendHTML);

router.get("/api/blogs", mainCtrl.fetchEntries);
router.get("/api/blog/:id", mainCtrl.fetchEntry);
router.post("/api/blogs", mainCtrl.createEntry);
router.post("/api/blog/:id", mainCtrl.postComment);
router.post("/api/register", mainCtrl.userReg);
router.post("/api/login", mainCtrl.userLogin);
// router.put("/api/blog/:id", mainCtrl.updateEntry);
// router.delete("/api/blogs/:id", mainCtrl.deleteEntry);

module.exports = router;
