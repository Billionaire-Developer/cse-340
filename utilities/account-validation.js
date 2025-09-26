
const accountModel = require("../models/account-model")
const invModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }}),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
      })
      return
    }
    next()
  }

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
      const emailExists = await accountModel.checkExistingEmail(account_email)
      if (!emailExists){
        throw new Error("Email do not exists. Please register or use different email")
      }}),
      
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
    ]
  }

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLogData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}
  
/*  **********************************
  *  Add New Classification Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("classification_name")
    .trim()
    .escape()
    .notEmpty()
    .matches(/^[A-Za-z]+$/)
    .withMessage("Only alphabetic characters are allowed."),
    ]
  }


/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/addclassification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/*  **********************************
  *  Add New Classification Rules
  * ********************************* */
validate.vehicleRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("The vehicle's make is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("The vehicle's model is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 4, max: 4 })
    .isInt()
    .withMessage("The vehicle's year is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The vehicle's description is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The vehicle's image is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The vehicle's thumbnail is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("The vehicle's price is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .isInt()
    .withMessage("The vehicle's miles is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The vehicle's color is required."),

    // valid email is required and cannot already exist in the DB
    body("classification_id")
    .trim()
    .notEmpty()
    .isInt()
    .withMessage("The vehicle's classification is required."),
    ]
  }


/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const { classification_id } = req.body
    let list = await utilities.buildClassificationList(classification_id)
    res.render("inventory/addvehicle", {
      errors,
      title: "Add New Vehicle",
      nav,
      list,
      inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
      
    })
    return
  }
  next()
}

/*  **********************************
  *  Add New Classification Rules
  * ********************************* */
validate.updateRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("inv_make")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("The vehicle's make is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_model")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("The vehicle's model is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_year")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 4, max: 4 })
    .isInt()
    .withMessage("The vehicle's year is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_description")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The vehicle's description is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_image")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The vehicle's image is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_thumbnail")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The vehicle's thumbnail is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_price")
    .trim()
    .escape()
    .notEmpty()
    .isNumeric()
    .withMessage("The vehicle's price is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_miles")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .isInt()
    .withMessage("The vehicle's miles is required."),

    // valid email is required and cannot already exist in the DB
    body("inv_color")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The vehicle's color is required."),

    // valid email is required and cannot already exist in the DB
    body("classification_id")
    .trim()
    .notEmpty()
    .isInt()
    .withMessage("The vehicle's classification is required."),
    ]
  }
  
/* ******************************
 * Check inventory data and return errors or continue to Management view
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit", {
      errors,
      title: "Edit " + itemName,
      nav,
      list: classificationSelect,
      inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id,
      
    })
    return
  }
  next()
}

/*  **********************************
  *  Update Data Validation Rules
  * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email, account_id) => {
    console.log(account_id)
    const emailExistsById = await accountModel.checkExistingEmailById(account_email, account_id)
    const emailExists = await accountModel.checkExistingEmail(account_email)
    if (emailExistsById) {
      console.log("Congratulations!")
    } else {
      if (emailExists){
        throw new Error("Email exists. Please use a different email")}
    }
    })
    ,
  ]
}


/* ******************************
* Check data and return errors or continue to Update
* ***************************** */
validate.checkUpdAccData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      errors,
      title: "Edit Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.updatePasswordRules = () => {
  return [
    
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/*  **********************************
  *  Add New Classification Rules
  * ********************************* */
validate.commentRules = () => {
  return [
    // valid comment is required
    body("comment_text")
    .trim()
    .escape()
    .notEmpty()
    .isLength({ min: 1 })
    .withMessage("The comment cannot be empty."),
    ]
  }
  
/* ******************************
 * Check inventory data and return errors or continue to Management view
 * ***************************** */
validate.checkCommentData = async (req, res, next) => {
  const { inv_id, comment_text, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const data = await invModel.getInventoryDetailById(inv_id)
    const comment_data = await invModel.getCommentByInventoryId(inv_id)
    console.log(comment_data)
    const details = await utilities.buildVehicleDetail(data)
    const comments = await utilities.buildCommentsSection(comment_data)
    let nav = await utilities.getNav()
    const vehicleYear = data[0].inv_year
    const vehicleMake = data[0].inv_make
    const vehicleModel = data[0].inv_model
    const vehicleId = data[0].inv_id
    res.render("./inventory/details", {
      title: `${vehicleYear} ${vehicleMake} ${vehicleModel} Details`,
      nav,
      details,
      invid: vehicleId,
      comments,
      errors,
    })
    return
  }
  next()
}

/*  **********************************
  *  Add New Classification Rules
  * ********************************* */
validate.updateTypeRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_id")
    .trim()
    .notEmpty()
    .isInt()
    .withMessage("The email is required."),
    
    // valid email is required and cannot already exist in the DB
    body("account_type")
    .trim()
    .notEmpty()
    .withMessage("The account type is required."),
    ]
  }
  
/* ******************************
 * Check inventory data and return errors or continue to Management view
 * ***************************** */
validate.checkUpdateTypeData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const emailSelect = await utilities.buildEmailList(account_id)
    res.render("account/update-type", {
      title: "Update Account Type",
      nav,
      errors,
      emaillist: emailSelect,
    })
    return
  }
  next()
}


module.exports = validate