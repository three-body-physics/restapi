var express = require("express");
var router = express.Router();

var mainCtrl = require("./../controller/controllers");
var passport = require("passport");

router.get("/", mainCtrl.sayHello);

router.get("/api/home", mainCtrl.fetchEntries);
router.get("/api/home/entry/:id", mainCtrl.fetchEntry);
router.post("/api/home", passport.authenticate("jwt", {session: false}), mainCtrl.createEntry);
router.post("/api/home/entry/:id", passport.authenticate("jwt", {session: false}), mainCtrl.postComment);
router.post("/api/register", mainCtrl.userReg);
router.post("/api/login", mainCtrl.userLogin);
router.post("/api/home/user/:userId", mainCtrl.adminAuth, passport.authenticate("jwt", {session: false}), mainCtrl.userProfile);
router.delete("/api/home/entry/:id", passport.authenticate("jwt", {session: false}), mainCtrl.deleteEntry);

var triviaController = require("./../controller/triviaController");

router.post("/api/trivia/register", triviaController.userReg);
router.post("/api/trivia/login", triviaController.userLogin);
router.get("/api/trivia/user/:userid", passport.authenticate("jwt-2", {session: false}), triviaController.retreiveUser);
router.post("/api/trivia/user/:userid", triviaController.updateUserRecord);

module.exports = router;