var express = require("express");
var router = express.Router();

var mainCtrl = require("./../controller/controllers");
var passport = require("passport");

router.get("/", mainCtrl.sayHello);
//
// router.get("/blogs", mainCtrl.sendHTML);
// router.get("/blogs/new", mainCtrl.sendHTML);
// router.get("/blogs/:id", mainCtrl.sendHTML);

router.get("/api/home", mainCtrl.fetchEntries);
router.get("/api/home/entry/:id", mainCtrl.fetchEntry);
router.post("/api/home", passport.authenticate("jwt", {session: false}), mainCtrl.createEntry);
router.post("/api/home/entry/:id", passport.authenticate("jwt", {session: false}), mainCtrl.postComment);
router.post("/api/register", mainCtrl.userReg);
router.post("/api/login", mainCtrl.userLogin);
router.post("/api/home/user/:userId", mainCtrl.adminAuth, passport.authenticate("jwt", {session: false}), mainCtrl.userProfile);
router.delete("/api/home/entry/:id", passport.authenticate("jwt", {session: false}), mainCtrl.deleteEntry);

module.exports = router;
