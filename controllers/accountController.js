const jwt = require("jsonwebtoken")
require("dotenv").config()
const bcrypt = require("bcryptjs")
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver the login view
**************************************** */
async function buildLogin(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email: ""
    })
  } catch (error) {
    console.error("Error building login page:", error)
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Unable to load login page.",
      nav: []
    })
  }
}

/* ****************************************
*  Deliver the registration view
**************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      messages: [],
      errors: null,
      account_firstname: "",
      account_lastname: "",
      account_email: ""
    })
  } catch (error) {
    console.error("Error building register page:", error)
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Unable to load registration page.",
      nav: []
    })
  }
}

/* ****************************************
*  Register an account
**************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hash(account_password, 10)
  } catch (error) {
    console.error("Error hashing password:", error)
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}

/* ****************************************
*  Process login request
**************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email
    })
  }

  try {
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (passwordMatch) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000
      })
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Invalid credentials.")
      return res.status(401).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email
      })
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Login failed due to server error.",
      nav
    })
  }
}

/* ****************************************
*  Deliver Account Management view
**************************************** */
async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null
    })
  } catch (error) {
    console.error("Error building management page:", error)
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Unable to load management page.",
      nav: []
    })
  }
}

/* ****************************************
*  Deliver update account view
**************************************** */
async function buildUpdateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("account/update-account", {
      title: "Edit Account",
      nav,
      errors: null
    })
  } catch (error) {
    console.error("Error building update page:", error)
    res.status(500).render("errors/error", {
      title: "Server Error",
      message: "Unable to load account update page.",
      nav: []
    })
  }
}

/* ****************************************
*  Update an account
**************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updResult) {
    req.flash("notice", "Congratulations, you updated the account!")
    const accountToken = await accountModel.getAccountByEmail(account_email)
    delete accountToken.account_password
    const token = jwt.sign(accountToken, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      maxAge: 3600 * 1000
    })
    return res.render("account/management", { title: "Account Management", nav, errors: null })
  } else {
    req.flash("notice", "Sorry, the account update failed.")
    return res.status(501).render("account/update-account", { title: "Edit Account", nav, errors: null })
  }
}

/* ****************************************
*  Logout Account
**************************************** */
function logoutAccount(req, res) {
  res.clearCookie("jwt")
  res.locals.loggedin = 0
  return res.redirect("/")
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildManagement,
  buildUpdateAccount,
  updateAccount,
  logoutAccount
}
