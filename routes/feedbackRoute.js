// routes/feedbackRoute.js
const express = require('express');
const { body } = require('express-validator');
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

router.get('/feedback', feedbackController.showFeedbackForm);
router.post('/feedback', [
    body('customer_name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Invalid email.'),
    body('message').notEmpty().withMessage('Message is required.')
], feedbackController.submitFeedback);
router.get('/admin/feedbacks', feedbackController.viewFeedback);

module.exports = router;