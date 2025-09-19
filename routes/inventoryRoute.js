// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleError(invController.buildByClassificationId));

// Vehicle detail route
router.get("/detail/:invId", utilities.handleError(invController.buildByInvId));


// ✅ Intentional error route
router.get("/trigger-error", utilities.handleError(invController.throwError))

module.exports = router;