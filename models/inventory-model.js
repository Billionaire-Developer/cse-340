const pool = require("../database/index");

/**************************
 * Get all Classification data
 **************************/
async function getClassifications() {
  let statement =
    "SELECT * FROM public.classification ORDER BY classification_name";
  return await pool.query(statement);
}

/**************************
 * Get all Inventory items and classification_name
 * by classification_id
 **************************/
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getClassificationById error", +error);
  }
}

/**************************
 * Get a single vehicle by vehicle_id
 * @param {number} vehicle_id
 * @returns {object} vehicle data
 * **************************/
async function getVehicleById(vehicle_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [vehicle_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error", +error);
  }
}

/**************************
 * Add a classification to the database
 * @param {string} classification_name
 * @returns {object} classification data
 * **************************/
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**************************
 * Add an inventory item to the database
 * @param {object} data
 * @returns {object} inventory data
 * **************************/
async function addInventory(data) {
  try {
    const sql = `INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const values = [
      data.classification_id,
      data.inv_make,
      data.inv_model,
      data.inv_year,
      data.inv_description,
      data.inv_image,
      data.inv_thumbnail,
      data.inv_price,
      data.inv_miles,
      data.inv_color,
    ];
    const result = await pool.query(sql, values);
    return result.rows[0];
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function getInventoryById(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM inventory WHERE inv_id = $1",
      [inv_id]
    );
    return result.rows[0];
  } catch (error) {
    return new Error("No matching inventory found");
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.error("model error: " + error);
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data; // return the number of rows affected
  } catch (error) {
    new Error("model error: " + error);
    return false;
  }
}

/* ***************************
 *  fix bug happening to images
 * and thumbnails
 * ************************** */
async function fixUpdate() {
  try {
    const sql =
      "UPDATE public.inventory SET inv_image = REPLACE(inv_image, '&#x2F;', '/'), inv_thumbnail = REPLACE(inv_thumbnail, '&#x2F;', '/') RETURNING *";
    return await pool.query(sql);
  } catch (error) {
    return error.message;
  }
}

async function sendComment(inv_id, comment_text, account_id) {
  try {
    const sql =
      "INSERT INTO comment (comment_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *";
    return await pool.query(sql, [comment_text, inv_id, account_id]);
  } catch (error) {
    return error.message;
  }
}

async function getCommentByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT comment_id, comment_text, inv_id, account_firstname
        FROM public.comment
          JOIN public.account
          ON public.comment.account_id = public.account.account_id 
        WHERE inv_id = $1
        ORDER BY comment_id ASC`,
      [inv_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryDetail error " + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventory,
  getInventoryById,
  updateInventory,
  deleteInventoryItem,
  fixUpdate,
  sendComment,
  getCommentByInventoryId,
};