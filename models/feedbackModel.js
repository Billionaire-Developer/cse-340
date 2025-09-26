// models/feedbackModel.js
const pool = require("../database/");

/**
 * @module feedbackModel
 */

/**
 * Inserts new feedback into the database.
 * @param {Object} feedback - The feedback object containing name, email, and message.
 * @returns {Promise<Object>} The result of the database operation.
 */
async function addFeedback(feedback) {
    const query = `INSERT INTO feedback (customer_name, email, message) VALUES ($1, $2, $3) RETURNING *`;
    const values = [feedback.customer_name, feedback.email, feedback.message];
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Unable to add feedback: ' + error.message);
    }
}

/**
 * Retrieves all feedback from the database.
 * @returns {Promise<Array>} An array of feedback objects.
 */
async function getAllFeedback() {
    const query = 'SELECT * FROM feedback ORDER BY created_at DESC';
    try {
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        throw new Error('Unable to retrieve feedback: ' + error.message);
    }
}

module.exports = { addFeedback, getAllFeedback };