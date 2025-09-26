// controllers/feedbackController.js
const feedbackModel = require('../models/feedbackModel');
const { validationResult } = require('express-validator');

/**
 * @module feedbackController
 */

/**
 * Renders the feedback form view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const showFeedbackForm = (req, res) => {
    res.render('feedback', { title: 'Customer Feedback' });
};

/**
 * Handles feedback submission.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const submitFeedback = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('feedback', {
            title: 'Customer Feedback',
            errors: errors.array(),
        });
    }

    try {
        const feedback = {
            customer_name: req.body.customer_name,
            email: req.body.email,
            message: req.body.message,
        };
        await feedbackModel.addFeedback(feedback);
        req.flash('success', 'Thank you for your feedback!');
        res.redirect('/feedback');
    } catch (error) {
        req.flash('error', 'Error submitting feedback. Please try again.');
        res.redirect('/feedback');
    }
};

/**
 * Renders the admin view with all feedback.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const viewFeedback = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.getAllFeedback();
        res.render('admin/feedbacks', { title: 'Feedbacks', feedbacks });
    } catch (error) {
        req.flash('error', 'Unable to retrieve feedbacks.');
        res.redirect('/');
    }
};

module.exports = { showFeedbackForm, submitFeedback, viewFeedback };