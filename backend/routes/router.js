var express = require("express");
var router = express.Router();

var mainCtrl = require("./../controller/controllers");

router.get("/", mainCtrl.sayHello);
//
// router.get("/blogs", mainCtrl.sendHTML);
// router.get("/blogs/new", mainCtrl.sendHTML);
// router.get("/blogs/:id", mainCtrl.sendHTML);

router.get("/api/blogs", mainCtrl.fetchEntries);
router.get("/api/blogs/:id", mainCtrl.fetchEntry);
router.post("/api/blogs", mainCtrl.createEntry);
router.post("/api/blogs/:id", mainCtrl.updateEntry);
// router.post("/api/blogs/:id", mainCtrl.deleteEntry);

module.exports = router;
