const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController.cjs");

router.get("/getClass", classController.getClass);
router.get("/getNextId", classController.getNextId);
router.post("/add", classController.add);
router.post("/addWithConflict", classController.addWithConflict);
router.get("/getClassIds", classController.getClassIds);
router.get("/getSchedule", classController.getSchedule);
router.delete("/deleteClass", classController.deleteClass);

module.exports = router;