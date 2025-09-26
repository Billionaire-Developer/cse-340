const express = require("express");
const router = express.Router();
const utilities = require("../utilities");
const errorHandlers = require("../middleware/errorHandler");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// Route to build account view
router.get("/login", utilities.handleError(accountController.buildLogin));

// Route to build register view
router.get("/register", utilities.handleError(accountController.buildRegister));

// Route to account management view
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleError(accountController.buildManagement)
);

// Route to build update account view
router.get("/update", utilities.handleError(accountController.buildUpdateAccount))

//Update Account Type only Admin
router.get(
    "/accounttype",
    utilities.adminType, 
    utilities.handleError(accountController.buildAccountType))

//Logout Account
router.get("/logout", accountController.logoutAccount)

// Route to process registration
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleError(accountController.registerAccount)
);

// Route to process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleError(accountController.accountLogin)
);

// Update account from register page
router.post(
    "/update",
    regValidate.updateAccountRules(),
    regValidate.checkUpdAccData, 
    utilities.handleError(accountController.updateAccount))

router.post(
    "/updatetype",
    utilities.adminType,
    regValidate.updateTypeRules(),
    regValidate.checkUpdateTypeData,
    utilities.handleError(accountController.updateType))


router.use(utilities.checkJWTToken)
// Error handler
router.use(errorHandlers);

module.exports = router;