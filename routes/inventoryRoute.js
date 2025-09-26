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


// Route to build inventory management view
// Route to build inventory management view
router.get('/', invController.buildManagementView);


// Route to build classification view
router.get(
  "/add-classification",
  utilities.handleError(invController.buildAddClassificationView)
);

router.get(
  "/getInventory/:classification_id",
  utilities.handleError(invController.getInventoryJSON)
);

// Route to build inventory  view
router.get(
  "/add-inventory",
  utilities.handleError(invController.buildAddInventoryView)
);

// Route to build edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleError(invController.editInventoryView)
);

// Route to process deleting an inventory item
router.get(
  "/delete/:inv_id",
  utilities.handleError(invController.buildDeleteConfirmation)
);

// Route to process adding a classification
router.post(
  "/add-classification",
  validation.classificationRules(),
  validation.checkClassificationData,
  utilities.handleError(invController.addClassification)
);

// Route to process adding an inventory item
router.post(
  "/add-inventory",
  validation.vehicleRules(),
  validation.checkVehicleData,
  utilities.handleError(invController.addInventory)
);

// Route to process deleting an inventory item
router.post(
  "/delete",
  utilities.handleError(invController.deleteInventoryItem)
);

// Route to handle the update request
router.post(
  "/update",
  validation.vehicleRules(),
  validation.checkUpdateData,
  utilities.handleError(invController.updateInventory)
);

// Route to process adding a comment
router.post(
  "/comment",
  utilities.checkLoginComment,
  validation.commentRules(),
  validation.checkCommentData,
  utilities.handleError(invController.sendComment)
);

// Route for error testing
router.get("/cause-error", (req, res, next) => {
  next(new Error("Intentional error for testing purposes"));
});


module.exports = router;