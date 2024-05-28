const multer = require('multer');
const { Router } = require("express");
const trekoController = require('../controllers/treko.controller');

const storage = multer.diskStorage({ destination: "./uploads" });
const upload = multer({ storage });

const router = Router();
router.post("/treko/new", upload.single("file"), trekoController.createTreko);
module.exports = router;

