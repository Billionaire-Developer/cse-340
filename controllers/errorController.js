// controllers/errorController.js
exports.triggerError = (req, res, next) => {
    try {
      // Intentionally throw an error to simulate a 500 error
      throw new Error('This is an intentional 500 error!');
    } catch (err) {
      next(err); // Pass the error to the middleware
    }
  };