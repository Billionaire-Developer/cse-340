const utilities = require("../utilities/");

async function errorHandler(err, req, res, next) {
  console.error(err.stack);
  const nav = await utilities.getNav();
  res.status(500).render("errors/error", {
    title: "500 - Server Error",
    message: "Something went wrong. Please try again later.",
    nav,
  });
}

module.exports = errorHandler;