const express = require("express");
const router = express.Router();
const routeController = require("../controllers/route");

router
  .route("/v1")
  .post(routeController.postRoutes)

module.exports = router;
