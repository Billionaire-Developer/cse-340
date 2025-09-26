/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require("./routes/accountRoute");
const session = require("express-session");
const pool = require("./database/");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const feedbackRoute = require('./routes/feedbackRoute');
const errorHandler = require("./middleware/errorHandler");
const utilities = require("./utilities/")  // make sure this is at the top of server.js

/* ***********************
 * View Engine Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Middleware
 *************************/
app.use(express.static("public"))

// Serve the images folder directly
app.use("/images", express.static("images"))


// parse form data
app.use(express.urlencoded({ extended: true }))

// parse JSON (if needed)
app.use(express.json())

/* ***********************
 * Routes
 *************************/
app.use(static)

/*Index route */
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})


// Account routes
app.use("/account", accountRoute)

// Feedback routes
app.use("/feedback", feedbackRoute)



// 500 Error Middleware
app.use(async (err, req, res, next) => {   // 🔹 mark middleware async
  console.error("500 error caught: ", err.message);

  let nav = await utilities.getNav()       // 🔹 generate nav

  res.status(500).render("errors/error", {
    title: "Server Error",
    message: "Something went wrong on our server. Please try again later.",
    nav
  });
});


// 404 Error Middleware (must be AFTER all routes)
app.use(async (req, res, next) => {
  const utilities = require("./utilities/")
  let nav = await utilities.getNav()

  res.status(404).render("errors/error", {
    title: "404 Not Found",
    message: "Sorry, the page you are looking for does not exist.",
    nav
  })
})
