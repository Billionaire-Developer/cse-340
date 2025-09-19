const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory detail view by invId
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  const invId = req.params.invId
  const data = await invModel.getInventoryById(invId)

  if (!data) {
    req.flash("notice", "Sorry, that vehicle was not found.")
    return res.redirect("/inv")
  }

  // Pass the object directly (not data[0])
  const itemHTML = utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()

  res.render("./inventory/detail", {
    title: `${data.inv_make} ${data.inv_model}`,
    nav,
    itemHTML,
  })
}


/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inv_id = req.params.inv_id
  const data = await invModel.getVehicleById(inv_id) // <-- make sure model has this
  let nav = await utilities.getNav()
  const vehicle = data[0]

  const vehicleHTML = utilities.buildVehicleDetailHTML(vehicle)

  res.render("./inventory/detail", {
    title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
    nav,
    vehicleHTML,
  })
}

module.exports = invCont